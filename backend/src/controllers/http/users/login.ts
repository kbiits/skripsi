import express from 'express';
import { checkSchema, matchedData } from 'express-validator';
import loginService from '../../../services/users/login.js';

const login: express.RequestHandler = async (req, res) => {
    const { username, password } = matchedData(req)

    const result = await loginService(username, password)
    if (typeof result == 'string') {
        return res.status(400).json({
            message: result
        });
    }

    return res.json({
        data: result,
    });
}

export const loginSchema = checkSchema({
    username: {
        isString: true,
        notEmpty: true,
    },
    password: {
        isString: true,
        notEmpty: true,
    }
}, ['body'])

export default login;