import { Entity } from "../Entity";
import { Vector2 } from "../Math";
import { Weapon } from "./Weapon";
import { ShopItem } from "../shop";

export class Player extends Entity {
    public health: number;
    public maxHealth: number;
    public name: string;
    public speed: number;
    public coins: number;
    public weapon: Weapon;
    public score: number = 0;
    public direction: number = 0;

    // PLACEHOLDER UNTIL IT IS DECIDED HOW WE DIFFERENTIATE THE PLAYERS
    public texture = 'PLACEHOLDER';

    constructor(
        id: string,
        position: Vector2 = { x: 0, y: 0 },
        name: string = "Player",
        maxHealth: number = 100,
        speed: number = 10,
        coins: number = 100,
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

    addScore(score: number){
        this.score += score;
    }

    addHealth(health: number){
        this.health += health;
        this.checkHealth();
    }

    addCoins(coins: number){
        if(this.coins + coins >= 0){
            this.coins += coins;
            return true;
        } else {
            return false;
        }
    }

    respawn(){
        // TODO: respawn logic
    }

    die(){
        // TODO: dying logic
    }

    checkHealth(){
        if(this.health <= 0){
            this.die()
        }
    }

    shoot(){
        // TODO: shooting logic
    }

    buyItem(item: ShopItem){
        // Buying logic
    }
}
