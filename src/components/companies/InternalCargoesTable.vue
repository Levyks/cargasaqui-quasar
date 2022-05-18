<template>
  <div class="column full-width q-pa-md q-space">
    <q-table
      :title="$t('cargoes.title')"
      class="fit q-space"
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
        <div class="row items-center">
          <TableSearch v-model="filter" />
          <q-btn
            :title="$t('misc.create')"
            rounded
            color="primary"
            class="q-mx-md"
            icon="add"
            @click="modalOpen = true"
          />
        </div>
      </template>
      <template v-slot:body="props">
        <InternalCargoesTableRow :props="props" />
      </template>
    </q-table>
    <CreateOrEditCargoModal v-model="modalOpen" />
  </div>
</template>

<script setup lang="ts">
import { orderBy } from '@firebase/firestore';
import { useI18n } from 'vue-i18n';

import { db } from 'services/firebase/db';
import { useCompanyStore } from 'stores/company';
import { Cargo } from 'models';
import { useColumns, useVirtualScrollPagination } from 'composables';
import { useFirestoreCollection } from 'composables/firebase';

import TableSearch from 'components/misc/TableSearch.vue';
import InternalCargoesTableRow from './InternalCargoesTableRow.vue';
import CreateOrEditCargoModal from './CreateOrEditCargoModal.vue';

const { t } = useI18n();
const companyStore = useCompanyStore();

companyStore.ensureStatusAreSubscribed();

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
    field: (snap) => `${snap.data().weightInKg.toLocaleString()} kg`,
    label: t('cargoes.columns.weightInKg'),
  },
  {
    name: 'p.payment',
    field: () => '',
    label: t('cargoes.columns.payment'),
  },
  {
    name: 'p.advancePayment',
    field: () => '',
    label: t('cargoes.columns.advancePayment'),
  },
  {
    name: 'p.status',
    field: () => '',
    label: t('cargoes.columns.status'),
  },
  {
    name: 'p.driverName',
    field: () => '',
    label: t('cargoes.columns.driverName'),
  },
  {
    name: 'p.driverPhone',
    field: () => '',
    label: t('cargoes.columns.driverPhone'),
  },
  {
    name: 'p.note',
    field: () => '',
    label: t('cargoes.columns.note'),
  },
  {
    name: 'actions',
    field: () => '',
    label: '',
  },
]);

const pagination = useVirtualScrollPagination();
const filter = $ref('');

const { docs, loading } = useFirestoreCollection(
  db.companyCargoes(companyStore.company!.id),
  [orderBy('route')]
);

let modalOpen = $ref<boolean>(false);
</script>
