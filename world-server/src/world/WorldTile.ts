import { Vector2 } from "./Math";
import { Entity } from "./Entity";

export class WorldTile extends Entity {  
    public tileType: number;
    constructor(tileType: number, position: Vector2){
        // multiply by 100 so it sets the pixel position value
        super({x: position.x * 100, y: position.y * 100}, { x: 0, y: 0});
        this.tileType = tileType;
    }
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
