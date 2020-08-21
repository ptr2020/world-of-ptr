import { Messages } from 'world-core';

export class GameTimeMessage implements Messages.Message {
    public type: string;
    public startGameTime: Date;

    constructor(startGameTime: Date) {
        this.type = "game.time.start";
        this.startGameTime = startGameTime;
    }
}
