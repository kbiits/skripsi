import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import loginService from '@/app/services/login';
import { deriveKeyFromPassword } from '@/app/libs/crypto/deriveKeyFromPassword';
import { arrayBufferToHexist, hexistsToArrayBuffer } from '@/app/libs/crypto/util';
import { decryptEcdhPrivateKey } from '@/app/libs/crypto/ecdh';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // check if user details are passed
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Please enter your credentials');
        }

        const data = await loginService(credentials.username, credentials.password);
        const key = await deriveKeyFromPassword(
          credentials.password, 32, new Uint8Array(hexistsToArrayBuffer(data.user.dkf_salt)),
        );
        const decryptedPrivateKey = await decryptEcdhPrivateKey(
          key.aesKey,
          new Uint8Array(hexistsToArrayBuffer(data.user.iv_private_key)),
          new Uint8Array(hexistsToArrayBuffer(data.user.private_key)),
        );

        return {
          id: data.user.id,
          backend_token: data.token,
          ecdh_private_key: arrayBufferToHexist(decryptedPrivateKey),
          ecdh_public_key: data.user.public_key,
          fullname: data.user.fullname,
          username: data.user.username,
          name: data.user.fullname,
          image: "",
          email: "",
        };
      },
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.fullname = user.fullname;
        token.backend_token = user.backend_token;
        token.ecdh_private_key = user.ecdh_private_key;
        token.ecdh_public_key = user.ecdh_public_key;
      }

      return token
    },
    async session({ session, token }) {
      const exposedData = ['id', 'username', 'fullname', 'backend_token', 'ecdh_private_key', 'ecdh_public_key'] as const;
      exposedData.forEach(key => {
        (session.user as any)[key] = token[key];
      })

      return session
    }
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
