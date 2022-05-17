<template>
  <q-page class="column items-center">
    <h3>Companies</h3>
    <q-list v-if="companies" bordered>
      <CompanyListItem
        v-for="company in companies"
        :key="company.id"
        :company="company"
      />
    </q-list>
    <div v-else class="q-space column justify-center items-center">
      <q-spinner color="primary" size="12rem" :thickness="2" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { db } from 'services/firebase/db';

import CompanyListItem from 'components/companies/CompanyListItem.vue';
import { useFirestoreCollection } from 'composables/firebase';

const { docs: companies } = useFirestoreCollection(db.companies);
</script>
