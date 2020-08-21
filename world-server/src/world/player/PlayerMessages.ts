import { Messages } from 'world-core';
import { Vector2 } from '../Math';

export abstract class PlayerMessage implements Messages.Message {
    public id?: string;
    public clientId!: string;
    public type!: string;
}

export class PlayerJoinMessage extends PlayerMessage {
    constructor(id: string, name: string, pos: Vector2) {
        super();

        this.type = 'player.join';
        this.id = id;
        this.name = name;
        this.pos = pos;
    }

    public name: string;
    public pos: Vector2;
}

export class PlayerMoveMessage extends PlayerMessage {
    constructor(id: string, pos: Vector2, vel: Vector2, r: boolean) {
        super();
        
        this.type = 'player.move';
        this.id = id;
        this.pos = pos;
        this.vel = vel;
        this.r = r;
    }

    public pos: Vector2;
    public vel: Vector2;
    public r: boolean;
}

export class PlayerRotateMessage extends PlayerMessage {
    constructor(id: string, dir: number) {
        super();

        this.type = 'player.rotate';
        this.id = id;
        this.dir = dir;
    }

    public dir: number;
}

export class PlayerLeaveMessage extends PlayerMessage {
    constructor(id: string) {
        super();
        
        this.type = 'player.leave';
        this.id = id;
        this.clientId = id;
    }
}

export class PlayerShootMessage extends PlayerMessage {
    constructor(id: string, pos: Vector2, vel: Vector2, damage: number, lifetime: number){
        super();
        this.type = 'player.shoot';
        this.id = id;
        this.pos = pos;
        this.vel = vel;
        this.damage = damage;
        this.lifetime = lifetime;
    }

    public pos: Vector2;
    public vel: Vector2;
    public damage: number;
    public lifetime: number;
}
export class PlayerNameMessage extends PlayerMessage {
    public name: string;

    constructor(id: string, name: string) {
        super();
        
        this.type = 'player.changename';
        this.id = id;
        this.name = name;
    }
}

export class PlayerHealthMessage extends PlayerMessage {
    constructor(id: string, deltaHealth: number) {
        super();
        
        this.type = 'player.health';
        this.id = id;
        this.deltaHealth = deltaHealth;
    }
    public deltaHealth: number;

}

export class PlayerRespawnMessage extends PlayerMessage {
    constructor(id: string, pos: Vector2) {
        super();
        
        this.type = 'player.respawn';
        this.id = id;
        this.pos = pos;
    }
    public pos: Vector2;

}

export class PlayerDieMessage extends PlayerMessage {
    constructor(id: string , respawnTime: number) {
        super();

        this.type = 'player.die';
        this.id = id;
        this.respawnTime = respawnTime;
    }
    public respawnTime: number;

}

export class PlayerSniperMessage extends PlayerMessage {
    constructor(id: string, sniperMode: boolean) {
        super();
        this.type = 'player.sniper';
        this.id = id;
        this.sniperMode = sniperMode;
    }

    public sniperMode: boolean;
}