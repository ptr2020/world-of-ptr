import { MsgHandler, Message } from '../messages';
import { Logger } from '../';

export class Router {
    private handlerMap: {[type: string]: MsgHandler[]};

    constructor() {
        this.handlerMap = {};
    }

    public register(handler: MsgHandler): void {
        let handlerTypes = handler.getTypes();
        if (handlerTypes == null || handlerTypes.length == 0) {
            Logger.error(`Handler doesn't expose any types!`);
        }

        for (let type of handlerTypes) {
            if (!(type in this.handlerMap)) {
                this.handlerMap[type] = [];
            }

            this.handlerMap[type].push(handler);
        }
    }

    public emit(msg: Message): void {
        if (!(msg.type in this.handlerMap)) {
            Logger.warn(`No handlers registered for '${msg.type}'`);
            return;
        }

        try {
            let handlers = this.handlerMap[msg.type];
            Logger.debug(`Routing '${msg.type}' to '${handlers.length}' registered handler(s)`);
            for (let handler of handlers) {
                if (!handler.validate(msg)) {
                    continue;
                }
                
                handler.handle(msg);
            }
        }

        catch (e) {
            Logger.warn(`Problem emitting message '${msg.type}'`, { exception: e.toString() });
        }
    }
}
