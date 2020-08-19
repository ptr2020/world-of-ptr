import { Entity } from "../Entity";
import { MonsterType } from "./MonsterType";
import { Vector2 } from "../Math";

export class MonsterSpawner extends Entity {
    public monsterType: MonsterType;
    public spawnRate: number;
    public spawnRadius: number;
    // The radius that the monsters spawned from the spawner can operate in
    public influenceRadius: number;
    public maxMonsters: number;
    public currentMonsters: number;

    constructor(
        id: string,
        position: Vector2,
        monsterType: MonsterType,
        spawnRate: number,
        spawnRadius: number,
        influenceRadius: number,
        maxMonsters: number,
        currentMonsters: number
    ) {
        super(position);
        this.monsterType = monsterType;
        this.spawnRate = spawnRate;
        this.spawnRadius = spawnRadius;
        this.influenceRadius = influenceRadius;
        this.maxMonsters = maxMonsters;
        this.currentMonsters = currentMonsters;
    }
}
