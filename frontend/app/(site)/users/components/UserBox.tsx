'use client';

import Avatar from '@/app/components/Avatar';
import LoadingModal from '@/app/components/LoadingModal';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { titleCase } from "title-case";

interface UserBoxProps {
  user: any;
}

const UserBox: React.FC<UserBoxProps> = ({ user }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(() => {
    setIsLoading(true);

    axios.post('/api/conversations', {
      userId: user.id,
    })
      .then((data) => {
        router.push(`/conversations/${data.data.id}`);
      })
      .finally(() => {
        setIsLoading(false);
      });

  }, [user, router]);

  return (
    <>
      {isLoading && <LoadingModal />}
      <div
        title="Start a chat"
        onClick={handleClick}
        className="w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer"
      >
        <Avatar user={user} />
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <p className="text-sm font-medium text-gray-900">{titleCase(user.fullname)}</p>
            <p className="text-sm text-gray-500">{user.username}</p>
          </div>
        </div>
      </div>
    </>
  );
};
export default UserBox;
