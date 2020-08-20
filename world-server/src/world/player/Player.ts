import { Entity } from "../Entity";
import { Vector2 } from "../Math";
import { Weapon } from "./Weapon";
import { ShopItem } from "../shop";
import { Router } from "world-core";
import { BroadcastMessage } from "../../network";
import { PlayerDieMessage, PlayerRespawnMessage } from "./PlayerMessages";

export class Player extends Entity {
    public health: number;
    public maxHealth: number;
    public name: string;
    public speed: number;
    public coins: number;
    public weapon: Weapon;
    public score: number = 0;
    public direction: number = 0;
    public initialposition: Vector2;
    public respawnTime: number = 10;

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
        super(position);
        this.id = id;
        this.maxHealth = maxHealth;
        this.health = this.maxHealth;
        this.name = name;
        this.speed = speed;
        this.coins = coins;
        this.weapon = weapon;
        this.initialposition = position;
        
    }

    addScore(score: number){
        this.score += score;
    }

    addHealth(health: number){
        this.health += health;
        if(this.health <= 0){
            return false;
        }
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }
        return true;
    }

    addCoins(coins: number){
        if(this.coins + coins >= 0){
            this.coins += coins;
            return true;
        } else {
            return false;
        }
    }

    respawn(emitMessage: boolean){
        // TODO: respawn logic
        let respawnPos = { 
            x: 100 + Math.random() * 1720, // 1920 je sirina, 100 px margin na vsaki strani mape
            y: 100 + Math.random() * 1720  // 1920 je visina, 100 px margin na vsaki strani mape
        }; 

        if (emitMessage) {
            let respawnMessage = new PlayerRespawnMessage(this.id, respawnPos);
            Router.emit(new BroadcastMessage(respawnMessage));
        }

        this.health = this.maxHealth;
        this.position = respawnPos;
        return respawnPos;
    }

    die(){
        // TODO: dying logic
        
        this.addScore(-Math.min(this.score, 100));
        this.addCoins(-Math.min(this.coins, 50));
        setTimeout(() => { this.respawn(true)}, this.respawnTime * 1000);
        
    } 
    

    shoot(){
        // TODO: shooting logic
    }

    buyItem(item: ShopItem){
        // Buying logic
    }
}
