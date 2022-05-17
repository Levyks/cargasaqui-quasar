import { defineStore } from 'pinia';
import { IdTokenResult, User } from 'firebase/auth';

export type AuthStoreState = {
  user: User | null;
  token: IdTokenResult | null;
  checked: boolean;
};

export const useAuthStore = defineStore('auth', {
  state: () =>
    ({
      user: null,
      token: null,
      checked: false,
    } as AuthStoreState),
  actions: {
    async setUser(user: User | null) {
      console.log('AuthStateChanged -> ', user);
      this.checked = true;
      this.user = user;
      this.token = user
        ? await user
            .getIdTokenResult()
            .then((result) => {
              console.log('token result fetched', result);
              return result;
            })
            .catch(() => null)
        : null;
    },
  },
});
