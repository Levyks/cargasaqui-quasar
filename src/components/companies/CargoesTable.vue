<template>
  <q-table
    :title="$t('cargoes.title')"
    class="q-ma-md q-space"
    :wrapCells="true"
    row-key="id"
    :columns="columns"
    :rows="rows || []"
    :loading="!rows"
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
import {
  onSnapshot,
  orderBy,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  where,
} from '@firebase/firestore';
import { useI18n } from 'vue-i18n';

import { db } from 'services/firebase/db';
import { useCompanyStore } from 'stores/company';
import { Cargo } from 'models';
import { useColumns, useVirtualScrollPagination } from 'composables';
import { onUnmounted } from 'vue';
import TableSearch from '../misc/TableSearch.vue';

const { t } = useI18n();
const companyStore = useCompanyStore();

const constraints: QueryConstraint[] = [
  where('status', 'in', companyStore.companyData!.public_statuses),
  orderBy('route'),
];

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

let rows = $ref<QueryDocumentSnapshot<Cargo>[] | null>(null);

const unsub = onSnapshot(
  query(db.companyCargoes(companyStore.company!.id), ...constraints),
  (snap) => {
    rows = snap.docs;
  }
);

onUnmounted(unsub);
</script>
