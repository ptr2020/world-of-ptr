import { Vector2 } from "./Math";
import { GameObject } from "./Object";

export abstract class Entity extends GameObject {
    public id: number;
    public position: Vector2;
    public velocity: Vector2;

    constructor(id: number, position: Vector2, velocity: Vector2 = {x: 0, y: 0}) {
        super();
        this.position = position;
        this.velocity = velocity;
        this.id = id;
    }
}
