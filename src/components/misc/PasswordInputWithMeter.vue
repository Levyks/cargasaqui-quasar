<template>
  <div>
    <password-input
      :name="name"
      :label="label"
      :hint="hint"
      :modelValue="password"
      @update:modelValue="emit('update:modelValue', $event as string)"
      :allowShowPassword="allowShowPassword"
      :rules="[createPasswordStrengthRule(t, minStrength)]"
      :required="required"
    />
    <password-strength-meter
      v-if="alwaysShowMeter || password"
      :password="password"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { createPasswordStrengthRule } from 'src/services/validation';

import PasswordInput from './PasswordInput.vue';
import PasswordStrengthMeter from './PasswordStrengthMeter.vue';

const { t } = useI18n();

const {
  label,
  hint,
  name = 'password',
  allowShowPassword = true,
  required = false,
  minStrength = 1,
  alwaysShowMeter = false,
  modelValue: password,
} = defineProps<{
  allowShowPassword?: boolean;
  label?: string;
  name?: string;
  hint?: string;
  modelValue: string | null;
  required?: boolean;
  minStrength?: number;
  alwaysShowMeter?: boolean;
}>();

const emit = defineEmits(['update:modelValue']);
</script>
