import getByUsernameService from "./get_by_username.js"
import { compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken'
import env from "../../env.js";

const generateToken = (payload: any) => {
    return jwt.sign(payload, env.JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: env.JWT_EXPIRATION,
    })
}

const loginService = async (username: string, password: string) => {

    const user = await getByUsernameService(username);
    if (!user) {
        return "user not found";
    }

    const isMatched = compareSync(password, user.password);
    if (!isMatched) {
        return 'wrong password';
    }

    const token = generateToken({
        user_id: user.id,
    })

    return {
        token,
        user: {
            id: user.id,
            username: user.username,
            fullname: user.fullname,
            dkf_salt: user.dkf_salt,
            dkf_iter: user.dkf_iter,
            dkf_algo: user.dkf_algo,
            dkf_key_size: user.dkf_key_size,
            created_at: user.created_at,
            private_key: user.private_key,
            iv_private_key: user.iv_private_key,
            public_key: user.public_key,
        },
    };
}

export default loginService