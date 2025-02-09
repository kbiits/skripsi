"use client";

import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import LoadingModal from "../components/LoadingModal";
import { useAuthStore } from "../context/AuthContext";
import {
  deserializeECDHPrivateKey,
  deserializeECDHPublicKey
} from "../libs/crypto/ecdh";

const loadEcdhKeysFromHexist = (publicKey: string, privateKey: string) => {
  return {
    publicKey: deserializeECDHPublicKey(publicKey),
    privateKey: deserializeECDHPrivateKey(privateKey),
  };
};

const RootWrapper: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { status: authStatus, data: sessionData } = useSession();
  const authStore = useAuthStore(); // init auth store

  useEffect(() => {
    if (authStatus === "loading") {
      return
    }

    authStore.setAuthStatus(authStatus);
    if (authStatus === "authenticated") {
      const key = loadEcdhKeysFromHexist(
        sessionData.user.ecdh_public_key,
        sessionData.user.ecdh_private_key,
      );
      authStore.setUser({
        id: sessionData.user.id,
        token: sessionData.user.backend_token,
        username: sessionData.user.username,
        fullname: sessionData.user.fullname,
        public_key: key.publicKey,
        private_key: key.privateKey,
      });
    }

    return () => { };
  }, [authStatus, sessionData]);

  if (authStatus === "loading") {
    return <LoadingModal />;
  }

  if (authStatus !== "authenticated") {
    return <>{children}</>;
  }

  return <>{children}</>;
}


export default RootWrapper;
