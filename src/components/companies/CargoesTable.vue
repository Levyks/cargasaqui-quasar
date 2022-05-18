<template>
  <q-table
    :title="$t('cargoes.title')"
    class="q-ma-md q-space"
    :wrapCells="true"
    row-key="id"
    :columns="columns"
    :rows="docs"
    :loading="loading"
    :filter="filter"
    v-model:pagination="pagination"
    :rows-per-page-options="[0]"
    virtual-scroll
  >
    <template v-slot:top-right>
      <TableSearch v-model="filter" />
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { orderBy, where } from '@firebase/firestore';
import { useI18n } from 'vue-i18n';

import { db } from 'services/firebase/db';
import { useCompanyStore } from 'stores/company';
import { Cargo } from 'models';
import { useColumns, useVirtualScrollPagination } from 'composables';
import TableSearch from '../misc/TableSearch.vue';
import { useFirestoreCollection } from 'src/composables/firebase';

const { t } = useI18n();
const companyStore = useCompanyStore();

const columns = useColumns<Cargo>(() => [
  {
    name: 'route',
    field: (snap) => snap.data().route,
    label: t('cargoes.columns.route'),
    align: 'left',
  },
  {
    name: 'state',
    field: (snap) => snap.data().state.id,
    label: t('cargoes.columns.state'),
  },
  {
    name: 'numberOfDeliveries',
    field: (snap) => snap.data().numberOfDeliveries,
    label: t('cargoes.columns.numberOfDeliveries'),
  },
  {
    name: 'weightInKg',
    field: (snap) => snap.data().weightInKg,
    label: t('cargoes.columns.weightInKg'),
  },
]);

const pagination = useVirtualScrollPagination();
const filter = $ref('');

const { docs, loading } = useFirestoreCollection(
  db.companyCargoes(companyStore.company!.id),
  [
    where('status', 'in', companyStore.companyData!.public_statuses),
    orderBy('route'),
  ]
);
</script>
