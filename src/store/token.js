import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTokenStore = create(
  persist(
    (set) => ({
      access_token: '',
      refresh_token: '',
      expires_in: 0,
      setTokens: (data) => set((state) => ({ ...state, ...data })),
    }),
    {
      name: 'tokens',
    }
  )
);
