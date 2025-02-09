import { useParams } from "next/navigation";
import { useMemo } from "react";
import useConversationStore from "../context/ConversationContext";

export type conversation = {
  id: string;
  chat_type: "PERSONAL";
  metadata: any;
  last_message?: message;
  messages: message[];
  members: conversationMember[];
  created_at: Date;
  updated_at: Date;
};

export type message = {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  metadata: Record<string, any>;
  content_type: messageContentType;
  created_at: Date;
  updated_at: Date;
  seen_by: string[];
  seen_by_me: boolean;
  sent_by_me: boolean;
  sender: conversationMember["user"];
};

export enum messageContentType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  DOCUMENT = "DOCUMENT",
}

export type conversationMember = {
  user_id: string;
  user: {
    id: string;
    username: string;
    fullname: string;
    public_key: string;
  };
};

const useConversationHelper = () => {
  const params = useParams();

  const { conversations } = useConversationStore((state) => ({
    conversations: state.conversations,
  }));

  const conversationId = useMemo(() => {
    if (!params?.conversationId) {
      return "";
    }

    return params?.conversationId as string;
  }, [params?.conversationId]);

  const conversation = useMemo(() => {
    return conversations.find((conv) => conv.id === params.conversationId);
  }, [conversations, params.conversationId]);

  return {
    conversationId,
    isOpen: !!conversationId,
    conversation,
  };
};

export default useConversationHelper;
