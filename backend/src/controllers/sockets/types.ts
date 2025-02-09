export interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    push_message: () => void;
}

export interface ClientToServerEvents {
    hello: () => void;
    send_message: () => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData { }