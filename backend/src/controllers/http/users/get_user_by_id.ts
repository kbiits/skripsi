import express from 'express'
import { checkSchema, matchedData } from 'express-validator';
import getUserByIdService from '../../../services/users/get_by_id.js';

const getUserById: express.RequestHandler = async (req, res) => {
    const { id } = matchedData(req)
    const user = await getUserByIdService(id);

    if (!user) {
        return res.status(404).json({
            message: 'User not found',
        })
    }

    return res.json({
        data: {
            id: user.id,
            username: user.username,
            fullname: user.fullname,
            dkf_salt: user.dkf_salt,
            dkf_iter: user.dkf_iter,
            dkf_algo: user.dkf_algo,
            dkf_key_size: user.dkf_key_size,
            created_at: user.created_at,
            public_key: user.public_key,
            private_key: user.private_key,
            iv_private_key: user.iv_private_key,
        },
    })
}

export const getUserByIdSchema = checkSchema({
    id: {
        isInt: true,
    }
}, ['params'])

export default getUserById;