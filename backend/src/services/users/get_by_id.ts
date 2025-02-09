import db from "../../db/index.js";

const getUserByIdService = async (id: number) => {
  try {
    const user = await db.user.findFirstOrThrow({
      where: {
        id,
      },
    });

    return user;
  } catch (error) {
    console.log(error)
    return null
  }
};

export default getUserByIdService;
