"use client";

import EmptyState from '@/app/components/EmptyState';
import { useAuthStore } from '@/app/context/AuthContext';
import useConversationHelper from '@/app/hooks/useConversation';
import useCrypto from '@/app/hooks/useCrypto';
import Body from './components/Body';
import Form from './components/Form';
import Header from './components/Header';

interface IParams {
  conversationId: string;
}

const ConversationId = ({ params }: { params: IParams }) => {
  const user = useAuthStore(state => state.user)
  const { conversation } = useConversationHelper()

  const otherUser = conversation?.members.find(m => m.user_id !== user.id);

  const crypto = useCrypto(
    user.private_key!,
    otherUser?.user.public_key || ""
  );

  // should wait until the other user is populated
  if (!crypto) {
    return (
      <div className="h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  const { encryptMessageForSending } = crypto

  return (
    <div className="h-full w-full">
      <div className="h-full flex flex-col">
        <Header conversation={conversation} />
        <Body messages={conversation.messages} />
        <Form encryptMessageForSending={encryptMessageForSending} />
        <div className="h-12 lg:h-0 border"></div>
      </div>
    </div>
  );
};

export default ConversationId;
