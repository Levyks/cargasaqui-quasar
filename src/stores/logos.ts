import { defineStore } from 'pinia';
import { fetchLogoSrc } from 'models/company';

export type LogosStoreState = {
  logos: {
    [companyId: string]: string;
  };
};

export const useLogosStore = defineStore('logos', {
  state: () =>
    ({
      logos: {},
    } as LogosStoreState),
  actions: {
    async getLogo(companyId: string): Promise<string> {
      if (this.logos[companyId]) return this.logos[companyId];
      return fetchLogoSrc(companyId);
    },
  },
});
