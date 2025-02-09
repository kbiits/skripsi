import fetcher from "../axios/axios";
import { deriveKeyFromPasswordClient } from "../libs/crypto/deriveKeyFromPassword_client";
import generateEcdhKeyPair, { encryptEcdhPrivateKey, serializeECDHKey } from "../libs/crypto/ecdh";
import { arrayBufferToHexist, generateRandomIV } from "../libs/crypto/util";

type SignUpService = {
    username: string;
    fullname: string;
    password: string;
}

const registerService = async (data: SignUpService) => {
    // 32 bytes for aes-256
    const passwordDerived = await deriveKeyFromPasswordClient(data.password, 32);
    const ecdhKeyPair = await generateEcdhKeyPair();

    const iv = generateRandomIV(16);
    const privateKeyEncrypted = await encryptEcdhPrivateKey(
        passwordDerived.aesKey, new Uint8Array(iv), ecdhKeyPair.privateKey.buffer)

    const resp = await fetcher.post("/api/sign-up", {
        username: data.username,
        fullname: data.fullname,
        password: data.password,
        dkf_salt: arrayBufferToHexist(passwordDerived.salt.buffer),
        dkf_iter: passwordDerived.iter,
        dkf_algo: passwordDerived.algo,
        dkf_key_size: passwordDerived.key_size,
        public_key: serializeECDHKey(ecdhKeyPair.publicKey), // ecdh public key
        private_key: arrayBufferToHexist(privateKeyEncrypted), // ecdh private key encrypted
        iv_private_key: arrayBufferToHexist(iv.buffer),
    });

    if (resp.status != 200) {
        throw new Error("status is not 200");
    }

    if (!resp.data) {
        throw new Error("empty data");
    }

    return resp.data;
}

export default registerService;