import { Prisma } from '@prisma/client'
import db from '../../db/index.js';

const addMessageToChatService = async (senderId: bigint, chatId: number | bigint, message_data: Prisma.MessageUncheckedCreateInput) => {
    const user = await db.user.findFirstOrThrow({
        where: {
            id: senderId,
        }
    });

    const message = await db.message.create({
        data: {
            chat_id: chatId,
            sender_id: user.id,
            content_type: message_data.content_type,
            content: message_data.content,
            metadata: message_data.metadata,
            created_at: new Date(),
            updated_at: new Date(),
        },
        include: {
            sender: {
                select: {
                    username: true,
                    id: true,
                    fullname: true,
                    public_key: true,
                }
            },
            seen_by: {
                select: {
                    user_id: true,
                }
            },
        }
    })

    // update chat modified at
    await db.chat.update({
        where: {
            id: chatId,
        },
        data: {
            updated_at: new Date(),
        }
    })

    return message;
}

export default addMessageToChatService;
