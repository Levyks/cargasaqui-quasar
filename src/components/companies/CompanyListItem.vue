<template>
  <q-item
    clickable
    class="items-center"
    :to="routes.company.getPath(company.id)"
    @click="handleClick"
  >
    <div class="img-wrapper">
      <CompanyLogo :company="company" />
    </div>
    <h4 class="q-my-sm q-ml-lg">{{ companyData.name }}</h4>
  </q-item>
</template>

<script setup lang="ts">
import { QueryDocumentSnapshot } from '@firebase/firestore';
import { Company } from 'models';
import { routes } from 'router/routes';
import { useCompanyStore } from 'stores/company';
import CompanyLogo from './CompanyLogo.vue';

const companyStore = useCompanyStore();

const { company } = defineProps<{ company: QueryDocumentSnapshot<Company> }>();
const companyData = $computed(() => company.data());

function handleClick() {
  companyStore.setCompany(company);
}
</script>

<style scoped lang="scss">
.img-wrapper {
  width: 200px;
  max-width: 40%;
}
</style>
