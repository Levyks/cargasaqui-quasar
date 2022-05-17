import { boot } from 'quasar/wrappers';
import { createI18n, I18n, Locale } from 'vue-i18n';
import { Quasar, Loading } from 'quasar';

import locales from 'src/locales';

const quasarLangs = import.meta.glob('../../node_modules/quasar/lang/*.mjs');

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
  Loading.show();

  return locales[locale]().then((module) => {
    i18n.global.setLocaleMessage(locale, module.default);

    Loading.hide();
  });
}

function setQuasarLang(locale: Locale) {
  const path = `../../node_modules/quasar/lang/${locale}.mjs`;
  if (!quasarLangs[path]) return;

  const importLang = quasarLangs[path];

  return importLang().then((module) => {
    Quasar.lang.set(module.default);
  });
}

export default boot(({ app }) => {
  const locale: Locale = getValidLocale();

  const i18n = createI18n({ locale });

  // Set i18n instance on app
  app.use(i18n);

  loadLocale(i18n, locale);
  setQuasarLang(locale);
});
