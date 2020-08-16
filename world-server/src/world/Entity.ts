import { Vector2 } from "./Math";
import { Object } from "./Object";

export abstract class Entity extends Object {
    public id: Number;
    public position: Vector2;
    public velocity: Vector2;

    constructor(id: Number, position: Vector2, velocity: Vector2 = {x: 0, y: 0}) {
        super();
        this.position = position;
        this.velocity = velocity;
        this.id = id;
    }
}
