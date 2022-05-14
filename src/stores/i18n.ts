import { defineStore } from 'pinia';

export const useI18nStore = defineStore('i18n', {
  state: () => ({
    loadingLocale: true,
  }),
  getters: {
    localeLoaded: (state) => !state.loadingLocale,
  },
});
