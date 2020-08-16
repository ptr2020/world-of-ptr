import { Message } from "./Message";

export interface MsgHandler {
    getTypes(): string[];
    validate(msg: Message): boolean;
    handle(msg: Message): void;
}
