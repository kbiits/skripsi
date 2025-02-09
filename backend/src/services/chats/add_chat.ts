import { Chat, Prisma } from '@prisma/client'
import db from '../../db/index.js';

const addChatService = async (members: string[]) => {

    const membersBigInt = members.map(m => BigInt(m));

    const membersCreateData: Prisma.ChatMemberCreateManyChatInput[] = members.map(member => ({
        user_id: BigInt(member),
    }));

    const existingChats = await db.$queryRaw<Chat[]>`
        select * from chats c
        where c.id = (
            select cm.chat_id from chat_members cm, chat_members cm2 
            where 
                cm.chat_id = cm2.chat_id and 
                cm.user_id < cm2.user_id and 
                cm.user_id = ${membersBigInt[0]} and cm2.user_id = ${membersBigInt[1]}
        ) limit 1;
    `

    if (existingChats.length > 0) {
        return existingChats[0];
    }

    const chat = await db.chat.create({
        data: {
            chat_type: "PERSONAL",
            members: {
                createMany: {
                    data: membersCreateData,
                }
            }
        }
    })

    return chat
}


export default addChatService;