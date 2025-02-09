"use client";

import toast from "react-hot-toast";
import { Socket } from "socket.io-client";
import { useAuthStore } from "../context/AuthContext";
import useConversationStore from "../context/ConversationContext";
import socket from "../context/SocketContext";
import { decryptConversation } from "../libs/conversation/utils";
import { deriveSharedSecret, deserializeECDHPublicKey } from "../libs/crypto/ecdh";
import { hexistsToArrayBuffer } from "../libs/crypto/util";
import { messageContentType } from "./useConversation";
import useCurrentUser from "./useCurrentUser";

type sendNewMessage = {
  content: string;
  convId: string;
  content_type: messageContentType;
  metadata: {
    iv: string;
  };
};

const socketEvents = {
  sendNewMessage: "send_new_message",
  receiveNewMessage: "receive_new_message",
};

type newMessageComesIn = {
  sender: {
    id: string;
    username: string;
    fullname: string;
    public_key: string;
  };
  seen_by: {
    user_id: string;
  }[];
  seen_by_me: boolean;
  sent_by_me: boolean;
} & {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  metadata: {
    iv: string;
  };
  content_type: messageContentType;
  created_at: Date;
  updated_at: Date;
};

function scrolltobottom() {
  document.getElementById("bottom")?.scrollIntoView();
}

export const sendNewMessage = (socket: Socket, data: sendNewMessage) => {
  if (socket.connected) {
    console.log("sended message");
    socket.emit(socketEvents.sendNewMessage, data);
    scrolltobottom();
  } else {
    toast.error("Anda sedang offline. Silahkan refresh");
  }
};

const newMessageHandler = (data: newMessageComesIn) => {
  console.log('new message comes in', data);
  const authStore = useAuthStore.getState();
  const conversationStore = useConversationStore.getState();
  conversationStore.conversations.forEach((conversation) => {
    if (conversation.id === data.chat_id) {
      const otherUser = conversation.members.find(
        (member) => member.user_id !== authStore.user.id,
      );

      if (!otherUser) {
        console.log("other user not found to decrypt message");
        return;
      }

      let [privateKey, publicKey] = [
        authStore.user.private_key,
        deserializeECDHPublicKey(otherUser!.user.public_key),
      ];

      const sharedSecret = deriveSharedSecret(privateKey, publicKey);
      const iv = hexistsToArrayBuffer(data.metadata.iv);
      const message = hexistsToArrayBuffer(data.content);

      const newMessage = {
        id: data.id,
        chat_id: data.chat_id,
        content: decryptConversation(message, sharedSecret, iv),
        content_type: data.content_type,
        created_at: data.created_at,
        updated_at: data.updated_at,
        metadata: data.metadata,
        seen_by: data.seen_by.map((x) => x.user_id),
        seen_by_me: data.seen_by_me,
        sent_by_me: data.sent_by_me,
        sender: data.sender,
        sender_id: data.sender_id,
      };
      conversationStore.addNewMessage(data.chat_id, newMessage);
    }
  });

  // // if message is sent by me, then reverse the key
  // if (data.sender_id === user?.user_id) {
  //   const receiver = findReceiver(data.chat_id, data.sender_id)![0];
  //   publicKey = deserializeECDHPublicKey(receiver.user.public_key);
  // }

  // const sharedSecret = deriveSharedSecret(privateKey, publicKey);
  // const iv = hexistsToArrayBuffer(data.metadata.iv);
  // const message = hexistsToArrayBuffer(data.content);

  // data.content = decryptConversation(
  //   new Uint8Array(message),
  //   new Uint8Array(sharedSecret),
  //   new Uint8Array(iv)
  // );

  // addNewMessage(data.chat_id, {
  //   id: data.id,
  //   chat_id: data.chat_id,
  //   content: data.content,
  //   content_type: data.content_type,
  //   created_at: data.created_at,
  //   updated_at: data.updated_at,
  //   metadata: data.metadata,
  //   seen_by: data.seen_by.map((x) => x.user_id),
  //   seen_by_me: data.seen_by_me,
  //   sent_by_me: data.sent_by_me,
  //   sender: data.sender,
  //   sender_id: data.sender_id,
  // });
  // scrolltobottom();
};

export const registerSocketHandlers = () => {
  console.log('listening to new message');
  socket.on(socketEvents.receiveNewMessage, newMessageHandler);

  return () => {
    socket.off(socketEvents.receiveNewMessage, newMessageHandler);
  }
}

export const useListenToNewMessage = () => {
  const user = useCurrentUser();
  const { conversations } = useConversationStore((state) => ({
    conversations: state.conversations,
    addNewMessage: state.addNewMessage,
  }));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const findReceiver = (conversationId: string, senderId: string) => {
    const conv = conversations.find((conv) => conv.id === conversationId);
    if (!conv) {
      return null;
    }

    return conv.members.filter((member) => member.user_id !== senderId);
  };

  return {};
};


const onConnection = () => {
  toast.success('Connected to the server');
  console.log('connected to socket');
}

export const syncConversationStore = (token: string) => {
  socket.on('connect', onConnection);
  const unregister = registerSocketHandlers();

  if (!socket.connected || socket.disconnected) {
    console.log('connecting the socket');
    socket.auth = {
      token: 'Bearer ' + token,
    }
    socket.connect(); // subscribe to websocket backend
  }

  // unsubscribe
  return () => {
    console.log('disconnecting socket');
    socket.off('connect', onConnection);
    unregister();
    socket.disconnect();
  }
}


export default useListenToNewMessage;
