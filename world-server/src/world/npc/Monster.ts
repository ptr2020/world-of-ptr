import { Entity } from "../Entity";
import { Vector2 } from "../Math";
import { Pickup } from "../pickup";
import { MonsterType } from "./MonsterType";
import { MonsterSpawner } from "./MonsterSpawner";

export class Monster extends Entity{
    public health: Number;
    public monsterType: MonsterType;
    public direction: Number = 0;

    public currentTargetID: Number;

    public spawnerPosition: Vector2;
    public spawnerID: Number;
    // Maximum distance permitted from the spawner
    public influenceRadius: Number;

    constructor(
        id: Number,
        position: Vector2,
        monsterType: MonsterType,
        spawnerID: Number,
        spawnerPosition: Vector2,
        influenceRadius: Number
    ){
        super(id, position);
        this.monsterType = monsterType;
        this.spawnerID = spawnerID;
        this.spawnerPosition = spawnerPosition;
        this.influenceRadius = influenceRadius;
    }

    //TODO
    /**
     * dropped item
     * original spawner
     * range from spawner
     */
}