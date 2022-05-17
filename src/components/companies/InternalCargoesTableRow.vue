<template>
  <q-tr :class="getColorClass(props.row)">
    <template v-for="col in props.cols" :key="col.name">
      <q-td v-if="col.name === 'actions'" :class="col.__thClass">
        <q-btn
          :title="$t('misc.edit')"
          flat
          icon="edit"
          @click="modalOpen = true"
          :disabled="loadingPrivate"
        />
        <q-btn
          color="red-7"
          :title="$t('misc.delete')"
          flat
          icon="delete"
          :disabled="loadingPrivate"
        />
      </q-td>

      <q-td v-if="col.name.startsWith('p.')" :class="col.__thClass">
        <q-spinner v-if="loadingPrivate" />
        <template v-else>{{ getPrivateFieldValue(col) }}</template>
      </q-td>

      <q-td v-else :class="col.__thClass">{{ col.value }}</q-td>
    </template>
  </q-tr>
  <CreateOrEditCargoModal
    v-model="modalOpen"
    :cargo="props.row"
    :cargo-private="privateSnap"
  />
</template>

<script setup lang="ts">
import { TableBodySlotProps, TableColumnProps } from 'typings/misc';
import { Cargo, CargoPrivate } from 'models';
import { QueryDocumentSnapshot } from '@firebase/firestore';
import { useCompanyStore } from 'stores/company';
import { useCargoPrivate } from 'composables/firebase';
import CreateOrEditCargoModal from './CreateOrEditCargoModal.vue';

const { props } = defineProps<{
  props: TableBodySlotProps<QueryDocumentSnapshot<Cargo>>;
}>();

const companyStore = useCompanyStore();

const {
  snap: privateSnap,
  data: privateData,
  loading: loadingPrivate,
} = useCargoPrivate(props.row);

function getPrivateFieldValue(col: TableColumnProps): string {
  const field = col.name.replace('p.', '');
  const value = privateData.value?.[field as keyof CargoPrivate] as
    | string
    | number;
  return value?.toLocaleString() || '';
}

const getColorClass = $computed(() => {
  return (cargo: QueryDocumentSnapshot<Cargo>) => {
    const data = cargo.data();
    const status = companyStore.statuses?.find((s) => s.id === data?.status.id);
    return status?.data()?.qRowClass || '';
  };
});

let modalOpen = $ref<boolean>(false);
</script>
