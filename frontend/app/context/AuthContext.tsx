'use client';

import ecdh from 'ecdh';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';


export type AuthState = {
  authStatus: 'unauthenticated' | 'loading' | 'authenticated';
  setAuthStatus: (status: AuthState['authStatus']) => void;
  user: {
    token: string,
    id: string,
    username: string,
    fullname: string,
    public_key?: ecdh.PublicKey,
    private_key?: ecdh.PrivateKey,
  };
  setUser: (user: Partial<AuthState['user']>) => void;
}

const defaultState: AuthState = {
  authStatus: 'loading',
  setAuthStatus: () => { },
  user: {
    id: '',
    token: '',
    username: '',
    fullname: '',
  },
  setUser: () => { },
}

export const useAuthStore = create<AuthState>()(
  devtools(
    immer((set) => ({
      ...defaultState,
      setAuthStatus: (status) => {
        set((state) => {
          state.authStatus = status;
        });
      },
      setUser: (user) => {
        set((state) => {
          state.user = { ...state.user, ...user };
        });
      },
    })),
    {
      name: 'auth',
      enabled: true,
      anonymousActionType: 'AUTH_ACTION',
    },
  ),
);