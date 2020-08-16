import { Pickup } from "../pickup";

export interface MonsterType {
    name: String,
    damage: Number, 
    maxHealth: Number,
    speed: Number,
    scoreWorth: Number
    targerDetectionRange: Number,
    dropPickupUponDeath: Boolean,
    texture: String,
    dropPickup?: Pickup
}
