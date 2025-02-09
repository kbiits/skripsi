import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

const getCurrentUser = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return null;
    }

    return session;
  } catch (error: any) {
    return null;
  }
};

export default getCurrentUser;