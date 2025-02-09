'use client';

import clsx from 'clsx';
import EmptyStateWelcome from '../../components/EmptyState';
import useConversationHelper from '@/app/hooks/useConversation';

const Conversations = () => {
  const { isOpen } = useConversationHelper();
  return (
    <div
      className={clsx('h-full w-full lg:block', isOpen ? 'block' : 'hidden')}
    >
      <EmptyStateWelcome />
    </div>
  );
};

export default Conversations;
