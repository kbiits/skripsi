import express from 'express'
import { checkSchema, matchedData } from 'express-validator'
import seenMessageService from '../../../services/chats/seen_message.js'

const seenMessage: express.RequestHandler = async (req: express.Request, res) => {
    const { chat_id, message_id } = matchedData(req)
    const { user_id } = (req as any).auth

    const seen_message = await seenMessageService(BigInt(user_id), BigInt(chat_id), BigInt(message_id));

    return res.json({
        data: seen_message,
    })
}

export const seenMessageSchema = checkSchema({
    chat_id: {
        isNumeric: true,
        notEmpty: true,
    },
    message_id: {
        isNumeric: true,
        notEmpty: true,
    },
}, ['params', 'query'])

export default seenMessage;