import { LocaleMessageDictionary, Composer, VueMessageType } from 'vue-i18n';
import { FirebaseError } from 'firebase/app';

export function getFirebaseErrorTranslationKey(
  i18n: Composer<unknown, unknown, unknown, VueMessageType>,
  error: FirebaseError
): string {
  const defaultKey = 'errors.unknown';

  const messages = i18n.getLocaleMessage(i18n.locale.value);

  const errorsMessages =
    messages.errors as LocaleMessageDictionary<VueMessageType>;

  const firebaseErrorMessages =
    errorsMessages.firebase as LocaleMessageDictionary<VueMessageType>;
  if (!firebaseErrorMessages) return defaultKey;

  if (firebaseErrorMessages[error.code]) {
    return `errors.firebase.${error.code}`;
  }

  console.warn(`Missing translation key for Firebase error: ${error.code}`);

  return defaultKey;
}
