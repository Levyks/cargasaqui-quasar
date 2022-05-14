interface Window {
  FIREBASE_APPCHECK_DEBUG_TOKEN: boolean;
}

declare module 'src/locales/*.yaml' {
  import type { LocaleMessageDictionary, VueMessageType } from 'vue-i18n';

  const locale: LocaleMessageDictionary<VueMessageType>;
  export default locale;
}
