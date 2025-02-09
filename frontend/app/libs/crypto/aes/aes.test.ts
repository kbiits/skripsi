import { assert } from "node:console";
import { deriveBitsFromPasswordServer } from "../deriveKeyFromPassword";
import AES from './aes';


const encryptAndDecrypt = async (key: string, plaintext: string,) => {
    const aesKeyLengthInBytes = 32;
    const keyInBits = new Uint8Array((await deriveBitsFromPasswordServer(key, aesKeyLengthInBytes)).derivedBits);

    // iv should in 16 bytes
    const iv = crypto.getRandomValues(new Uint8Array(16));

    const plainTextToEncryptInBytes = AES.utils.utf8.toBytes(plaintext);
    const plainTextPadded = AES.padding.pkcs7.pad(plainTextToEncryptInBytes);


    const aesCbc = new AES.CBC(keyInBits, iv);
    const encrypted = aesCbc.encrypt(plainTextPadded)
    const encryptedString = AES.utils.utf8.fromBytes(encrypted);

    // console.log("encryptedString: ", encryptedString)

    const decryption = new AES.CBC(keyInBits, iv);
    const decrypted = decryption.decrypt(encrypted);
    const decryptedString = AES.utils.utf8.fromBytes(AES.padding.pkcs7.strip(decrypted));
    // console.log("decryptedString: ", decryptedString)

    return decryptedString;
}

(async () => {
    const testtables = [
        {
            key: "ini-key-aes-sangat-rahasia-1",
            plainText: "tolong rahasiakan pesan ini",
        },
        {
            key: "ini-key-aes-sangat-rahasia-2",
            plainText: "tolong rahasiakan pesan ini 2",
        },
        {
            key: "ini-key-aes-sangat-rahasia-3",
            plainText: "tolong rahasiakan pesan ini 3",
        },
    ];

    for (const data of testtables) {
        const decrypted = await encryptAndDecrypt(data.key, data.plainText)
        assert(decrypted === data.plainText)
    }
})()