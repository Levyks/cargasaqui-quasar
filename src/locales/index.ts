import { Locale } from 'vue-i18n';

export default {
  'pt-BR': () => import('src/locales/pt-BR.yaml'),
} as {
  [locale: Locale]: () => Promise<typeof import('src/locales/*.yaml')>;
};
