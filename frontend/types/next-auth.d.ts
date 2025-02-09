import NextAuth, { DefaultSession, ISODateString } from 'next-auth';
import NextAuthJWT from 'next-auth/jwt';

declare module 'next-auth' {
    interface User {
        id: string;
        username: string;
        fullname: string;
        backend_token: string;
        ecdh_private_key: string;
        ecdh_public_key: string;
    }

    interface AdapterUser {
        id: string;
        username: string;
        fullname: string;
        backend_token: string;
        ecdh_private_key: string;
        ecdh_public_key: string;
    }

    export interface Session {
        user: {
            id: string;
            username: string;
            fullname: string;
            backend_token: string;
            ecdh_private_key: string;
            ecdh_public_key: string;
        }
        expires: ISODateString
    }
}

declare module 'next-auth/jwt' {
    export interface JWT {
        id: string;
        username: string;
        fullname: string;
        backend_token: string;
        ecdh_private_key: string;
        ecdh_public_key: string;
    }
}