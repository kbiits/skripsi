"use client";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { conversation, message } from "../hooks/useConversation";


interface conversationProps {
  conversations: conversation[];
}

export interface ConversationState extends conversationProps {
  addNewConversation: (conversation: conversation) => void;
  addNewMessage: (conversationId: string, message: message) => void;
  setConversations: (conversations: conversation[]) => void;
  setMessagesOnConversation: (
    conversationId: string,
    messages: message[]
  ) => void;
}

const DEFAULT_PROPS: conversationProps = {
  conversations: [],
};

export const createConversationStore = (
  initProps?: Partial<conversationProps>
) => {
  return create<ConversationState>()(
    devtools(
      immer((set) => ({
        ...DEFAULT_PROPS,
        ...initProps,
        setConversations: (conversations) => {
          set((state) => {
            state.conversations = conversations;
          }, undefined, 'conversation/setConversations');
        },
        addNewConversation: (conv) => {
          set((state) => {
            const newConversations = [{ ...conv }, ...state.conversations];
            state.conversations = newConversations;
          }, undefined, 'conversation/addNewConversation');
        },
        addNewMessage: (convId, message) => {
          set((state) => {
            const convIdx = state.conversations.findIndex(
              (c) => c.id === convId
            );
            if (convIdx === -1) {
              return;
            }

            const conv = { ...state.conversations[convIdx] };
            conv.messages = [message, ...conv.messages];

            // move new conv to first element
            conv.last_message = message;
            state.conversations = [
              conv,
              ...state.conversations.slice(0, convIdx),
              ...state.conversations.slice(convIdx + 1),
            ];
          }, undefined, 'conversation/addNewMessage');
        },
        setMessagesOnConversation: (convId, messages) => {
          set((state) => {
            const convIdx = state.conversations.findIndex(
              (c) => c.id === convId
            );
            if (convIdx === -1) {
              return;
            }

            state.conversations[convIdx].messages = messages;
          }, undefined, 'conversation/setMessagesOnConversation');
        },
      })),
      {
        name: "conversation",
        enabled: true,
        anonymousActionType: 'CONVERSATION_ACTION',
      }
    )
  );
};

const useConversationStore = createConversationStore();
export default useConversationStore;
