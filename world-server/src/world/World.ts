import { Player } from "./player";
import { Monster, MonsterSpawner } from "./npc";
import { Pickup } from "./pickup";
import { ShopItem } from "./shop";
import { WorldTile } from "./WorldTile";

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

    public gameTime: Number;
    // List of players sorted by descending score
    public scoreboard: String[];
    public gameSeed: Number;
}
