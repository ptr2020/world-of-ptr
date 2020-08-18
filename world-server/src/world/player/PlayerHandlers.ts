import { Messages, Router, Logger } from 'world-core';
import { PlayerMessage, PlayerMoveMessage, PlayerJoinMessage, PlayerLeaveMessage } from './PlayerMessages';
import { SendMessage, BroadcastMessage } from '../../network';

import { Player } from './Player';

export class PlayerHandler implements Messages.MsgHandler {
    private players: Player[];
    private nextId: number;

    constructor(players: Player[]) {
        this.players = players;
        this.nextId = 1;
    }

    public getTypes(): string[] {
        return ['player.join', 'player.leave', 'player.move'];
    }

    public validate(msg: Messages.Message): boolean {
        // TODO: Implement some basic validation logic so we don't just blindly accept packets
        return true;
    }

    public handle(msg: Messages.Message): void {
        let message = msg as PlayerMessage;
        if (message == null || message == undefined) {
            Logger.warn(`Received player message does not extend PlayerMessage`);
            return;
        }

        let player = this.players.find(p => p.id == message.id);
        switch (message.type) {
            case 'player.join':
                let joinMessage = message as PlayerJoinMessage;

                joinMessage.id = this.nextId++;
                joinMessage.name = `Player ${joinMessage.id}`;

                Router.emit(new SendMessage(joinMessage.id, joinMessage));
                Router.emit(new BroadcastMessage(joinMessage));

                break;

            case 'player.move':
                Router.emit(new BroadcastMessage(message));
                break;

            case 'player.leave':
                let leaveMessage = message as PlayerLeaveMessage;
                // TODO: Remove from internal storage
                Router.emit(new BroadcastMessage(message));
                break;
        }
    }

}