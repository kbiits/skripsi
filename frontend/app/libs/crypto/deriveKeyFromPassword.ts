import * as crypto from 'crypto';
import { genSalt } from './util';

export const getPBKDF2KeyMaterial = async (password: string) => {
    const enc = new TextEncoder();
    return await crypto.webcrypto.subtle.importKey(
        "raw",
        enc.encode(password),
        "PBKDF2",
        false,
        ["deriveBits", "deriveKey"],
    );
}

// deriveKeyFromPassword derive a crypto key from password with specified key length in bytes
// with PBKDF2 key derivation function
export const deriveKeyFromPassword = async (password: string, keyLength: number, salt: Uint8Array): Promise<{
    key_size: number,
    salt_size: number,
    salt: Uint8Array,
    iter: number,
    algo: string,
    aesKey: crypto.webcrypto.CryptoKey
}> => {
    const keyMaterial = await getPBKDF2KeyMaterial(password);
    const salt_size = 32;
    const algo = "SHA-256";
    const iter = 100;

    const pbkdf2Params = {
        name: 'PBKDF2',
        salt,
        iterations: iter,
        hash: algo,
    };

    const pbkdf2DerivedKey = await crypto.webcrypto.subtle.deriveKey(
        pbkdf2Params,
        keyMaterial,
        {
            name: "AES-CBC",
            length: 256,
        },
        false,
        ["encrypt", "decrypt"],
    )

    return {
        algo,
        iter,
        key_size: keyLength * 8,
        salt_size,
        salt,
        aesKey: pbkdf2DerivedKey,
    };
}

// deriveKeyFromPassword derive a cryptographically bits derivation from password with specified key length in bytes
// with PBKDF2 key derivation function
export const deriveBitsFromPasswordServer = async (password: string, keyLengthInBytes: number): Promise<{
    key_size: number,
    salt_size: number,
    salt: Uint8Array | Buffer,
    iter: number,
    algo: string,
    derivedBits: ArrayBuffer,
}> => {
    const keyMaterial = await getPBKDF2KeyMaterial(password);
    const salt_size = 32;
    const salt = genSalt(salt_size);
    const algo = "SHA-256";
    const iter = 100;

    const pbkdf2Params = {
        name: 'PBKDF2',
        salt,
        iterations: iter,
        hash: algo,
    };

    const derivedBits = await crypto.subtle.deriveBits(
        pbkdf2Params,
        keyMaterial,
        keyLengthInBytes * 8,
    )

    return {
        algo,
        iter,
        key_size: keyLengthInBytes * 8,
        salt_size,
        salt,
        derivedBits,
    };
}