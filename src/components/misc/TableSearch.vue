<template>
  <q-input
    dense
    :debounce="debounce"
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event as string)"
    :placeholder="$t('misc.search')"
  >
    <template v-slot:append>
      <q-icon name="search" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
const { modelValue, debounce = 300 } = defineProps<{
  modelValue: string;
  debounce?: number;
}>();

const emit = defineEmits(['update:modelValue']);
</script>
