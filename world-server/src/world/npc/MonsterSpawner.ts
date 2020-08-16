import { Entity } from "../Entity";
import { MonsterType } from "./MonsterType";
import { Vector2 } from "../Math";

export class MonsterSpawner extends Entity {
    public monsterType: MonsterType;
    public spawnRate: Number;
    public spawnRadius: Number;
    // The radius that the monsters spawned from the spawner can operate in
    public influenceRadius: Number;
    public maxMonsters: Number;
    public currentMonsters: Number;

    constructor(
        id: Number,
        position: Vector2,
        monsterType: MonsterType,
        spawnRate: Number,
        spawnRadius: Number,
        influenceRadius: Number,
        maxMonsters: Number,
        currentMonsters: Number
    ) {
        super(id, position);
        this.monsterType = monsterType;
        this.spawnRate = spawnRate;
        this.spawnRadius = spawnRadius;
        this.influenceRadius = influenceRadius;
        this.maxMonsters = maxMonsters;
        this.currentMonsters = currentMonsters;
    }
}
