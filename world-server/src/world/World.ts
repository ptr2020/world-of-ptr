import { Player, Bullet } from "./player";
import { Monster, MonsterSpawner } from "./npc";
import { Pickup } from "./pickup";
import { ShopItem, ITEM_TYPE } from "./shop";
import { WorldTile, TILE_TYPES } from "./WorldTile";
import { randomBytes, KeyObject } from "crypto";
import { PlayerHandler } from './player';

import { Router } from 'world-core';
import random = require('random');
import seedrandom = require('seedrandom');
import SimplexNoise = require('simplex-noise');
import { Quadtree, quadtree } from 'd3-quadtree';
import { Entity } from "./Entity";
import { setImmediate } from "timers";
import * as MathWOP from "./Math";
import { ChatHandler } from "./chat/ChatHandlers";
import { BulletHitMessage, PlayerHealthMessage, PlayerDieMessage } from "./player/PlayerMessages";
import { BroadcastMessage } from "../network";
import { ScoreboardHandler } from "./scoreboard/ScoreboardHandler";

export class World {
    private playerMsgHandler: PlayerHandler;
    private scoreboardHandler: ScoreboardHandler;
    private chatMsgHandler: ChatHandler;

    public players: Player[];
    public monsters: Monster[];
    public pickups: Pickup[];
    public monsterSpawners: MonsterSpawner[];
    public bullets: Bullet[];
    public collisionTree: Quadtree<Player>;
    public data: WorldTile[][] = [];
    public spriteWidth: 64;
    public bulletWidth: 16;
    public bulletHeight: 4;
    public bulletAngle: 0;
    // This should be populated at the start of the game with all the items
    // that will be available for purchase
    public shopItems: ShopItem[] = [];
    // This should be populated according to the seed
    public worldTiles: WorldTile[][] = [];

    // The time left in the game in seconds
    public gameTime: number = 0;
    public startGameTime: Date;
    // List of players sorted by descending score
    public scoreboard: string[] = [];
    public gameSeed: string = "";

    private terrainFrequency: number = 0.1;

    private gameFPS: number = parseInt(process.env.GAME_TICKS_PER_SECOND!, 10);
    private frametime = 1000000 / this.gameFPS;
    private physFrametime = 1 / this.gameFPS;
    private ticks = 0;

    constructor(){
        this.startGameTime = new Date();
        this.gameTime = parseInt(process.env.GAME_DURATION!, 10);

        this.players = [];
        this.monsters = [];
        this.pickups = [];
        this.monsterSpawners = [];
        this.bullets = [];
        this.shopItems = [];
        this.worldTiles = [];
        this.collisionTree = quadtree();
        this.data = [];
        this.spriteWidth = 64;
        this.bulletWidth = 16;
        this.bulletHeight = 4;
        this.bulletAngle = 0;
        /*         this.players.push(new Player("123123123", {x: 100, y: 100}));
                this.players.push(new Player("123122321313123", {x: 110, y: 110}))
                this.players.push(new Player("123123123", {x: 1020, y: 1020}));
                this.players.push(new Player("123122321313123", {x: 1210, y: 1210}))
                this.players.push(new Player("123123123", {x: 1200, y: 1200}));
                this.players.push(new Player("123122321313123", {x: 1210, y: 1101})) */

        this.playerMsgHandler = new PlayerHandler(this.players, this.bullets, this.startGameTime);
        Router.register(this.playerMsgHandler);

        this.chatMsgHandler = new ChatHandler(100, this.players);
        Router.register(this.chatMsgHandler);

        this.scoreboardHandler = new ScoreboardHandler(this.players);
        Router.register(this.scoreboardHandler);
    }

    init() {
        // Generate random game seed upon initialization
        let randBytes = randomBytes(4);
        this.gameSeed = randBytes.toString();

        this.generateWorld();
        this.populateShopItems();
        this.generateWorldTree();

        this.setupGameTick();
    }

    setupGameTick(){
        let average = 60;
        // Send periodic ticks per second
        let debugTicks = false;
        let notificationInterval = 3;
        if(debugTicks){
            setInterval(() => {
                average = (average + this.ticks / notificationInterval) / 2;
                this.ticks = 0;
                console.log(average.toFixed(2));
            }, notificationInterval * 1000);
        }

        this.runGameTick(this.getMicroseconds());
    }

    getMicroseconds(){
        let hrTime = process.hrtime();
        return hrTime[0] * 1000000 + hrTime[1] / 1000;
    }

    runGameTick(startTime: number){
        if(this.getMicroseconds() - startTime > this.frametime){
            this.gameTick();
            this.ticks++;
            startTime = this.getMicroseconds();
        }
        setImmediate(() => this.runGameTick(startTime));
    }

    gameTick(){
        // Physics logic here
        // https://github.com/photonstorm/phaser/blob/ed33253fb1c1167765181c6e984cfdbb8c905d87/src/physics/arcade/Body.js#L1020
        // Sample update velocity

        for(let i = 0; i < this.players.length; i++){
            let player = this.players[i];
            if(player.velocity != {x: 0, y: 0}){
                let deltaPosition = MathWOP.vectorScale(player.velocity, this.physFrametime);
                player.position = MathWOP.vectorAdd(player.position, deltaPosition);
                player.direction = MathWOP.vectorAngle(player.velocity);
            }
        }

        // For now we assume that the server and client are synced in deleting the bullet
        // The difference is at most the ping of the client but that comes with multiplayer games.
        for(let i = 0; i < this.bullets.length; i++){
            let bullet = this.bullets[i];
            // Check if it should be deleted
            if(Date.now() - bullet.lifeStart > bullet.lifetime){
                this.bullets.splice(i, 1);
            }
            // Calculate physics
            if(bullet.velocity != {x: 0, y: 0}){
                let deltaPosition = MathWOP.vectorScale(bullet.velocity, this.physFrametime);
                bullet.position = MathWOP.vectorAdd(bullet.position, deltaPosition);
            }
        }

        this.colisions();

    }

    generateWorld() {
        /* var simplex = new SimplexNoise(this.gameSeed), value2d = simplex.noise2D(10, 10); */
        // gre skozi vsa polja
        for (let i = 0; i < 65; i++) {
            this.worldTiles[i] = [];
        }
        // GRASS and MUD
        for (let i = 0; i < 65; i++) {
            for (let j = 0; j < 65; j++) {
                this.worldTiles[i][j] = new WorldTile(0, { x: j, y: i });
                var item = this.worldTiles[i][j].tileType;
                // algoritem
                var simplex = new SimplexNoise(this.gameSeed), value2d = simplex.noise2D(i * this.terrainFrequency, j * this.terrainFrequency);
                value2d += 1;
                value2d = value2d / 2;
                if (value2d < 0.7) {

                    this.worldTiles[i][j].tileType = TILE_TYPES.GRASS_BIOME;
                } else {
                    this.worldTiles[i][j].tileType = TILE_TYPES.MUD_BIOME;
                }
            }
        }
        // WATER and OBSTACLE
        for (let i = 0; i < 65; i++) {
            for (let j = 0; j < 65; j++) {
                var item = this.worldTiles[i][j].tileType;
                // algoritem
                var simplex = new SimplexNoise(this.gameSeed), value2d = simplex.noise2D(i * this.terrainFrequency, j * this.terrainFrequency);
                value2d += 1;
                value2d = value2d / 2;

                if (value2d < 0.1) {
                    this.worldTiles[i][j].tileType = TILE_TYPES.WATER_BIOME;
                } else if (value2d >= 0.9) {
                    this.worldTiles[i][j].tileType = TILE_TYPES.OBSTACLE;
                }
            }
        }


        random.use(seedrandom(this.gameSeed));

        // da BUSHES
        for (let i = 0; i < 65; i++) {
            for (let j = 0; j < 65; j++) {
                // algoritem
                var randomNum = random.float();
                if (randomNum < 0.05) {
                    this.worldTiles[i][j].tileType = TILE_TYPES.BUSH;
                }
            }
        }
        // end of da BUSHES

        // hardcode shop tiles
        var shop_id = TILE_TYPES.SHOP_TILE;
        for (let t = 15; t < 65; t += 15) {
            for (let u = 15; u < 65; u += 15) {
                this.worldTiles[t][u].tileType = shop_id;
            }
        }

        // Monsters spawners, pickups
        // Use this.gameSeed: Done
    }

    populateShopItems() {
        // The first gun item is only an example, follow it to add more items
        // Refer to ShopItem.ts for the item types
        this.shopItems = [
            new ShopItem("Gun", 100, ITEM_TYPE.WEAPON_DMG, 10)
        ];
    }

    generateWorldTree() {
        this.collisionTree = quadtree<Player>()
            .x(e => {
                return e.position.x;
            })
            .y(e => {
                return e.position.y
            })
            .addAll(this.players);
    }

    colisions() {
        this.generateWorldTree();
        // let toDelete = [];
        for (let i = 0; i < this.bullets.length; i++) {
            let bullet = this.bullets[i];
            let closest = this.collisionTree.find(bullet.position.x, bullet.position.y, this.spriteWidth);
            // No players are close, carry on
            if (closest == undefined) {
                continue;
            }
            if(closest.id == bullet.playerId) continue;
            if(closest.health <= 0) continue;
            let collision = this.checkCollision(closest, bullet);
            if(collision) {
                let bulletHitMsg = new BulletHitMessage(closest.id, bullet.id);
                Router.emit(new BroadcastMessage(bulletHitMsg));
                let healthMsg = new PlayerHealthMessage(closest.id, -bullet.damage);
                let isAlive = closest.addHealth(healthMsg.deltaHealth);

                Router.emit(new BroadcastMessage(healthMsg));
                if (!isAlive) {
                    let dieMessage = new PlayerDieMessage(
                        closest.id,
                        closest.respawnTime
                    );
                    Router.emit(new BroadcastMessage(dieMessage));
                    closest.die();
                    let killerIdx = this.players.findIndex(x => x.id == bullet.playerId);
                    this.players[killerIdx].addScore(300);
                }
                this.bullets.splice(i, 1);
            }
        }
    }

    checkCollision(player: Player, bullet: Bullet): boolean{
        let result = false;
        let playerCorners = this.getRectCorners(player.position, this.spriteWidth, this.spriteWidth);
        result = this.checkPointInRectangle(bullet.position, playerCorners);
        return result;
    }

    checkPointInRectangle(point: MathWOP.Vector2, rect: MathWOP.Vector2[]): boolean {
        let inRect = false;
        // Check only top-left(rect[0]) and bottom-right(rect[1]) points against our point
        if(point.x > rect[0].x && point.y > rect[0].y && point.x < rect[1].x && point.y < rect[1].y){
            inRect = true;
        }
        return inRect;
    }

    getRectCorners(position: MathWOP.Vector2, width: number, height: number){
        return [
            {
                x: position.x - width / 2,
                y: position.y - height / 2,
            },
            {
                x: position.x + width / 2,
                y: position.y + height / 2,
            },
        ];
    }
}
