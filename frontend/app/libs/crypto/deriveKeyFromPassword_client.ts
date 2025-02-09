import { genSalt } from "./util";

const getPBKDF2KeyMaterialClient = async (password: string) => {
    const enc = new TextEncoder();
    return await window.crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        "PBKDF2",
        false,
        ["deriveBits", "deriveKey"],
    );
}

// deriveKeyFromPassword derive a crypto key from password with specified key length in bytes
// with PBKDF2 key derivation function
export const deriveKeyFromPasswordClient = async (password: string, keyLength: number, passwordSalt?: Uint8Array): Promise<{
    key_size: number,
    salt_size: number,
    salt: Uint8Array,
    iter: number,
    algo: string,
    aesKey: CryptoKey
}> => {
    const keyMaterial = await getPBKDF2KeyMaterialClient(password);
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

    const pbkdf2DerivedKey = await window.crypto.subtle.deriveKey(
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
        salt: new Uint8Array(salt),
        aesKey: pbkdf2DerivedKey,
    };
}


// deriveKeyFromPassword derive a cryptographically bits derivation from password with specified key length in bytes
// with PBKDF2 key derivation function
export const deriveBitsFromPasswordClient = async (password: string, keyLength: number): Promise<{
    key_size: number,
    salt_size: number,
    salt: Uint8Array,
    iter: number,
    algo: string,
    derivedBits: ArrayBuffer,
}> => {
    const keyMaterial = await getPBKDF2KeyMaterialClient(password);
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

    const derivedBits = await window.crypto.subtle.deriveBits(
        pbkdf2Params,
        keyMaterial,
        keyLength * 8,
    )

    return {
        algo,
        iter,
        key_size: keyLength * 8,
        salt_size,
        salt: new Uint8Array(salt),
        derivedBits,
    };
}