import express from 'express'
import { checkSchema, matchedData } from 'express-validator'
import getMessagesByChatService from '../../../services/chats/get_messages_by_chat.js'

const getMessagesByChat: express.RequestHandler = async (req: express.Request, res) => {
    const { limit, last_fetched_id, chat_id } = matchedData(req)
    const { user_id } = (req as any).auth

    const messages = await getMessagesByChatService(BigInt(user_id), chat_id, limit, last_fetched_id);

    return res.json({
        data: messages,
    })
}

export const getMessagesByChatSchema = checkSchema({
    limit: {
        isInt: {
            options: {
                max: 50,
            },
        },
    },
    last_fetched_id: {
        isInt: true,
        optional: true,
    },
    chat_id: {
        isInt: true,
    },
}, ['params', 'query'])

export default getMessagesByChat;