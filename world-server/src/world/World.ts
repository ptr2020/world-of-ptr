import { Player } from "./player";
import { Monster, MonsterSpawner } from "./npc";
import { Pickup } from "./pickup";
import { ShopItem, ITEM_TYPE } from "./shop";
import { WorldTile } from "./WorldTile";
import { randomBytes } from "crypto";

export class World {
    public players: Player[];
    public monsters: Monster[];
    public pickups: Pickup[];
    public monsterSpawners: MonsterSpawner[];

    // This should be populated at the start of the game with all the items
    // that will be available for purchase
    public shopItems: ShopItem[];
    // This should be populated according to the seed
    public worldTiles: WorldTile[][];

    // The time left in the game in seconds
    public gameTime: Number;
    // List of players sorted by descending score
    public scoreboard: String[];
    public gameSeed: Number;

    constructor(gameTime: Number){
        this.gameTime = gameTime
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
