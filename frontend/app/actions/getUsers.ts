import { getServerSession } from 'next-auth/next';
import { getSession } from 'next-auth/react';
import 'next/headers';
import { authOptions } from '../api/auth/[...nextauth]/route';
import getUsersForChatService from '../services/getUsersForChat';
import getCurrentUser from './getCurrentUser';

const getUsers = async () => {
  try {
    const session = await getCurrentUser();
    if (!session?.user.backend_token) return [];

    const users = await getUsersForChatService(session.user.backend_token);
    return users;
  } catch (error: any) {
    return [];
  }
};

export default getUsers;
