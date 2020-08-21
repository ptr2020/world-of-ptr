import { Entity } from "../Entity";
import { Vector2 } from "../Math";

export class Bullet extends Entity{
    public playerId: string;
    public damage: number;
    public lifetime: number;
    public lifeStart: number;

    constructor(id: string, pos: Vector2, vel: Vector2, playerId: string, damage: number, lifetime: number){
        super(pos, vel);
        this.id = id;
        this.playerId = playerId;
        this.damage = damage;
        this.lifetime = lifetime;
        this.lifeStart = Date.now();
    }
}
