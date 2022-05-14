<template>
  <q-input
    :modelValue="password"
    @update:modelValue="emit('update:modelValue', $event as string)"
    :name="name"
    :label="label || t('login.fields.password.label')"
    :type="showPassword ? 'text' : 'password'"
    :hint="hint"
    lazy-rules
    :rules="rulesComputed"
  >
    <template v-slot:prepend>
      <q-icon name="lock" />
    </template>
    <template v-if="allowShowPassword" v-slot:append>
      <q-icon
        :name="showPassword ? 'visibility_off' : 'visibility'"
        @click="showPassword = !showPassword"
        class="cursor-pointer"
      />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ValidationRule } from 'quasar';
import { createDefaultRequiredRule } from 'src/services/validation';
import { computed } from 'vue';

const { t } = useI18n();

const {
  label,
  hint,
  rules,
  name = 'password',
  allowShowPassword = true,
  required = false,
  modelValue: password,
} = defineProps<{
  allowShowPassword?: boolean;
  label?: string;
  name?: string;
  hint?: string;
  modelValue: string | null;
  rules?: ValidationRule[];
  required?: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

let showPassword = $ref(false);

const rulesComputed = computed(() => {
  if (!required && !password) return [];

  const rulesArray = [createDefaultRequiredRule(t)];
  if (rules?.length) return rulesArray.concat(rules);
  return rulesArray;
});
</script>
