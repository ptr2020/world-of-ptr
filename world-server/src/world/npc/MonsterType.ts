import { Pickup } from "../pickup";

export interface MonsterType {
    name: string,
    damage: number, 
    maxHealth: number,
    speed: number,
    scoreWorth: number
    targerDetectionRange: number,
    dropPickupUponDeath: Boolean,
    texture: string,
    dropPickup?: Pickup
}
