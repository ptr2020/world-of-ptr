import { Messages } from 'world-core';
import { Vector2 } from '../Math';

export abstract class PlayerMessage implements Messages.Message {
    public id?: number;
    public type: string;
}

export class PlayerJoinMessage extends PlayerMessage {
    public name: string;
    public pos: Vector2;
}

export class PlayerMoveMessage extends PlayerMessage {
    public pos: Vector2;
    public vel: Vector2;
}

export class PlayerLeaveMessage extends PlayerMessage {
}
