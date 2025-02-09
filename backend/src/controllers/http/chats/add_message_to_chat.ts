import { $Enums } from '@prisma/client';
import express from 'express';
import { checkSchema, matchedData } from "express-validator";
import addMessageToChatService from "../../../services/chats/add_message_to_chat.js";

const addMessageToChat: express.RequestHandler = async (req: express.Request, res) => {
    const { chat_id, content, message_content_type, metadata } = matchedData(req)
    const user_id = BigInt((req as any).auth.user_id)
    const message = await addMessageToChatService(user_id, chat_id, {
        content,
        content_type: (message_content_type as $Enums.MessageContentType),
        metadata,
        chat_id: chat_id,
        sender_id: user_id,
    })

    return res.json({
        data: message,
    });
}

export const addMessageToChatSchema = checkSchema({
    chat_id: {
        isInt: true,
    },
    message_content_type: {
        optional: true,
        isString: true,
    },
    content: {
        isString: true,
        notEmpty: true,
    },
    metadata: {
        isObject: true,
        optional: true,
    },
}, ['body', 'params']);

export default addMessageToChat;
