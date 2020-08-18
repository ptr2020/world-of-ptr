import { Messages } from 'world-core';

export class SendMessage implements Messages.Message {
    public type: string;
    public clientId: number;
    public msg: Messages.Message;

    constructor(clientId: number, message: Messages.Message) {
        this.type = 'network.send';
        this.msg = message;
        this.clientId = clientId;
    }
}

export class BroadcastMessage implements Messages.Message {
    public type: string;
    public msg: Messages.Message;

    constructor(message: Messages.Message) {
        this.type = 'network.broadcast';
        this.msg = message;
    }
}
