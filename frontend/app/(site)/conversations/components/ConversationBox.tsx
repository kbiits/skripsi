'use client';

import Avatar from '@/app/components/Avatar';
import { useAuthStore } from '@/app/context/AuthContext';
import { conversation } from '@/app/hooks/useConversation';
import clsx from 'clsx';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

interface ConversationBoxProps {
  conversation: conversation;
  selected: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  conversation,
  selected,
}) => {
  const user = useAuthStore((state) => state.user);
  const otherUser = conversation.members.find(
    (member) => member.user_id !== user.id
  );

  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${conversation.id}`);
  }, [conversation.id, router]);

  const lastMessageText = useMemo(() => {
    if (conversation?.last_message?.content_type === 'IMAGE') {
      return 'Sent an image';
    }

    if (conversation?.last_message?.content_type === 'TEXT') {
      return conversation.last_message.content;
    }

    return 'Started a chat...';
  }, [conversation.last_message]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        'w-full relative flex items-center space-x-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer p-3',
        selected ? 'bg-neutral-100' : 'bg-white'
      )}
    >
      <Avatar user={otherUser} />
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="text-md font-medium text-gray-900">
              {/* {conversation.name || otherUser.name} this is should used by group to get the group name */}
              {otherUser?.user.fullname}
            </p>

            {conversation.last_message?.created_at && (
              <p className="text-xs text-gray-400 text-end">
                {format(new Date(conversation.last_message?.created_at), 'p')}
              </p>
            )}
          </div>

          <p
            className={clsx(
              'truncate text-sm',
              // hasSeen ? 'text-gray-500' : 'text-black font-medium'
              true ? 'text-gray-500' : 'text-black font-medium'
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};
export default ConversationBox;
