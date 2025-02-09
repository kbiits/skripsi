import db from "../../db/index.js"

const getChatsService = async (user_id: bigint, limit: number, offset: number) => {
    const chats = await db.chat.findMany({
        where: {
            members: {
                some: {
                    user_id,
                },
            }
        },
        orderBy: {
            updated_at: 'desc',
        },
        include: {
            members: {
                include: {
                    user: {
                        select: {
                            id: true,
                            fullname: true,
                            username: true,
                            public_key: true,
                        }
                    },
                }
            },
            messages: {
                take: 1,
                orderBy: {
                    created_at: 'desc',
                },
                include: {
                    seen_by: {
                        where: {
                            user_id,
                        }
                    }
                },
            },
        },
        take: limit,
        skip: offset,
    })

    return chats.map(chat => ({
        id: chat.id,
        chat_type: chat.chat_type,
        metadata: chat.metadata ? JSON.parse(chat.metadata) : null,
        last_message: chat.messages.length > 0 ? {
            ...chat.messages[0],
            metadata: chat.messages[0]?.metadata ? JSON.parse(chat.messages[0].metadata) : null,
            seen_by_me: !!chat.messages[0].seen_by[0],
        } : null,
        members: chat.members.map(m => ({
            user_id: m.user_id,
            user: m.user,
        })),
        created_at: chat.created_at,
        updated_at: chat.updated_at,
    }))
}

export default getChatsService