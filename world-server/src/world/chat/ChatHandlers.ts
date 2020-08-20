import { Messages, Router, Logger } from 'world-core';
import { BroadcastMessage } from '../../network';
import { ChatMessage } from './ChatMessages';
import { Player } from '../player';

export class ChatHandler implements Messages.MsgHandler {
    private maxLength: number;
    private players: Player[];

    constructor(maxLength: number, players: Player[]){
        this.maxLength = maxLength
        this.players = players;
    }

    public getTypes(): string[] {
        return ['chat.say'];
    }

    public validate(msg: Messages.Message): boolean {
        let message = msg as ChatMessage;

        if (msg.clientId! != message.id!) {
            Logger.warn(`Client ${msg.clientId!} trying to send message as ${message.id!}`);
            return false;
        }

        if (!message.text) {
            return false;
        }

        if (message.text.length > this.maxLength) {
            Logger.warn(`Received too long message from ${msg.clientId!}`, { length: message.text.length });
            return false;
        }

        return true;
    }

    public handle(msg: Messages.Message): void {
        let message = msg as ChatMessage;
        switch (message.type) {
            case 'chat.say':
                let chatMessage = message as ChatMessage;
                chatMessage.id = msg.clientId;
                // Set player name from server state so receiving clients don't need to search for player
                let player = this.players.find(p => p.id == msg.clientId);
                chatMessage.name = player?.name;
                // Notify everybody else that player said something
                Router.emit(new BroadcastMessage(chatMessage));
                break;
        }
    }

}
