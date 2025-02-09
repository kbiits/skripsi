import { Prisma } from '@prisma/client';
import { hashSync } from 'bcrypt';
import db from '../../db/index.js';

const passwordSaltRounds = 10;

const signUpService = async (data: Prisma.UserCreateInput) => {
    console.log(data)
    const sameUsername = await db.user.findFirst({
        where: {
            username: data.username,
        }
    })

    if (sameUsername) {
        return 'Username already exists';
    }

    data.password = hashSync(data.password, passwordSaltRounds)


    const user = await db.user.create({
        data,
    })

    return user;
}

export default signUpService;