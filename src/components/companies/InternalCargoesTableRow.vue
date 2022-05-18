<template>
  <q-tr :class="getColorClass(props.row)" :title="`ID: ${props.row.id}`">
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
          @click="handleDelete"
          :disabled="loadingPrivate"
        />
      </q-td>

      <q-td v-else-if="col.name.startsWith('p.')" :class="col.__thClass">
        <q-spinner v-if="loadingPrivate" />
        <q-icon
          v-else-if="!privateSnap"
          name="error"
          color="red"
          size="1.5rem"
        />
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
import { deleteDoc, QueryDocumentSnapshot } from '@firebase/firestore';
import { useCompanyStore } from 'stores/company';
import { useCargoPrivate } from 'composables/firebase';
import CreateOrEditCargoModal from './CreateOrEditCargoModal.vue';
import { Loading, useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useFeedback } from 'src/composables';

const { props } = defineProps<{
  props: TableBodySlotProps<QueryDocumentSnapshot<Cargo>>;
}>();

const companyStore = useCompanyStore();
const $q = useQuasar();
const { t } = useI18n();
const { handleFirebaseError } = useFeedback();

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

function handleDelete() {
  $q.dialog({
    title: t('cargoes.delete.title'),
    message: t('cargoes.delete.message', [props.row.data().route]),
    ok: t('misc.delete'),
    cancel: t('misc.cancel'),
  }).onOk(() => {
    Loading.show();
    const promises = [deleteDoc(props.row.ref)];
    if (privateSnap.value) promises.push(deleteDoc(privateSnap.value.ref));
    Promise.all(promises)
      .catch(handleFirebaseError)
      .finally(() => {
        Loading.hide();
      });
  });
}

let modalOpen = $ref<boolean>(false);
</script>
