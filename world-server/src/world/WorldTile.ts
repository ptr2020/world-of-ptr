import { Vector2 } from "./Math";

export interface WorldTile extends Object {  
    tileType: Number
}

// THIS TILE TYPES ENUMERATOR SHOULD BE USED TO DETERMINE THE TILE TYPE

export const TILE_TYPES = {
    GRASS_BIOME: 0,
    MUD_BIOME: 1,
    WATER_BIOME: 2,
    BUSH: 3,
    OBSTACLE: 4,
    SHOP_TILE: 5,
}
