import db from "../../db/index.js";

const getByUsernameService = async (username: string) => {
    const user = await db.user.findFirstOrThrow({
        where: {
            username,
        }
    })

    return user
}

export default getByUsernameService;