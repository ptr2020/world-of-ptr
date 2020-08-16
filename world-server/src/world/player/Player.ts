import { Entity } from "../Entity";
import { Vector2 } from "../Math";
import { Weapon } from "./Weapon";

export class Player extends Entity {
    public health: Number;
    public maxHealth: Number;
    public name: String;
    public speed: Number;
    public coins: Number;
    public weapon: Weapon;
    public score: Number = 0;
    public direction: Number = 0;

    // PLACEHOLDER UNTIL IT IS DECIDED HOW WE DIFFERENTIATE THE PLAYERS
    public texture;

    constructor(
        id: Number,
        position: Vector2 = { x: 0, y: 0 },
        name: String = "Player",
        maxHealth: Number = 100,
        speed: Number = 10,
        coins: Number = 100,
        weapon: Weapon = {
            firerate: 10,
            damage: 20,
            bulletSize: 5,
            bulletSpread: 0,
            texture: 'PLACEHOLDER'
        }
    ) {
        super(id, position);
        this.maxHealth = maxHealth;
        this.health = this.maxHealth;
        this.name = name;
        this.speed = speed;
        this.coins = coins;
        this.weapon = weapon;
    }
}
