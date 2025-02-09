import { generateKeys, getCurve, PrivateKey } from ".";

const curveString = "secp256r1";
const curve = getCurve(curveString)
const keyPair1 = generateKeys(curve);
const keyPair2 = generateKeys(curve);

const sharedSecret1 = keyPair1.privateKey.deriveSharedSecret(keyPair2.publicKey)
const sharedSecret2 = keyPair2.privateKey.deriveSharedSecret(keyPair1.publicKey)

console.log(sharedSecret1.toString("hex"));
console.log(sharedSecret2.toString("hex"));

