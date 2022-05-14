import { defineStore } from 'pinia';
import { User } from 'firebase/auth';

export type AuthStoreState = {
  user: User | null;
  checked: boolean;
};

export const useAuthStore = defineStore<'auth', AuthStoreState>('auth', {
  state: () => ({
    user: null,
    checked: false,
  }),
});
