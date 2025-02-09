import db from "../../db/index.js"

const getChatByIdService = async (userId: bigint, chatId: bigint) => {
    const chat = await db.chat.findFirstOrThrow({
        where: {
            id: chatId,
        },
        include: {
            members: {
                include: {
                    user: true,
                },
            },
            messages: {
                orderBy: {
                    created_at: 'desc',
                },
                take: 1,
                include: {
                    seen_by: {
                        where: {
                            user_id: userId,
                        }
                    }
                }
            }
        }
    })

    return {
        id: chat.id,
        chat_type: chat.chat_type,
        metadata: chat.metadata ? JSON.parse(chat.metadata) : null,
        last_message: chat.messages.length > 0 ? {
            ...chat.messages[0],
            metadata: chat.messages[0]?.metadata ? JSON.parse(chat.messages[0].metadata) : null,
            seen_by_me: !!chat.messages[0].seen_by[0],
        } : null,
        members: chat.members,
        created_at: chat.created_at,
        updated_at: chat.updated_at,
    }
}

export default getChatByIdService
