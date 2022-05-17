<template>
  <q-img
    width="100%"
    :src="logo"
    :alt="$t('companies.logoAlt', [company.data().name])"
  />
</template>

<script setup lang="ts">
import { QueryDocumentSnapshot } from '@firebase/firestore';
import { Company } from 'models';
import { useLogosStore } from 'stores/logos';
import { watch } from 'vue';

const logosStore = useLogosStore();

const { company } = defineProps<{ company: QueryDocumentSnapshot<Company> }>();

let logo = $ref<string | undefined>();

watch(
  company,
  async () => {
    logo = await logosStore.getLogo(company.id);
  },
  {
    immediate: true,
  }
);
</script>
