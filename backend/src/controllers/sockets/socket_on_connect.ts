import io from 'socket.io';
import db from '../../db/index.js';
import { amqpChannel } from '../../message_queue/index.js';
import addMessageToChatService from '../../services/chats/add_message_to_chat.js';
import { $Enums, Message } from '@prisma/client';
import getUserByIdService from '../../services/users/get_by_id.js';

type decodedToken = {
    user_id: string,
    iat: number,
    exp: number,
}

type sendNewMessage = {
    content: string,
    convId: string,
    content_type: string,
    metadata: {
        ephemeralPublicKey: string,
        iv: string,
    }
}

type messageInQueue = {
    sent_by_me: boolean,
    sender_id: string,
    chat_id: string,
    content: string,
    content_type: $Enums.MessageContentType,
}

type newMessage = {
    sender: {
        id: bigint;
        username: string;
        fullname: string;
    };
    seen_by: {
        user_id: bigint;
    }[];
} & {
    id: bigint;
    chat_id: bigint;
    sender_id: bigint;
    content: string;
    metadata: string | null;
    content_type: $Enums.MessageContentType;
    created_at: Date;
    updated_at: Date;
};

const socketEvents = {
    sendNewMessage: 'send_new_message',
    receiveNewMessage: 'receive_new_message',
}

const buildQueueName = (userId: string | bigint) => `USER:${(typeof userId === 'bigint') ? userId.toString() : userId}`;

const socketOnConnect = async (socket: io.Socket) => {
    const authData: decodedToken = socket.decodedToken;
    if (!authData.user_id) {
        throw new Error("User uid is not defined");
    }
    const user = await getUserByIdService(parseInt(authData.user_id))

    console.log(`USER ${user?.username} connected`);
    const socketUserId = BigInt(authData.user_id);

    const queueName = buildQueueName(authData.user_id);
    await amqpChannel.assertQueue(queueName);


    const consumeMessageSentToMe = await amqpChannel.consume(queueName, async (message) => {
        if (message) {
            const msg: newMessage = JSON.parse(message.content.toString());
            const emitted = socket.emit(socketEvents.receiveNewMessage, {
                ...msg,
                metadata: msg.metadata ? JSON.parse(msg.metadata) : null,
                seen_by_me: msg.seen_by.some(x => x.user_id.toString() === socketUserId.toString()),
                sent_by_me: msg.sender_id.toString() === socketUserId.toString(),
            });
            console.log(`emit message from user ${msg.sender.fullname} to user ${user?.fullname}. emitted : ${emitted}`);
            amqpChannel.ack(message);
        }
    })

    socket.on(socketEvents.sendNewMessage, async (message: sendNewMessage) => {
        console.log('received request to send new message for chat', message.convId);

        if (!message.content || !message.convId) {
            console.log("Invalid message");
            return;
        }

        // insert new message here
        const chatId = BigInt(message.convId);

        const newMessage: newMessage = await addMessageToChatService(socketUserId, chatId, {
            chat_id: chatId,
            sender_id: socketUserId,
            content: message.content,
            content_type: message.content_type as $Enums.MessageContentType,
            created_at: new Date(),
            updated_at: new Date(),
            metadata: JSON.stringify(message.metadata),
            seen_by: {
                create: {
                    user_id: socketUserId,
                }
            },
        })


        const members = await db.chatMember.findMany({
            where: {
                chat_id: chatId,
            }
        })

        members.forEach(member => {
            amqpChannel.sendToQueue(buildQueueName(member.user_id), Buffer.from(JSON.stringify(newMessage)));
        })
    });

    socket.on("disconnect", () => {
        console.log(`USER ${user?.username} ${authData.user_id} disconnected`);
        amqpChannel.cancel(consumeMessageSentToMe.consumerTag)
    })
}

export default socketOnConnect;