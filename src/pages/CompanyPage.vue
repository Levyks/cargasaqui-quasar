<template>
  <LoadingPage v-if="!loaded" />
  <q-page class="column items-stretch" v-else-if="company">
    <div class="logo-wrapper q-mx-auto q-my-md">
      <CompanyLogo :company="company" />
    </div>
    <InternalCargoesTable v-if="isAdminOrOperator" />
    <CargoesTable v-else />
  </q-page>
  <NotFoundPage v-else />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { defineAsyncComponent, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { doc, onSnapshot, Unsubscribe } from '@firebase/firestore';

import { useCompanyStore } from 'stores/company';
import { db } from 'services/firebase/db';
import { usePermissionsStore } from 'stores/permissions';

import CompanyLogo from 'components/companies/CompanyLogo.vue';
import NotFoundPage from './NotFoundPage.vue';
import LoadingPage from './LoadingPage.vue';

const CargoesTable = defineAsyncComponent(
  () => import('components/companies/CargoesTable.vue')
);
const InternalCargoesTable = defineAsyncComponent(
  () => import('components/companies/InternalCargoesTable.vue')
);

const route = useRoute();
const companyStore = useCompanyStore();
const { hasPermission } = usePermissionsStore();
const { company } = storeToRefs(companyStore);

const isAdminOrOperator = hasPermission(['admin', 'operator']);

let unsub: Unsubscribe | null = null;

let loaded = $ref<boolean>(false);

watch(
  () => route.params.companyId as string,
  (companyId) => {
    if (!companyId) return;

    if (unsub) unsub();

    if (companyStore.company?.id === companyId) {
      loaded = true;
    } else {
      loaded = false;
      companyStore.setCompany(null);
    }

    unsub = onSnapshot(doc(db.companies, companyId), (snap) => {
      if (snap.exists()) {
        companyStore.setCompany(snap);
      } else {
        companyStore.setCompany(null);
      }
      loaded = true;
    });
  },
  { immediate: true }
);

onUnmounted(() => {
  if (unsub) unsub();
});
</script>

<style scoped lang="scss">
.logo-wrapper {
  width: 200px;
  max-height: 40px;
}
</style>
