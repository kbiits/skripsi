import * as ecdh from '@/app/libs/crypto/ecdh/index';
import {
  encryptConversation
} from "../libs/conversation/utils";
import {
  deriveSharedSecret,
  deserializeECDHPublicKey
} from "../libs/crypto/ecdh";
import {
  arrayBufferToHexist,
  generateRandomIV
} from "../libs/crypto/util";
type encryptMessageReturn = {
  messageEncryptedHexist: string;
  ivHexist: string;
};

const useCrypto = (senderPrivKey: ecdh.PrivateKey, recvPubKey: string) => {

  if (!recvPubKey || !senderPrivKey) {
    return null;
  }

  const sharedSecret = deriveSharedSecret(
    senderPrivKey,
    deserializeECDHPublicKey(recvPubKey));

  const encryptMessageForSending = (message: string): encryptMessageReturn => {
    const iv = generateRandomIV(16);
    const messageEncrypted = encryptConversation(
      message,
      new Uint8Array(sharedSecret),
      new Uint8Array(iv)
    );

    return {
      messageEncryptedHexist: arrayBufferToHexist(messageEncrypted.buffer),
      ivHexist: arrayBufferToHexist(iv.buffer),
    };
  };

  return {
    encryptMessageForSending,
  };
};

export default useCrypto;
