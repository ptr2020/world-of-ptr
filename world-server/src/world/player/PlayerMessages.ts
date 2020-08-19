import { Messages } from 'world-core';
import { Vector2 } from '../Math';

export abstract class PlayerMessage implements Messages.Message {
    public id?: string;
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
    constructor(id: string, pos: Vector2, vel: Vector2) {
        super();
        
        this.type = 'player.move';
        this.id = id;
        this.pos = pos;
        this.vel = vel;
    }

    public pos: Vector2;
    public vel: Vector2;
}

export class PlayerLeaveMessage extends PlayerMessage {
    constructor(id: string) {
        super();
        
        this.type = 'player.leave';
        this.id = id;
    }
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
