import * as http from 'http';
import * as websocket from 'websocket';
import { Logger, Messages, Router } from 'world-core';
import cryptoRandomString = require('crypto-random-string');

import { SendMessage, BroadcastMessage } from './NetworkMessages';
import { PlayerLeaveMessage } from '../world/player';

export class Server implements Messages.MsgHandler {
    private wsServer: websocket.server;
    private httpServer: http.Server;
 
    private socketMap: Map<string, websocket.connection>;

    constructor(port: number = 8080) {
        this.socketMap = new Map<string, websocket.connection>();
        this.httpServer = http.createServer((req, resp) => {
            Logger.info(`Invalid request from ${req.connection.remoteAddress}`);
            resp.writeHead(418);
            resp.end();
        });

        this.httpServer.listen(port, () => {
            Logger.info(`Server listening on ::${port}`);
        });

        this.wsServer = new websocket.server({
            httpServer: this.httpServer,
            autoAcceptConnections: false,
        });

        this.wsServer.on("request", this.onRequestConnection.bind(this));
        Router.register(this);
    }

    public getTypes(): string[] {
        return ['network.send', 'network.broadcast'];
    }

    private onRequestConnection(request: websocket.request) {
        // In production always validate origin
        if (process.env.NODE_ENV === 'production' && request.origin !== 'https://world.ptr.si') {
            Logger.warn(`Rejected connection from ${request.remoteAddress} because of Origin`, { origin: request.origin });
            request.reject();
            return;
        }

        var connection = request.accept('', request.origin);
        var clientId = cryptoRandomString({ length: 10 });

        Logger.info(`Accepted socket connection ${clientId} from ${request.remoteAddress}`);
        this.socketMap.set(clientId, connection);

        connection.on('message', (message) => {
            if (message.type === 'utf8') {
                Logger.debug(`Received message from ${clientId}`, { content: message.utf8Data });
                try {
                    let msg = JSON.parse(message.utf8Data!) as Messages.Message;
                    msg.clientId = clientId;
                    Router.emit(msg);
                }
                catch (e) {
                    Logger.warn(`Problem parsing message from ${clientId}`, { exception: e.toString() });
                }
            }
            else {
                Logger.warn(`Message from ${clientId} not in valid format! Expected 'utf8' got '${message.type}.`);
            }
        });

        connection.on('close', (_reasonCode: any, _description: any) => {
            this.socketMap.delete(clientId);
            Router.emit(new PlayerLeaveMessage(clientId));
            Logger.info(`Closed connection with ${clientId} (${connection.remoteAddress})`);
        });
    }

    // All internal messages are valid -> implicit trust
    public validate(_msg: Messages.Message): boolean {
        return true;
    }

    // Handle network.send messages to send updates to all clients
    public handle(msg: Messages.Message): void {
        switch (msg.type) {
            case 'network.send':
                this.send(msg as SendMessage);
                break;

            case 'network.broadcast':
                this.broadcast(msg as BroadcastMessage);
                break;
        }
    }

    // Send message to particular client
    private send(msg: SendMessage): void {
        if (msg == null || msg == undefined) {
            Logger.error(`Server received invalid SendMessage`);
            return;
        }

        let clientSocket = this.socketMap.get(msg.clientId);
        if (clientSocket == null) {
            Logger.error(`Client '${msg.clientId} for SendMessage not found`);
            return;
        }

        clientSocket.sendUTF(JSON.stringify(msg.msg));
    }

    // Send out message to all connected clients
    private broadcast(msg: BroadcastMessage): void {
        if (msg == null || msg == undefined) {
            Logger.error(`Server received invalid BroadcastMessage`);
            return;
        }

        this.wsServer.broadcastUTF(JSON.stringify(msg.msg));
    }
}
