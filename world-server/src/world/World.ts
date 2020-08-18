import { Player } from "./player";
import { Monster, MonsterSpawner } from "./npc";
import { Pickup } from "./pickup";
import { ShopItem, ITEM_TYPE } from "./shop";
import { WorldTile } from "./WorldTile";
import { randomBytes } from "crypto";
import { PlayerHandler } from './player';

import { Router } from 'world-core';

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
    public gameSeed: number = 0;

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
        this.gameSeed = randBytes.readUInt32BE();
    
        this.generateWorld();
        this.populateShopItems();

    }

    generateWorld(){
        // TODO: generate world :)
        // Monsters spawners, pickups
        // Use this.gameSeed
    }

    populateShopItems(){
        // The first gun item is only an example, follow it to add more items
        // Refer to ShopItem.ts for the item types
        this.shopItems = [
            new ShopItem("Gun", 100, ITEM_TYPE.WEAPON_DMG, 10)
        ];
    }
}
