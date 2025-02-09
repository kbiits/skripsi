import express from 'express';
import { checkSchema, matchedData } from 'express-validator';
import addChatService from '../../../services/chats/add_chat.js';
const addChat: express.RequestHandler = async (req, res) => {
    const { members } = matchedData(req);

    members.sort();

    const chat = await addChatService(members);

    return res.json({
        data: chat,
    })
}

export const addChatSchema = checkSchema({
    members: {
        isArray: true,
    },
    'members.*': {
        isString: true,
        notEmpty: true,
    }
}, ['body']);

export default addChat