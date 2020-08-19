import { Entity } from "../Entity";
import { Vector2 } from "../Math";

export class Pickup extends Entity {
    public scoreOnPickup: number;

    constructor(id: string, position: Vector2, scoreOnPickup: number = 100){
        super(position);
        this.scoreOnPickup = scoreOnPickup;
    }

    //TODO: Handle pickup logic and upgrades
    public onPickup(){

    }
}
