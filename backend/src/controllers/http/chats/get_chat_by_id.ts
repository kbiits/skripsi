import express from 'express'
import getChatByIdService from '../../../services/chats/get_chat_by_id.js';

const getChatById: express.RequestHandler = async (req: express.Request, res) => {
    const { chat_id } = req.params
    const { user_id } = (req as any).auth
    const chat = await getChatByIdService(BigInt(user_id), BigInt(chat_id));

    return res.json({
        data: chat,
    })
}

export default getChatById