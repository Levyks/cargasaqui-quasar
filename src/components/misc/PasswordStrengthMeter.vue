<template>
  <div class="q-mt-md">
    <span>{{ t('validation.passwordStrength.label') }}:</span>
    <strong :class="`text-${level.barColor} q-ml-xs`">{{ level.label }}</strong>
    <q-linear-progress
      :value="level.progress"
      :color="level.barColor"
      class="q-my-xs"
      stripe
      rounded
      size="15px"
    />
    <div class="contains-wrapper">
      <q-checkbox
        v-for="contain in contains"
        :key="contain.key"
        :model-value="realStrength.contains.includes(contain.key)"
        :label="contain.label"
        disable
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { DiversityType } from 'check-password-strength';
import { getPasswordStrength, PasswordStrength } from 'services/validation';

import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const { password, strength } = defineProps<{
  password?: string | null;
  strength?: PasswordStrength | null;
}>();

const realStrength = $computed(() => {
  if (strength) return strength;
  return getPasswordStrength(password || '');
});

const levels = $computed(() => [
  {
    label: t('validation.passwordStrength.levels.tooWeak'),
    progress: 0.1,
    barColor: 'red',
  },
  {
    label: t('validation.passwordStrength.levels.weak'),
    progress: 0.35,
    barColor: 'deep-orange',
  },
  {
    label: t('validation.passwordStrength.levels.medium'),
    progress: 0.7,
    barColor: 'amber',
  },
  {
    label: t('validation.passwordStrength.levels.strong'),
    progress: 1,
    barColor: 'green',
  },
]);

const level = $computed(() => levels[realStrength.id]);

const contains = $computed<
  {
    label: string;
    key: DiversityType;
  }[]
>(() => [
  {
    label: t('validation.passwordStrength.contains.lowercase'),
    key: 'lowercase',
  },
  {
    label: t('validation.passwordStrength.contains.uppercase'),
    key: 'uppercase',
  },
  {
    label: t('validation.passwordStrength.contains.number'),
    key: 'number',
  },
  {
    label: t('validation.passwordStrength.contains.symbol'),
    key: 'symbol',
  },
]);
</script>

<style scoped lang="scss">
.contains-wrapper {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  max-height: 80px;

  &:deep(.disabled),
  &:deep(.disabled *) {
    cursor: default !important;
  }
}
</style>
