import express from 'express'
import { checkSchema, matchedData } from 'express-validator';
import signUpService from '../../../services/users/sign_up.js';

const signUp: express.RequestHandler = async (req, res) => {
    const { username, password, fullname, dkf_salt, dkf_iter, dkf_algo, dkf_key_size, public_key,
        private_key, iv_private_key } = matchedData(req);

    const result = await signUpService({
        username,
        fullname,
        password,
        dkf_salt,
        dkf_algo,
        dkf_iter,
        dkf_key_size,
        public_key,
        private_key,
        iv_private_key,
    });

    if (result == 'Username already exists') {
        return res.status(400).json({
            message: result,
        })
    }

    return res.json({
        data: {
            id: result.id,
            username: result.username,
            fullname: result.fullname,
            public_key: result.public_key,
            dkf_salt: result.dkf_salt,
            dkf_iter: result.dkf_iter,
            dkf_algo: result.dkf_algo,
            dkf_key_size: result.dkf_key_size,
            created_at: result.created_at,
        },
    })
}

export const signUpSchema = checkSchema({
    username: {
        isString: {
            errorMessage: 'Username harus berisi teks',
        },
        notEmpty: {
            errorMessage: 'Username tidak boleh kosong',
        },
        isLength: {
            options: {
                max: 255,
                min: 4,
            },
            errorMessage: 'Username harus memiliki panjang 4 - 255 karakter',
        }
    },
    fullname: {
        isString: true,
        notEmpty: true,
        isLength: {
            options: {
                max: 255,
                min: 4,
            },
        }
    },
    password: {
        isString: true,
        notEmpty: true,
        isStrongPassword: {
            options: {
                minLength: 8,
                minLowercase: 0,
                minNumbers: 0,
                minSymbols: 0,
                minUppercase: 0,
            },
            errorMessage: 'Password harus memiliki panjang minimal 8 karakter',
        },
    },
    public_key: {
        isString: true,
        notEmpty: true,
    },
    private_key: {
        isString: true,
        notEmpty: true,
    },
    iv_private_key: {
        isString: true,
        notEmpty: true,
    },
    dkf_salt: {
        isString: true,
        notEmpty: true,
    },
    dkf_iter: {
        isInt: {
            options: {
                min: 50,
            },
        }
    },
    dkf_algo: {
        isString: true,
        notEmpty: true,
        isIn: {
            options: [['SHA-256', 'SHA-512']],
        },
    },
    dkf_key_size: {
        isInt: {
            options: {
                min: 32,
            },
        }
    },
}, ['body']);

export default signUp;