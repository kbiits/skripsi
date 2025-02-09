import express from 'express';
import getChatsService from '../../../services/chats/get_chats.js';
import { Prisma } from '@prisma/client'

const getChats: express.RequestHandler = async (req: express.Request, res) => {
    const user_id = BigInt((req as any).auth.user_id)
    const chats = await getChatsService(user_id, Number(req.query.limit), Number(req.offset));

    return res.json({
        data: chats,
    })
}

export default getChats;