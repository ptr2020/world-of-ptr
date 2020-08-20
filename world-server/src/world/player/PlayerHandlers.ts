import { Messages, Router, Logger } from 'world-core';
import { PlayerMessage, PlayerMoveMessage, PlayerJoinMessage, PlayerLeaveMessage, PlayerNameMessage, PlayerHealthMessage, PlayerRespawnMessage, PlayerDieMessage, PlayerShootMessage } from './PlayerMessages';
import { SendMessage, BroadcastMessage } from '../../network';

import { Player } from './Player';
import { Bullet } from './Bullet';
import { allowedNodeEnvironmentFlags } from 'process';

export class PlayerHandler implements Messages.MsgHandler {
    private players: Player[];
    private bullets: Bullet[];

    constructor(players: Player[], bullets: Bullet[]) {
        this.players = players;
        this.bullets = bullets;
    }

    // A few random names to return when player joins with an invalid name
    private randomFunnyNames: string[] = [
        "Al K. Holic",
        "Ben Dover",
        "Ivana Tinkle",
        "Ivana Humpalot",
        "April Pealot",
        "Harry Dickman",
        "Ben Gay",
        "Rosie Kuntz",
        "Dick Butkiss",
        "Pat Myass",
        "Belle E. Flopp",
        "Mr. Whiener",
        "Dick Smasher",
        "Jack Goff",
        "Justin Sider",
        "Willie Stroker",
    ];

    // Validate name is present, between 3 and 20 characters and only contains alphanumeric characters and spaces
    private validateName(name: string): boolean {
        if (!name) {
            return false;
        }

        if (!name.match(/^[\w ]+$/)) {
            return false;
        }
        for(let i = 0;i < this.players.length; i++){
            if(name == this.players[i].name){
                return false;
            }
        }

        return name.length > 3 && name.length < 20;
    }

    public getTypes(): string[] {
        return ['player.join', 'player.leave', 'player.move', 'player.health', 'player.respawn', 'player.shoot', 'player.changename' ];
    }

    public validate(msg: Messages.Message): boolean {
        switch (msg.type) {
            case 'player.changename':
                let nameMessage = msg as PlayerNameMessage;
                return this.validateName(nameMessage.name.trim());
        }

        return true;
    }

    public handle(msg: Messages.Message): void {
        let message = msg as PlayerMessage;
        if (message == null || message == undefined) {
            Logger.warn(`Received player message does not extend PlayerMessage`);
            return;
        }

        let player = this.players.find(p => p.id == message.clientId!);
        switch (message.type) {
            case 'player.join':
                let joinMessage = message as PlayerJoinMessage;
                joinMessage.id = msg.clientId!;
                if (joinMessage.name === null || !this.validateName(joinMessage.name)) {
                    joinMessage.name = this.randomFunnyNames[Math.floor(Math.random() * this.randomFunnyNames.length)];
                }

                let newPlayer = this.addPlayer(joinMessage);
                joinMessage.pos = newPlayer.position;

                // Notify everybody else that player joined
                Router.emit(new BroadcastMessage(joinMessage));

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
                
            case 'player.health':
                let healthMessage = message as PlayerHealthMessage;

                let isAlive = player!.addHealth(healthMessage.deltaHealth);
                Logger.info("Player health changed: "+ player!.health);

                Router.emit(new BroadcastMessage(message));

                if(!isAlive){
                    let dieMessage = new PlayerDieMessage(player!.id, player!.respawnTime );
                    Router.emit(new BroadcastMessage(dieMessage));
                    player!.die();
                    
                }
                break;

            case 'player.respawn':
                let respawnMessage = message as PlayerRespawnMessage;
                if(player?.die()) {
                    respawnMessage.pos = player.respawn(true);
                }

                Router.emit(new BroadcastMessage(message));
                break;
            
            case 'player.shoot':
                let shootMessage = message as PlayerShootMessage;
                // Uncomment this when we have a physics loop
                //this.bullets.push(new Bullet(shootMessage.pos, shootMessage.vel, player!.id, shootMessage.damage, shootMessage.lifetime));
                Router.emit(new BroadcastMessage(shootMessage));
                break;

            case 'player.changename':
                let nameMessage = message as PlayerNameMessage;

                player!.name = nameMessage.name.trim();
                Router.emit(new BroadcastMessage(nameMessage));
                break;

        }
    }

    private addPlayer(msg: PlayerJoinMessage): Player {
        let player = new Player(msg.id!, undefined, msg.name, 100, 0, 0, undefined);
        player.respawn(false);
        this.players.push(player);
        return player;
    }
}
