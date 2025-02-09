import db from "../../db/index.js";

const seenMessageService = async (user_id: bigint, chat_id: bigint, message_id: bigint) => {
    return db.seenMessages.create({
        data: {
            user_id,
            message_id,
        },
        include: {
            message: true,
        }
    })
}


export default seenMessageService;