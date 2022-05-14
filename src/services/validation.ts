import { ValidationRule } from 'quasar';
import { Composer } from 'vue-i18n';

export function createDefaultRequiredRule(t: Composer['t']): ValidationRule {
  return (val: string) =>
    (val && val.length > 0) || t('validation.defaultRequired');
}

export function createEmailRule(t: Composer['t']): ValidationRule {
  const regex =
    /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
  return (val: string) => regex.test(val) || t('validation.email');
}

export function createPasswordConfirmationRule(
  t: Composer['t'],
  password: string | null
): ValidationRule {
  return (val: string) =>
    val === password || t('validation.passwordConfirmation');
}
