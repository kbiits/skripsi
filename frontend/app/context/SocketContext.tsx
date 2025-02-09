'use client';
import { Socket, io } from 'socket.io-client';

interface SocketContextValue {
    socket: Socket
}

const socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 10,
    transports: ['websocket'],
});

export default socket