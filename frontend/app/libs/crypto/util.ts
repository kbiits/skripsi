import crypto from 'crypto';

export const arrayBufferToString = (arrayBuffer: ArrayBufferLike) => new Uint8Array(arrayBuffer)
    .reduce((data, byte) => data + String.fromCharCode(byte), '');

export const arrayBufferToHexist = (buffer: ArrayBufferLike) => {
    return Buffer.from(buffer).toString('hex');
};


export const hexistsToArrayBuffer = (hexString: string): Buffer => {
    return Buffer.from(hexString, 'hex')
    // // ensure even number of characters
    // if (hexString.length % 2 != 0) {
    //     // console.log('WARNING: expecting an even number of characters in the hexString');
    //     throw Error('expecting an even number of characters in the hexString');
    // }

    // // check for some non-hex characters
    // const bad = hexString.match(/[G-Z\s]/i);
    // if (bad) {
    //     throw Error('found non-hex characters');
    //     // console.log('WARNING: found non-hex characters', bad);
    // }

    // // split the string into pairs of octets
    // const pairs = hexString.match(/[\dA-F]{2}/gi);
    // if (!pairs) {
    //     throw Error('unmatched hexist string');
    // }

    // // convert the octets to integers
    // const integers = pairs.map(function (s) {
    //     return parseInt(s, 16);
    // });

    // var array = new Uint8Array(integers!);
    // return array;
}

export const base64Encode = (data: string) => btoa(data);
export const arrayBufferToBase64 = (data: ArrayBufferLike) => btoa(new Uint8Array(data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
export const base64Decode = (data: string) => Uint8Array.from(atob(data), c => c.charCodeAt(0));

export const genSalt = (bytes: number) => {
    return crypto.randomBytes(bytes);
}

const pemPrivateKeyStructure = {
    header: '-----BEGIN PRIVATE KEY-----',
    footer: '-----END PRIVATE KEY-----',
};

const pemPublicKeyStructure = {
    header: '-----BEGIN PUBLIC KEY-----',
    footer: '-----END PUBLIC KEY-----',
};

export const exportKeyToPkcs8Pem = async (key: crypto.webcrypto.CryptoKey) => {
    const arrayBufferKey = await crypto.subtle.exportKey('pkcs8', key);
    const stringKey = arrayBufferToString(arrayBufferKey);
    const keyEncoded = base64Encode(stringKey);

    return `${pemPrivateKeyStructure.header}\n${keyEncoded}\n${pemPrivateKeyStructure.footer}`
}

export const exportKeyToSpkiPem = async (key: crypto.webcrypto.CryptoKey) => {
    const arrayBufferKey = await crypto.subtle.exportKey('spki', key);
    const stringKey = arrayBufferToString(arrayBufferKey);
    const keyEncoded = base64Encode(stringKey);

    return `${pemPublicKeyStructure.header}\n${keyEncoded}\n${pemPublicKeyStructure.footer}`
}

export const generateRandomIV = (length: number) => new Uint8Array(crypto.randomBytes(length));
