'use client';

import Avatar from '@/app/components/Avatar';
import clsx from 'clsx';
import { format } from 'date-fns';
import Image from 'next/image';
import { useState } from 'react';
import ImageModal from './ImageModal';
import { message } from '@/app/hooks/useConversation';
import useCurrentUser from '@/app/hooks/useCurrentUser';

interface MessageBoxProps {
  isLast: boolean;
  data: message;
}

const MessageBox: React.FC<MessageBoxProps> = ({ isLast, data }) => {
  const currentUser = useCurrentUser();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const isOwn = data.sent_by_me;
  const seenList = (data.seen_by || [])
    .filter((user_id) => user_id !== currentUser?.user_id)
    .join(', ');

  const isImage = data.content_type === 'IMAGE';

  // dynamic classes
  const container = clsx('flex gap-3 p-4', isOwn && 'justify-end');
  const avatar = clsx(isOwn && 'order-2');
  const body = clsx('flex flex-col gap-2', isOwn && 'items-end');
  const message = clsx(
    'text-sm w-fit overflow-hidden',
    isOwn ? 'bg-cyan-500 text-white' : 'bg-gray-100',
    isImage ? 'rounded-md p-0' : 'rounded-full py-2 px-3'
  );


  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={data.sender} />
      </div>

      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">
            {data.sender?.fullname || data.sender?.username}
          </div>
          <div className="text-xs text-gray-400">
            {format(new Date(data.created_at), 'p')}
          </div>
        </div>

        <div className={message}>
          <ImageModal
            isOpen={isImageModalOpen}
            src={isImage ? data.content : null}
            onClose={() => setIsImageModalOpen(false)}
          />
          {isImage ? (
            <Image
              onClick={() => setIsImageModalOpen(true)}
              src={data.content}
              width={288}
              height={288}
              alt="image"
              className="object-cover cursor-pointer hover:scale-110 transition translate"
            />
          ) : (
            <div>{data.content}</div>
          )}
        </div>

        {
          // show seen list if last message
          isLast && isOwn && seenList && (
            <div className="text-xs font-light text-gray-500">
              Seen by {seenList}
            </div>
          )
        }
      </div>
    </div>
  );
};
export default MessageBox;
