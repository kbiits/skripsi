import AES from '@/app/libs/crypto/aes/aes';
import { generateRandomIV } from '@/app/libs/crypto/util';
import { createObjectCsvWriter } from 'csv-writer';
import * as ecdh from '@/app/libs/crypto/ecdh/index';
import testdata from './testing_data3.json';
const ecdhCurveString = 'secp256r1';
const outputPath = './result-time-newtest.csv'

type encryptResult = {
    diff: [number, number],
    encrypted: Uint8Array,
    iv: Uint8Array,
}

type decryptResult = {
    diff: [number, number],
    decrypted: Uint8Array,
}

const encrypt = (pesan: string, key: Uint8Array): encryptResult => {
    const start = process.hrtime();
    const messagePrepared = AES.padding.pkcs7.pad(
        AES.utils.utf8.toBytes(pesan)
    )
    const iv = generateRandomIV(16);
    const cbc = new AES.CBC(key, iv);
    const res = cbc.encrypt(messagePrepared);
    const diff = process.hrtime(start);
    return {
        diff,
        encrypted: res,
        iv,
    }
}

const decrypt = (encrypted: encryptResult, key: Uint8Array): decryptResult => {
    const start = process.hrtime();
    const iv = generateRandomIV(16);
    const cbc = new AES.CBC(key, iv);
    const res = cbc.decrypt(encrypted.encrypted);
    const diff = process.hrtime(start);
    return {
        diff,
        decrypted: res,
    }
}

const deriveSharedSecret = (privateSender: any, publicReceiver: ecdh.PublicKey) => {
    const start = process.hrtime();
    const sharedSecret = privateSender.deriveSharedSecret(publicReceiver);
    return {
        diff: process.hrtime(start),
        sharedSecret,
    };
}

const generateEcdhKeyPair = () => {
    return ecdh.generateKeys(ecdh.getCurve(ecdhCurveString));
}

(async () => {
    const objectCsvCreator = createObjectCsvWriter({
        header: [
            { id: 'no', title: 'No' },
            { id: 'msg', title: 'Pesan' },
            { id: 'msg_len', title: 'Panjang Pesan' },
            { id: 'a', title: 'Waktu Enkripsi (ms)' },
            { id: 'b', title: 'Waktu Dekripsi (ms)' },
            { id: 'c', title: 'Waktu menurunkan kunci bersama (ms)' },
        ],
        fieldDelimiter: ";",
        path: outputPath,
    });

    const csvData = [];
    let i = 1;
    const sumVal = {
        "encryption": 0,
        "decryption": 0,
        "ecdh": 0,
    };

    const keyPairs1 = generateEcdhKeyPair();
    const keyPairs2 = generateEcdhKeyPair();

    for (let data of testdata.timeCalculation) {
        let encDiffs = []
        let decDiffs = []
        let sumDeriveSharedSecret = BigInt(0);

        for (let i = 0; i < 5; i++) {
            const deriveRes = deriveSharedSecret(keyPairs1.privateKey, keyPairs2.publicKey);

            if (deriveRes.diff[0] !== 0) {
                throw new Error("can't above zero");
            }
            sumDeriveSharedSecret += BigInt(deriveRes.diff[1]);

            const resEnc = encrypt(data, new Uint8Array(deriveRes.sharedSecret));
            const resDec = decrypt(resEnc, new Uint8Array(deriveRes.sharedSecret));
            encDiffs.push(resEnc.diff)
            decDiffs.push(resDec.diff)
        }

        let sumEnc = encDiffs.reduce((acc, curr) => [acc[0] + BigInt(curr[0]), acc[1] + BigInt(curr[1])],
            [BigInt(0), BigInt(0)]);
        let sumDec = decDiffs.reduce((acc, curr) => [acc[0] + BigInt(curr[0]), acc[1] + BigInt(curr[1])],
            [BigInt(0), BigInt(0)]);

        sumEnc[0] = sumEnc[0] / BigInt(20)
        sumEnc[1] = sumEnc[1] / BigInt(20)
        sumDec[0] = sumDec[0] / BigInt(20)
        sumDec[1] = sumDec[1] / BigInt(20)

        if (sumDec[0] !== BigInt(0) || sumEnc[0] !== BigInt(0)) {
            throw new Error("wow");
        }
        let avgDerive = sumDeriveSharedSecret / BigInt(20);

        sumVal["encryption"] += Number(sumEnc[1]) / 1e6;
        sumVal["decryption"] += Number(sumDec[1]) / 1e6;
        sumVal["ecdh"] += Number(avgDerive) / 1e6;

        csvData.push({
            no: i,
            msg: data,
            msg_len: data.length,
            // te: `${sumEnc[0]}s${sumEnc[1]}ns`, // nano seconds to mili seconds
            // td: `${sumDec[0]}s${sumDec[1]}ns`,
            a: `${Number(sumEnc[1]) / 1e6}ms`,
            b: `${Number(sumDec[1]) / 1e6}ms`,
            c: `${Number(avgDerive) / 1e6}ms`
        })

        i += 1
    }

    console.log(sumVal);

    await objectCsvCreator.writeRecords(csvData)
})()