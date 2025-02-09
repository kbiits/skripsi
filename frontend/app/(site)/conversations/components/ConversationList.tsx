"use client";

import useConversationStore from "@/app/context/ConversationContext";
import useConversation, { conversation } from "@/app/hooks/useConversation";
import clsx from "clsx";
import { PropsWithChildren, useEffect, useSyncExternalStore } from "react";
import ConversationBox from "./ConversationBox";
import { useAuthStore } from "@/app/context/AuthContext";
import useConversationHelper from "@/app/hooks/useConversation";
import { syncConversationStore } from "@/app/hooks/useMessage";
import toast from "react-hot-toast";

type Props = {
  conversations: conversation[];
};

const syncOnlineStatus = (callback: () => void) => {
  const triggerListener = () => {
    callback();
  }
  window.addEventListener("online", triggerListener);
  window.addEventListener("offline", triggerListener);

  return () => {
    window.removeEventListener("online", triggerListener);
    window.removeEventListener("offline", triggerListener);
  }
}

const ConversationList: React.FC<PropsWithChildren<Props>> = ({ conversations: initialConversations }) => {
  const user = useAuthStore(state => state.user)
  const isOnline = useSyncExternalStore(syncOnlineStatus, () => navigator.onLine)

  // subscribe to websocket
  useEffect(() => {
    if (user.token && isOnline) {
      return syncConversationStore(user.token)
    }

    if (!isOnline) {
      // show toast that user is offline
      toast.error("You are offline. Please check your internet connection.")
    }

    return () => { }
  }, [user.token, isOnline])

  const { conversations, setConversations } = useConversationStore();
  const { isOpen, conversationId } = useConversationHelper();

  useEffect(() => {
    setConversations(initialConversations);
  }, [initialConversations]);

  return (
    <>
      <aside
        className={clsx(
          "h-full pb-20 lg:pb-0 lg:w-80 lg:block overflow-y-auto border-r border-gray-200",
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 py-4 border-b">
            <div className="text-2xl font-bold text-neutral-800">Chats</div>
          </div>

          {[...conversations].map((conversation) => (
            <div className="py-1"
              key={conversation.id}
            >
              <ConversationBox
                conversation={conversation}
                selected={conversationId === conversation.id}
              />
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};
export default ConversationList;
