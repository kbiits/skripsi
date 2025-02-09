import express from 'express'
import { checkSchema, matchedData } from 'express-validator';
import getUserByIdService from '../../../services/users/get_by_id.js';
import getUsersExcludeMeService from '../../../services/users/get_users_exclude_me.js';

const getUsersExcludeMe: express.RequestHandler = async (req, res) => {
    const { user_id } = (req as any).auth;
    const users = await getUsersExcludeMeService(user_id);

    return res.json({
        data: users.map(user => ({
            id: user.id,
            username: user.username,
            fullname: user.fullname,
            public_key: user.public_key,
            private_key: user.private_key,
            iv_private_key: user.iv_private_key,
        })),
    })
}

export default getUsersExcludeMe;