import { Prisma } from "@prisma/client";
import db from "../../db/index.js";

const getUsersExcludeMeService = async (loggedInId: number) => {
    const users = await db.user.findMany({
        where: {
            id: {
                not: loggedInId,
            }
        }
    })

    return users
}

export default getUsersExcludeMeService;