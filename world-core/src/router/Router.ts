import { MsgHandler, Message } from '../messages';
import { Logger } from '../Logger';

export class Router {
    private handlerMap: {[type: string]: MsgHandler[]};

    constructor() {
        this.handlerMap = {};
    }

    public register(type: string, handler: MsgHandler): void {
        if (!(type in this.handlerMap)) {
            this.handlerMap[type] = [];
        }
       
        this.handlerMap[type].push(handler);
    }

    public emit(msg: Message): boolean {
        if (!(msg.type in this.handlerMap)) {
            Logger.warn(`No handlers registered for '${msg.type}'`);
            return false;
        }

        let handlers = this.handlerMap[msg.type];
        for (let handler of handlers) {
            if (!handler.validate(msg)) {
                continue;
            }
            
            handler.handle(msg);
        }

        return true;
    }
}
