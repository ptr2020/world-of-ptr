import { Messages, Router, Logger } from 'world-core';
import { PlayerMessage, PlayerMoveMessage, PlayerJoinMessage, PlayerLeaveMessage, PlayerNameMessage } from './PlayerMessages';
import { SendMessage, BroadcastMessage } from '../../network';

import { Player } from './Player';

export class PlayerHandler implements Messages.MsgHandler {
    private players: Player[];

    constructor(players: Player[]) {
        this.players = players;
    }

    public getTypes(): string[] {
        return ['player.join', 'player.leave', 'player.move', 'player.changename'];
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

        let player = this.players.find(p => p.id == message.id!);
        switch (message.type) {
            case 'player.join':
                let joinMessage = message as PlayerJoinMessage;

                joinMessage.id = msg.clientId!;
                joinMessage.name = `Player ${joinMessage.id}`;

                // Notify everybody else that player joined
                Router.emit(new BroadcastMessage(joinMessage));

                this.addPlayer(joinMessage);
                // Emit join messages to new client so we are aware of everyone
                for (let otherPlayer of this.players) {
                    // Don't send my own data back
                    if (otherPlayer.id == joinMessage.id) {
                        continue;
                    }

                    let emitMsg = new PlayerJoinMessage(otherPlayer.id, otherPlayer.name, otherPlayer.position);
                    Router.emit(new SendMessage(joinMessage.id, emitMsg));
                }

                break;

            case 'player.move':
                let moveMsg = message as PlayerMoveMessage;
                // In reality, server should validate received pos with it's own and send back corrections
                player!.position = { x: moveMsg.pos.x, y: moveMsg.pos.y };
                player!.velocity = { x: moveMsg.vel.x, y: moveMsg.vel.y };
                Router.emit(new BroadcastMessage(moveMsg));
                break;

            case 'player.leave':
                let leaveMessage = message as PlayerLeaveMessage;
                let index = this.players.indexOf(player!);
                if (index < 0) {
                    Logger.error(`Player ${leaveMessage.id!} trying to leave but server doesn't know this player`);
                    break;
                }

                this.players.splice(index, 1);
                Router.emit(new BroadcastMessage(message));
                break;

            case 'player.changename':
                let nameMessage = message as PlayerNameMessage;
                player!.name = nameMessage.name;

                Router.emit(new BroadcastMessage(nameMessage));
                break;

        }
    }

    private addPlayer(msg: PlayerJoinMessage): void {
        let player = new Player(msg.id!, undefined, msg.name, 100, 0, 0, undefined);
        player.position = msg.pos;

        this.players.push(player);
    }
}
