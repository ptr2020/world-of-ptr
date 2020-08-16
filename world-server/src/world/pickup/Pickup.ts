import { Entity } from "../Entity";
import { Vector2 } from "../Math";

export class Pickup extends Entity {
    public scoreOnPickup: Number;

    constructor(id: Number, position: Vector2, scoreOnPickup: Number = 100){
        super(id, position);
        this.scoreOnPickup = scoreOnPickup;
    }

    //TODO: Handle pickup logic and upgrades
    public onPickup(){

    }
}
