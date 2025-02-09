import { message } from '../hooks/useConversation';
import { decryptConversation } from '../libs/conversation/utils';
import { deriveSharedSecret, deserializeECDHPrivateKey, deserializeECDHPublicKey } from '../libs/crypto/ecdh';
import { hexistsToArrayBuffer } from '../libs/crypto/util';
import { getConversationByIdService, getMessagesByConversationIdService } from '../services/getConversation';
import getCurrentUser from './getCurrentUser';

const getConversationMessagesById = async (conversationId: string): Promise<message[]> => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return [];

        const conversation = await getConversationByIdService(currentUser.user.backend_token, conversationId);
        if (!conversation) return [];

        const otherUserPublicKey = conversation.members.find((member: any) => member.user_id !== currentUser.user.id)?.user.public_key;

        const messages = await getMessagesByConversationIdService(currentUser.user.backend_token, conversationId);

        const decryptedMessages = [];
        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            const derivedSharedSecret = deriveSharedSecret(
                deserializeECDHPrivateKey(currentUser.user.ecdh_private_key),
                deserializeECDHPublicKey(otherUserPublicKey),
            );

            decryptedMessages.push({
                ...message,
                content: decryptConversation(
                    hexistsToArrayBuffer(message.content),
                    derivedSharedSecret,
                    hexistsToArrayBuffer(message.metadata.iv),
                ),
            });
        }

        return decryptedMessages;
    } catch (error: any) {
        console.log('error get conversation messages', error);
        return [];
    }
};

export default getConversationMessagesById;
