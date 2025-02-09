
import * as ecdh from '@/app/libs/crypto/ecdh/index';
import crypto from 'crypto';

const ecdhCurveString = 'secp256r1';
const curve = ecdh.getCurve(ecdhCurveString);
const generateEcdhKeyPair = (): any => {
    return ecdh.generateKeys(curve);
}

export const encryptEcdhPrivateKey = async (aesCBCSecretKey: CryptoKey, iv: Uint8Array, message: Uint8Array) => {
    return window.crypto.subtle.encrypt({
        name: 'AES-CBC',
        iv,
    }, aesCBCSecretKey, message)
}

export const decryptEcdhPrivateKey = async (aesCBCSecretKey: CryptoKey, iv: Uint8Array, message: Uint8Array) => {
    return crypto.subtle.decrypt({
        name: 'AES-CBC',
        iv,
    }, aesCBCSecretKey, message)
}

export const serializeECDHKey = (key: any) => {
    return key.buffer.toString('hex');
}

export const deserializeECDHPublicKey = (pubKey: string) => {
    return ecdh.PublicKey.fromBuffer(ecdh.getCurve(ecdhCurveString), Buffer.from(pubKey, 'hex'));
}

export const deserializeECDHPrivateKey = (privKey: string) => {
    return ecdh.PrivateKey.fromBuffer(ecdh.getCurve(ecdhCurveString), Buffer.from(privKey, 'hex'));
}

export const deriveSharedSecret = (privateKey: any, publicKey: any): ArrayBuffer => {
    return privateKey.deriveSharedSecret(publicKey);
}

export default generateEcdhKeyPair;