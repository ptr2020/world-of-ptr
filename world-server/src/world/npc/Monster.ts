import { Entity } from "../Entity";
import { Vector2 } from "../Math";
import { Pickup } from "../pickup";
import { MonsterType } from "./MonsterType";
import { MonsterSpawner } from "./MonsterSpawner";

export class Monster extends Entity {
    public health: number;
    public monsterType: MonsterType;
    public direction: number = 0;

    public currentTargetID: number = 0;

    public spawnerPosition: Vector2;
    public spawnerID: number;
    // Maximum distance permitted from the spawner
    public influenceRadius: number;

    constructor(
        id: number,
        position: Vector2,
        monsterType: MonsterType,
        spawnerID: number,
        spawnerPosition: Vector2,
        influenceRadius: number
    ) {
        super(id, position);
        this.monsterType = monsterType;
        this.health = monsterType.maxHealth;
        this.spawnerID = spawnerID;
        this.spawnerPosition = spawnerPosition;
        this.influenceRadius = influenceRadius;
    }

    checkHealth() {
        if (this.health <= 0) {
            this.die();
        }
    }

    addHealth(health: number) {
        this.health += health;
        this.checkHealth();
    }

    die() {
        // TODO: dying logic
    }
}
