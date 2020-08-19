import { Player } from "./player";
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

export class World {
    private playerMsgHandler: PlayerHandler;

    public players: Player[];
    public monsters: Monster[];
    public pickups: Pickup[];
    public monsterSpawners: MonsterSpawner[];

    // This should be populated at the start of the game with all the items
    // that will be available for purchase
    public shopItems: ShopItem[] = [];
    // This should be populated according to the seed
    public worldTiles: WorldTile[][] = [];

    // The time left in the game in seconds
    public gameTime: number = 0;
    // List of players sorted by descending score
    public scoreboard: string[] = [];
    public gameSeed: string = "";

    private terrainFrequency: number = 0.1; 

    constructor(gameTime: number){
        this.gameTime = gameTime;

        this.players = [];
        this.monsters = [];
        this.pickups = [];
        this.monsterSpawners = [];

        this.shopItems = [];
        this.worldTiles = [];

        this.playerMsgHandler = new PlayerHandler(this.players);
        Router.register(this.playerMsgHandler);
    }

    init() {
        // Generate random game seed upon initialization
        let randBytes = randomBytes(4);
        this.gameSeed = randBytes.toString();

        this.generateWorld();
        this.populateShopItems();

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

        for (let i = 0; i < 65; i++) {
            for (let j = 0; j < 65; j++) {
                process.stdout.write(this.worldTiles[i][j].tileType.toString());
            }
            process.stdout.write("\n");
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
