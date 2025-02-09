"use client";

import { createContext, useContext } from "react";

export type CryptoContextValue = {
    loggedInUserKey: {
        publicKey: any,
        privateKey: any,
    }
}

const CryptoContext = createContext<CryptoContextValue>({} as any);

export const useCryptoContext = () => useContext(CryptoContext);
export default CryptoContext;

