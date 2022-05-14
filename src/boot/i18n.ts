import { boot } from 'quasar/wrappers';
import { createI18n, I18n, Locale } from 'vue-i18n';
import { Loading } from 'quasar';

import locales from 'src/locales';
import { useI18nStore } from 'src/stores/i18n';

function getValidLocale(
  locale = navigator.language,
  fallback = 'pt-BR'
): Locale {
  const availableLocations = Object.keys(locales);

  if (availableLocations.includes(locale)) return locale;

  const onlyLanguageCode = locale.split('-')[0];

  if (availableLocations.includes(onlyLanguageCode)) return onlyLanguageCode;

  const firstMatchingLocale = availableLocations.find((availableLocale) =>
    availableLocale.startsWith(onlyLanguageCode)
  );
  if (firstMatchingLocale) return firstMatchingLocale;

  return fallback;
}

function loadLocale(
  i18n: I18n<unknown, unknown, unknown, true>,
  locale: Locale
): Promise<void> {
  const store = useI18nStore();

  store.loadingLocale = true;
  Loading.show();

  return locales[locale]().then((module) => {
    i18n.global.setLocaleMessage(locale, module.default);

    store.loadingLocale = false;
    Loading.hide();
  });
}

export default boot(({ app }) => {
  const locale: Locale = getValidLocale();

  const i18n = createI18n({ locale });

  // Set i18n instance on app
  app.use(i18n);

  loadLocale(i18n, locale);
});
