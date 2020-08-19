export interface Message {
    type: string;
    correlationToken?: string;
    // Provided by server
    clientId?: string;
}
