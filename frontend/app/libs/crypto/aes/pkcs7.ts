// pre-define the padding values
const PADDING = [
    [16, 16, 16, 16,
        16, 16, 16, 16,
        16, 16, 16, 16,
        16, 16, 16, 16],

    [15, 15, 15, 15,
        15, 15, 15, 15,
        15, 15, 15, 15,
        15, 15, 15],

    [14, 14, 14, 14,
        14, 14, 14, 14,
        14, 14, 14, 14,
        14, 14],

    [13, 13, 13, 13,
        13, 13, 13, 13,
        13, 13, 13, 13,
        13],

    [12, 12, 12, 12,
        12, 12, 12, 12,
        12, 12, 12, 12],

    [11, 11, 11, 11,
        11, 11, 11, 11,
        11, 11, 11],

    [10, 10, 10, 10,
        10, 10, 10, 10,
        10, 10],

    [9, 9, 9, 9,
        9, 9, 9, 9,
        9],

    [8, 8, 8, 8,
        8, 8, 8, 8],

    [7, 7, 7, 7,
        7, 7, 7],

    [6, 6, 6, 6,
        6, 6],

    [5, 5, 5, 5,
        5],

    [4, 4, 4, 4],

    [3, 3, 3],

    [2, 2],

    [1]
];

export function pad(plaintext: Uint8Array) {
    const padding = PADDING[(plaintext.byteLength % 16) || 0];
    const result = new Uint8Array(plaintext.byteLength + padding.length);

    result.set(plaintext);
    result.set(padding, plaintext.byteLength);

    return result;
}

export default function unpad(padded: Uint8Array) {
    return padded.subarray(0, padded.byteLength - padded[padded.byteLength - 1]);
}