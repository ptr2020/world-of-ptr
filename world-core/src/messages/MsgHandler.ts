import { Message } from "./Message";

export interface MsgHandler {
    validate(msg: Message): boolean;
    handle(msg: Message): void;
}
