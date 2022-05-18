import { ValidationRule } from 'quasar';
import { Composer } from 'vue-i18n';
import {
  passwordStrength,
  defaultOptions,
  Options,
  Result,
} from 'check-password-strength';

export function createDefaultRequiredRule(t: Composer['t']): ValidationRule {
  return (val: string) => (val ? true : t('validation.defaultRequired'));
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

/** <Password Strength> */
const options: Options<string> = [
  {
    minDiversity: 0,
    minLength: 0,
  },
  {
    minDiversity: 2,
    minLength: 6,
  },
  {
    minDiversity: 3,
    minLength: 8,
  },
  {
    minDiversity: 4,
    minLength: 10,
  },
].map((option, idx) => ({
  ...defaultOptions[idx],
  ...option,
})) as Options<string>;

export type PasswordStrength = Result<string>;
export function getPasswordStrength(password: string): PasswordStrength {
  return passwordStrength(password, options);
}

export function createPasswordStrengthRule(
  t: Composer['t'],
  minStrength = 1
): ValidationRule {
  return (val: string) => {
    const option = options[minStrength];
    const strength = getPasswordStrength(val);
    return (
      strength.id >= minStrength ||
      t('validation.passwordStrength.requires', [
        option.minLength,
        option.minDiversity,
      ])
    );
  };
}
/** </Password Strength> */
