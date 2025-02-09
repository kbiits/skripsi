import { conversation } from "../hooks/useConversation";
import { decryptConversation } from "../libs/conversation/utils";
import { deriveSharedSecret, deserializeECDHPrivateKey, deserializeECDHPublicKey } from "../libs/crypto/ecdh";
import { hexistsToArrayBuffer } from "../libs/crypto/util";
import { getConversationByIdService, getConversationsService } from "../services/getConversation";
import getCurrentUser from "./getCurrentUser";

const getConversations = async () => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.user.id) return [];

    const conversations = await getConversationsService(
      currentUser.user.backend_token
    );

    if (!conversations) return [];

    const decryptedConvs = [];
    for (let i = 0; i < conversations.length; i++) {
      const conv = conversations[i];
      // derive shared secret for each conversation
      const sender = conv.members.find((member: any) => member.user_id !== currentUser.user.id);
      const derivedSharedSecret = deriveSharedSecret(
        deserializeECDHPrivateKey(currentUser.user.ecdh_private_key),
        deserializeECDHPublicKey(sender.user.public_key),
      );

      decryptedConvs.push({
        ...conv,
        messages: [],
        last_message: conv?.last_message
          ? {
            ...conv?.last_message,
            content: decryptConversation(
              hexistsToArrayBuffer(conv.last_message.content),
              derivedSharedSecret,
              hexistsToArrayBuffer(conv.last_message.metadata.iv),
            ),
          }
          : null,
      });
    }

    return decryptedConvs;
  } catch (error: any) {
    console.log("error get conversations", error);
    return [];
  }
};

export const getConversationById = async (conversationId: string): Promise<conversation | null> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return null;

    const conversation = await getConversationByIdService(
      currentUser.user.backend_token,
      conversationId
    );

    if (!conversation) return null;

    const sender = conversation.members.find(
      (member: any) => member.user_id !== currentUser.user.id
    );

    return {
      ...conversation,
    };
  } catch (error: any) {
    console.log("error get conversation by id", error);
    return null;
  }
}

export default getConversations;
