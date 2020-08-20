import { Vector2 } from "./Math";
import { GameObject } from "./Object";

export abstract class Entity extends GameObject {
    public position: Vector2;
    public velocity: Vector2;

    constructor(position: Vector2, velocity: Vector2 = {x: 0, y: 0}) {
        super();
        this.position = position;
        this.velocity = velocity;
    }
}
