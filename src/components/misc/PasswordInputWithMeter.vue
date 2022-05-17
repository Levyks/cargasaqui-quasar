<template>
  <div>
    <PasswordInput
      :name="name"
      :label="label"
      :hint="hint"
      :modelValue="password"
      @update:modelValue="emit('update:modelValue', $event as string)"
      :allowShowPassword="allowShowPassword"
      :rules="[createPasswordStrengthRule($t, minStrength)]"
      :required="required"
    />
    <PasswordStrengthMeter
      v-if="alwaysShowMeter || password"
      :password="password"
    />
  </div>
</template>

<script setup lang="ts">
import { createPasswordStrengthRule } from 'services/validation';

import PasswordInput from './PasswordInput.vue';
import PasswordStrengthMeter from './PasswordStrengthMeter.vue';

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
