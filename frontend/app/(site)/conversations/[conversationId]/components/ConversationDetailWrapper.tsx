"use client";
import useConversationStore from '@/app/context/ConversationContext';
import { message } from '@/app/hooks/useConversation';
import { useParams } from 'next/navigation';
import { PropsWithChildren, use, useEffect } from 'react';

const ConversationDetailWrapper = ({ children, messages }: PropsWithChildren<{ messages: message[] }>) => {
    const convStore = useConversationStore();
    const { conversationId } = useParams();
    useEffect(() => {
        convStore.setMessagesOnConversation(conversationId as string, messages);
    }, [messages, conversationId]);

    return (
        <>{children}</>
    )
}

export default ConversationDetailWrapper