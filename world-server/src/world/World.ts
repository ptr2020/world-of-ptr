import { Player, Bullet } from "./player";
import { Monster, MonsterSpawner } from "./npc";
import { Pickup } from "./pickup";
import { ShopItem, ITEM_TYPE } from "./shop";
import { WorldTile, TILE_TYPES } from "./WorldTile";
import { randomBytes } from "crypto";
import { PlayerHandler } from './player';

import { Router } from 'world-core';
import random = require('random');
import seedrandom = require('seedrandom');
import SimplexNoise = require('simplex-noise');
import { setImmediate } from "timers";
import * as MathWOP from "./Math";
import { ChatHandler } from "./chat/ChatHandlers";

export class World {
    private playerMsgHandler: PlayerHandler;
    private chatMsgHandler: ChatHandler;

    public players: Player[];
    public monsters: Monster[];
    public pickups: Pickup[];
    public monsterSpawners: MonsterSpawner[];
    public bullets: Bullet[];

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

        this.playerMsgHandler = new PlayerHandler(this.players, this.bullets, this.startGameTime);
        Router.register(this.playerMsgHandler);

        this.chatMsgHandler = new ChatHandler(100, this.players);
        Router.register(this.chatMsgHandler);
    }

    init() {
        // Generate random game seed upon initialization
        let randBytes = randomBytes(4);
        this.gameSeed = randBytes.toString();

        this.generateWorld();
        this.populateShopItems();

        this.setupGameTick()
    }

    setupGameTick(){
        let average = 0;
        // Send periodic ticks per second
        let debugTicks = false;
        let notificationInterval = 20;
        if(debugTicks){
            setInterval(() => {
                average = (average + this.ticks / notificationInterval) / 2;
                this.ticks = 0;
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
                let deltaPosition = MathWOP.vectorScale(player.velocity, this.frametime);
                player.position = MathWOP.vectorAdd(player.position, deltaPosition);
            }
        }

        // For now we assume that the server and client are synced in deleting the bullet
        // The difference is at most the ping of the client but that comes with multiplayer games.
        for(let i = 0; i < this.bullets.length; i++){
            let bullet = this.bullets[i];
            if(Date.now() - bullet.lifeStart > bullet.lifetime){
                this.bullets.splice(i, 1);
            }
        }

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
                this.worldTiles[i][j] = { tileType: 0};
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
        for (let t = 8; t < 65; t += 11) {
            for (let u = 8; u < 65; u += 11) {
                this.worldTiles[t][u].tileType = shop_id;
            }
        }
        // TODO: generate world :) : in progress
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
}
