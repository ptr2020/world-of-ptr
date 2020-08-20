import { Messages } from 'world-core';
import cryptoRandomString from 'crypto-random-string';

export class ChatMessage implements Messages.Message {
    constructor(id: string, text: string, name?: string) {
        this.type = 'chat.say';
        this.id = id;
        this.msgId = cryptoRandomString({ length: 10 });
        this.name = name;
        this.text = text;
    }

    public id?: string;
    public msgId!: string;
    public type!: string;
    public name?: string;
    public text: string;
}
