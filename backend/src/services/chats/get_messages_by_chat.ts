import db from "../../db/index.js";

const getMessagesByChatService = async (loggedInUserId: bigint, chatId: number, limit: number, lastFetchedId?: number) => {
    let cursor = undefined;

    if (lastFetchedId) {
        cursor = {
            id: lastFetchedId,
        }
    }

    const messages = await db.message.findMany({
        where: {
            chat_id: chatId,
        },
        cursor,
        orderBy: {
            created_at: 'desc',
        },
        include: {
            seen_by: {
                where: {
                    user_id: loggedInUserId,
                }
            },
            sender: {
                select: {
                    id: true,
                    fullname: true,
                    username: true,
                    public_key: true,
                }
            },
        }
    })

    return messages.map(message => ({
        ...message,
        metadata: message.metadata ? JSON.parse(message.metadata) : null,
        seen_by_me: message.seen_by.length > 0 ? message.seen_by[0].user_id === loggedInUserId : false,
        sent_by_me: message.sender_id === loggedInUserId,
    }))
}

export default getMessagesByChatService;