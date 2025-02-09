import AES from "../crypto/aes/aes";

export const decryptConversation = (message: Uint8Array | Buffer, secretKey: Uint8Array | ArrayBuffer | Buffer, iv: Uint8Array | Buffer) => {
    const aes = new AES.CBC(secretKey, iv);
    const decrypted = aes.decrypt(message)
    const plainTextPadStripped = AES.padding.pkcs7.strip(decrypted);
    return AES.utils.utf8.fromBytes(plainTextPadStripped);
}

export const encryptConversation = (message: string, secretKey: Uint8Array | ArrayBuffer | Buffer, iv: Uint8Array | Buffer): Uint8Array => {
    const messagePrepared = AES.padding.pkcs7.pad(AES.utils.utf8.toBytes(message));
    const aes = new AES.CBC(secretKey, iv);
    const encrypted = aes.encrypt(messagePrepared)
    return encrypted
}
