import crypto from "crypto";
import { BigInteger as BigIntJSBN } from 'jsbn';
import { ECPointFp } from "./jsbn/ec";
import curves, { X9ECParameters } from './jsbn/sec';

export const BigInteger = BigIntJSBN;
export const Curves: Record<string, () => X9ECParameters> = curves;

export const getCurve = function (name: string): X9ECParameters {
    if (!Curves[name])
        throw new Error("Curve `" + name + "` is not supported");

    return Curves[name]();
};

export const getBytesLength = function (curve: any) {
    return Math.ceil(curve.getN().bitLength() * 0.125);
};

export const generateR = function (curve: any, callback?: any): Buffer | void {
    var n = curve.getN();
    return crypto.randomBytes(n.bitLength(), callback);
};

export const generateKeys = function (curve: X9ECParameters, r?: any) {
    var privateKey = PrivateKey.generate(curve, r);

    return {
        publicKey: privateKey.derivePublicKey(),
        privateKey: privateKey,
    };
};

/*** PublicKey class ***/

//var HEADER_XY = 0x04,
//	HEADER_X_EVEN = 0x02,
//	HEADER_X_ODD = 0x03,

export class PublicKey {
    private curve: X9ECParameters;
    public Q: ECPointFp;
    private buffer: Buffer;


    constructor(curve: any, Q: ECPointFp, buf?: Buffer) {
        this.curve = curve;
        this.Q = Q;

        if (buf) {
            this.buffer = buf;
        } else {
            var bytes = getBytesLength(curve),
                size = bytes * 2;

            this.buffer = Buffer.allocUnsafe(size);
            fillBuffer(
                this.Q.getX().toBigInteger().toString(16),
                bytes,
                this.buffer,
                0
            );
            fillBuffer(
                this.Q.getY().toBigInteger().toString(16),
                bytes,
                this.buffer,
                bytes
            );
        }
    }

    public static fromBuffer(curve: X9ECParameters, buf: Buffer) {
        var bytes = getBytesLength(curve),
            size = bytes * 2;

        if (buf.length !== size) throw new Error("Invaild buffer length");

        var x = buf.slice(0, bytes), // skip the 04 for uncompressed format
            y = buf.slice(bytes),
            c = curve.getCurve(),
            P = new ECPointFp(
                c,
                c.fromBigInteger(new BigInteger(x.toString("hex"), 16)),
                c.fromBigInteger(new BigInteger(y.toString("hex"), 16))
            );

        return new PublicKey(curve, P, buf);
    };

    public verifySignature(hash: Buffer, signature: Buffer) {
        var data = deserializeSig(signature),
            r = data.r,
            s = data.s,
            Q = this.Q,
            e = new BigInteger(hash.toString("hex"), 16),
            n = this.curve.getN(),
            G = this.curve.getG();

        if (r.compareTo(BigInteger.ONE) < 0 || r.compareTo(n) >= 0) return false;

        if (s.compareTo(BigInteger.ONE) < 0 || s.compareTo(n) >= 0) return false;

        var c = s.modInverse(n),
            u1 = e.multiply(c).mod(n),
            u2 = r.multiply(c).mod(n),
            // TODO we may want to use Shamir's trick here:
            point = G.multiply(u1).add(Q.multiply(u2)),
            v = point.getX().toBigInteger().mod(n);

        return v.equals(r);
    };
}


//PublicKey.compress = function() {
//	// this will work only on U curve
//
//	var x = this.Q.getX().toBigInteger(),
//		y = this.Q.getY().toBigInteger();
//
//	var xBa = hexToBuffer(x.toString(16), 'hex'),
//	buf = Buffer.allocUnsafe(xBa.length+1);
//
//	if (y.isEven())
//		buf[0] = HEADER_X_EVEN;
//	else
//		buf[0] = HEADER_X_ODD;
//
//	xBa.copy(buf, 1);
//	return buf;
//};



/*** PrivateKey class ***/

export class PrivateKey {
    private curve: X9ECParameters;
    private d: any;
    private buffer: Buffer;
    private _size: number;

    constructor(curve: X9ECParameters, key: any, buf?: Buffer) {
        this.curve = curve;
        this.d = key;

        if (buf) {
            this.buffer = buf;
            this._size = buf.length;
        } else {
            this._size = getBytesLength(curve);
            this.buffer = zeroBuffer(key.toString(16), this._size);
        }
    }

    public static generate(curve: X9ECParameters, r: BigIntJSBN) {
        r = new BigIntJSBN(r || generateR(curve));

        const n1 = curve.getN().subtract(BigInteger.ONE);
        const priv = r.mod(n1).add(BigInteger.ONE);

        return new PrivateKey(curve, priv);
    };

    public static fromBuffer(curve: X9ECParameters, buf: Buffer) {
        var size = getBytesLength(curve);

        if (buf.length !== size) throw new Error("Invaild buffer length");

        var key = new BigInteger(buf.toString("hex"), 16);
        return new PrivateKey(curve, key, buf);
    };

    public derivePublicKey(): PublicKey {
        const P = this.curve.getG().multiply(this.d);
        return new PublicKey(this.curve, P);
    };

    public onCurve(publicKey: PublicKey): boolean {
        const x = publicKey.Q.getX().x,
            y = publicKey.Q.getY().x,
            a = this.curve.curve.a.x,
            b = this.curve.curve.b.x,
            q = this.curve.curve.q;

        if (x.compareTo(BigInteger.ZERO) < 0 || x.compareTo(q) >= 0) return false;

        if (y.compareTo(BigInteger.ZERO) < 0 || y.compareTo(q) >= 0) return false;

        var left = y.pow(2).mod(q),
            right = x.pow(3).add(a.multiply(x)).add(b).mod(q);

        if (left.compareTo(right) == 0) return true;
        else return false;
    };
    public deriveSharedSecret(publicKey: PublicKey): Buffer {
        if (!publicKey || !publicKey.Q || !this.onCurve(publicKey))
            throw new Error("publicKey is invaild");

        const S = publicKey.Q.multiply(this.d);
        return zeroBuffer(S.getX().toBigInteger().toString(16), this._size);
    };

    protected sign(hash: any, algorithm: any): Buffer {
        if (!hash || !hash.length) throw new Error("hash is invaild");
        if (!algorithm) throw new Error("hash algorithm is required");

        var n = this.curve.getN(),
            e = new BigInteger(hash.toString("hex"), 16),
            length = getBytesLength(this.curve);

        do {
            var k = deterministicGenerateK(hash, this.buffer, algorithm, length),
                G = this.curve.getG(),
                Q = G.multiply(k),
                r = Q.getX().toBigInteger().mod(n);
        } while (r.compareTo(BigInteger.ZERO) <= 0);

        var s = k
            .modInverse(n)
            .multiply(e.add(this.d.multiply(r)))
            .mod(n);

        return serializeSig(r, s);
    };
};



/*** local helpers ***/

var DER_SEQUENCE = 0x30,
    DER_INTEGER = 0x02;

function hexToBuffer(hex: any): Buffer {
    if (hex.length % 2 === 1) hex = "0" + hex;

    return Buffer.from(hex, "hex");
}

function zeroBuffer(hex: string, bytes: number): Buffer {
    return fillBuffer(hex, bytes, Buffer.allocUnsafe(bytes), 0);
}

function fillBuffer(hex: string, bytes: number, buf: Buffer, start: number): Buffer {
    if (hex.length % 2 === 1) hex = "0" + hex;

    var length = hex.length * 0.5,
        pos = start + bytes - length;

    buf.fill(0, start, pos);
    buf.write(hex, pos, length, "hex");

    return buf;
}

// generate K value based on RFC6979
function deterministicGenerateK(hash: crypto.BinaryLike, key: any, algorithm: string, length: number) {
    let v: any = Buffer.allocUnsafe(length).fill(1),
        k: any = Buffer.allocUnsafe(length).fill(0);

    let hmac = crypto.createHmac(algorithm, k);
    hmac.update(v);
    hmac.update(Buffer.allocUnsafe(1).fill(0) as any);
    hmac.update(new Uint8Array(key));
    hmac.update(hash);
    k = hmac.digest();

    hmac = crypto.createHmac(algorithm, k);
    hmac.update(v);
    v = hmac.digest();

    hmac = crypto.createHmac(algorithm, k);
    hmac.update(v);
    hmac.update(Buffer.allocUnsafe(1).fill(1) as any);
    hmac.update(key);
    hmac.update(hash);
    k = hmac.digest();

    hmac = crypto.createHmac(algorithm, k);
    hmac.update(v);
    v = hmac.digest();

    hmac = crypto.createHmac(algorithm, k);
    hmac.update(v);
    v = hmac.digest();

    return new BigInteger(v.toString("hex"), 16);
}

function serializeSig(r: any, s: any) {
    var rBa = hexToBuffer(r.toString(16));
    var sBa = hexToBuffer(s.toString(16));

    var buf: any = Buffer.allocUnsafe(6 + rBa.length + sBa.length),
        end: any = buf.length - sBa.length;

    buf[0] = DER_SEQUENCE;
    buf[1] = buf.length - 2;

    buf[2] = DER_INTEGER;
    buf[3] = rBa.length;
    rBa.copy(buf, 4);

    buf[end - 2] = DER_INTEGER;
    buf[end - 1] = sBa.length;
    sBa.copy(buf, end);

    return buf;
}

function deserializeSig(buf: Buffer) {
    if (buf[0] !== DER_SEQUENCE)
        throw new Error("Signature is not a valid DERSequence");

    if (buf[1] > buf.length - 2) throw new Error("Signature length is too short");

    if (buf[2] !== DER_INTEGER)
        throw new Error("First element in signature must be a DERInteger");

    var pos = 4,
        rBa = buf.slice(pos, pos + buf[3]);

    pos += rBa.length;
    if (buf[pos++] !== DER_INTEGER)
        throw new Error("Second element in signature must be a DERInteger");

    var sBa = buf.slice(pos + 1, pos + 1 + buf[pos]);

    return {
        r: new BigInteger(rBa.toString("hex"), 16),
        s: new BigInteger(sBa.toString("hex"), 16),
    };
}
