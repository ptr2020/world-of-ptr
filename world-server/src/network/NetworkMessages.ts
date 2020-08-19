import { Messages } from 'world-core';

export class SendMessage implements Messages.Message {
    public type: string;
    public clientId: string;
    public msg: Messages.Message;

    constructor(clientId: string, message: Messages.Message) {
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
