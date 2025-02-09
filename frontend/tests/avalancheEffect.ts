// script ini bertujuan untuk menghitung avalonce effect
// cara kerjanya adalah membandingkan plain text dan encrypted text

import AES from '@/app/libs/crypto/aes/aes.js';
import { deriveBitsFromPasswordServer } from '@/app/libs/crypto/deriveKeyFromPassword';
import { arrayBufferToHexist, generateRandomIV } from '@/app/libs/crypto/util.js';
import testdata from './testing_data2.json';
import { createObjectCsvWriter } from 'csv-writer'

const outputPath = './result2.csv'
const blueText = (m: string) => `\x1b[36m${m}\x1b[0m`

function stringToHex(str: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hex = Array.from(data, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return hex;
}

const calculateAvalancheEffectPercentage = (msg1Binary: Uint8Array, msg2Binary: Uint8Array) => {
  if (msg1Binary.length !== msg2Binary.length) {
    throw new Error("The length of the msg1 and msg2 is not the same.");
  }

  let differentBits = 0;
  for (let i = 0; i < msg1Binary.length; i++) {
    if (msg1Binary[i] !== msg2Binary[i]) {
      differentBits++;
    }
  }

  let percentage = (differentBits / msg1Binary.length) * 100;
  return percentage;
}

const encrypt = (iv: Uint8Array, key: Uint8Array, data: Uint8Array): Uint8Array => {
  const aes = new AES.CBC(key, iv);
  return aes.encrypt(data);
}

const decrypt = (iv: Uint8Array, key: Uint8Array, data: Uint8Array): Uint8Array => {
  const aes = new AES.CBC(key, iv);
  return aes.decrypt(data);
}

const getPlainTextFromDecryption = (content: Uint8Array) => {
  return AES.utils.utf8.fromBytes(
    AES.padding.pkcs7.strip(content)
  );
}

async function avalancheEffect(message1: string, message2: string) {
  const aesSecretKeyString = "very_secret_key";
  const aesKey = new Uint8Array((await deriveBitsFromPasswordServer(aesSecretKeyString, 32)).derivedBits);
  const iv = generateRandomIV(16)

  const startMsg1 = Date.now()
  const message1Bytes = AES.padding.pkcs7.pad(AES.utils.utf8.toBytes(message1));
  const encryptedTextMsg1 = encrypt(iv, aesKey, message1Bytes)
  const encryptionMsg1Time = Date.now() - startMsg1

  const startMsg2 = Date.now()
  const message2Bytes = AES.padding.pkcs7.pad(AES.utils.utf8.toBytes(message2));
  const encryptedTextMsg2 = encrypt(iv, aesKey, message2Bytes);
  const encryptionMsg2Time = Date.now() - startMsg2

  const avalancheEffectValue = calculateAvalancheEffectPercentage(encryptedTextMsg1, encryptedTextMsg2);

  // console.log(`${blueText('Avalanche Effect Testing')}
  //   text 1                        : ${message1}
  //   encoded text 1                : ${AES.utils.utf8.toBytes(message1)}
  //   encryptedText 1               : ${encryptedTextMsg1}
  //   time to encrypt 1             : ${encryptionMsg1Time}
  //   text 2                        : ${message2}
  //   encoded text 2                : ${AES.utils.utf8.toBytes(message2)}
  //   encryptedText 2               : ${encryptedTextMsg2}
  //   time to encrypt 2             : ${encryptionMsg2Time}

  //   avalonce effect               : ${avalancheEffectValue.toFixed(2)}%
  //   `)

  return {
    message1,
    message1Bytes,
    encryptedTextMsg1,
    message2,
    message2Bytes,
    encryptedTextMsg2,
    avalancheEffectValue,
  }

  // text | panjang | awal (ms) | enkripsi (ms) | dekripsi (ms) | total (ms) | avalonce effect (%)
}



const testCases: any[] = [];
(async () => {
  for (const data of testdata.avalanche_effects) {
    let result;
    let effects = [];
    for (let i = 0; i < 100; i++) {
      result = await avalancheEffect(data.message_1, data.message_2);
      effects.push(result.avalancheEffectValue);
    }
    const val = effects.reduce((acc, curr) => acc + curr, 0) / effects.length;
    result!.avalancheEffectValue = val;
    testCases.push(result);
  }

  const objectCsvCreator = createObjectCsvWriter({
    header: [
      { id: 'no', title: 'No' },
      { id: 'msg', title: 'Pesan' },
      { id: 'ct', title: 'Ciphertext' },
      { id: 'ae', title: 'Avalanche Effect' },
    ],
    path: outputPath,
    fieldDelimiter: ';',
  });

  // console.log(testCases);
  console.log(testCases.reduce((acc, curr) => acc + curr.avalancheEffectValue, 0) / testCases.length);


  const csvData: any[] = []
  let no = 1;
  testCases.forEach(data => {
    csvData.push({
      no: no,
      msg: data.message1,
      ct: arrayBufferToHexist(data.encryptedTextMsg1).replace(/(.{2})/g, "$1 "),
      ae: data.avalancheEffectValue,
    })

    csvData.push({
      no: no,
      msg: data.message2,
      ct: arrayBufferToHexist(data.encryptedTextMsg2).replace(/(.{2})/g, "$1 "),
      ae: "",
    })

    no += 1
  })
  await objectCsvCreator.writeRecords(csvData)
})()


// randomWord(10)
// avalancheEffect("Maeceanast")
// avalancheEffect("Sed perpiciatis unde")
// avalancheEffect("Voluptatem acusantium dolorque")
// avalancheEffect("Nem enim ipsam voluptatem quias voluptas")
// avalancheEffect("In reprehenderit voluptate vellit esse cillum dolo")
// avalancheEffect("Ut enim ad minima veniam, quihs nostrum exercitationem ullam")
// avalancheEffect("Labori nisi ut aliquip ex ea commodo consequat. Duis aute irures dolor")
// avalancheEffect("Excepteur sint occaecat cupidatat non proident, sunt in culpa qui offic deserunt")
// avalancheEffect("Mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem")
// avalancheEffect("Accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et")


// avalancheEffect("sit amet consect", "sit emet consect")
// avalancheEffect("text yang sangat panjang sekali sekali sekali sekali sit amet consect", "text yang sangat panjang sekali sekali sekali sekali sit emet consect")