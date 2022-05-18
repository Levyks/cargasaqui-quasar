<template>
  <q-dialog
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event as boolean)"
  >
    <LoadingCard v-if="!statusesMap || !statesMap" />
    <q-card v-else style="width: 800px; max-width: 100%">
      <q-form ref="form" @submit="onSubmit">
        <q-card-section>
          <div class="text-h6">
            {{
              cargo
                ? $t('cargoes.modal.editTitle')
                : $t('cargoes.modal.createTitle')
            }}
          </div>
        </q-card-section>

        <q-card-section class="row">
          <div class="col q-mx-md">
            <q-input
              v-model="route"
              :label="$t('cargoes.columns.route')"
              type="textarea"
              class="q-mb-sm"
              :disable="loadingSubmit"
              lazy-rules
              :rules="[createDefaultRequiredRule($t)]"
            />
            <q-select
              class="q-mb-sm"
              :model-value="
                stateId && statesMap ? statesMap[stateId] : undefined
              "
              @update:modelValue="stateId = $event"
              :options="states"
              :label="$t('cargoes.columns.state')"
              option-value="id"
              :option-label="getStateSelectLabel"
              :disable="loadingSubmit"
              lazy-rules
              :rules="[createDefaultRequiredRule($t)]"
              emit-value
            />
            <q-select
              class="q-mb-sm"
              :model-value="
                statusId && statusesMap ? statusesMap[statusId] : undefined
              "
              @update:modelValue="statusId = $event"
              :options="statuses"
              :label="$t('cargoes.columns.status')"
              option-value="id"
              :option-label="getStatusSelectLabel"
              :disable="loadingSubmit"
              lazy-rules
              :rules="[createDefaultRequiredRule($t)]"
              emit-value
            />
            <q-input
              v-model="numberOfDeliveries"
              :label="$t('cargoes.columns.numberOfDeliveries')"
              type="number"
              min="0"
              class="q-mb-sm"
              lazy-rules
              :rules="[createDefaultRequiredRule($t)]"
              :disable="loadingSubmit"
            />
            <q-input
              v-model="weightInKg"
              :label="$t('cargoes.columns.weightInKg')"
              type="number"
              min="0"
              class="q-mb-sm"
              lazy-rules
              :rules="[createDefaultRequiredRule($t)]"
              :disable="loadingSubmit"
            />
          </div>
          <div class="col q-mx-md">
            <q-input
              v-model="payment"
              :label="$t('cargoes.columns.payment')"
              type="number"
              min="0"
              class="q-mb-sm"
              lazy-rules
              :rules="[createDefaultRequiredRule($t)]"
              :disable="loadingSubmit"
            />
            <q-input
              v-model="advancePayment"
              :label="$t('cargoes.columns.advancePayment')"
              type="number"
              min="0"
              class="q-mb-sm"
              lazy-rules
              :rules="[createDefaultRequiredRule($t)]"
              :disable="loadingSubmit"
            />
            <q-input
              v-model="driverName"
              :label="$t('cargoes.columns.driverName')"
              type="text"
              class="q-mb-sm"
              :disable="loadingSubmit"
            />
            <q-input
              v-model="driverPhone"
              :label="$t('cargoes.columns.driverPhone')"
              type="text"
              mask="(##) #####-####"
              class="q-mb-sm"
              :disable="loadingSubmit"
            />
            <q-input
              v-model="note"
              :label="$t('cargoes.columns.note')"
              type="textarea"
              class="q-mb-sm"
              :disable="loadingSubmit"
            />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            :label="$t('misc.cancel')"
            class="text-red"
            :disable="loadingSubmit"
            v-close-popup
          />
          <q-btn
            type="submit"
            :label="cargo ? $t('misc.edit') : $t('misc.create')"
            color="primary"
            :disable="loadingSubmit"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {
  addDoc,
  doc,
  QueryDocumentSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from '@firebase/firestore';
import { storeToRefs } from 'pinia';
import { Loading, QForm } from 'quasar';
import { watch } from 'vue';

import { Cargo, CargoPrivate, State, Status } from 'models';
import { useCompanyStore } from 'stores/company';
import { useStatesStore } from 'stores/states';
import { createDefaultRequiredRule } from 'services/validation';

import LoadingCard from 'components/misc/LoadingCard.vue';
import { db } from 'services/firebase/db';
import { useFeedback } from 'composables';

const { modelValue, cargo, cargoPrivate } = defineProps<{
  modelValue: boolean;
  cargo?: QueryDocumentSnapshot<Cargo>;
  cargoPrivate?: QueryDocumentSnapshot<CargoPrivate>;
}>();

const emit = defineEmits(['update:modelValue']);

const { handleFirebaseError } = useFeedback();

const companyStore = useCompanyStore();
const statesStore = useStatesStore();
const { statuses, statusesMap } = storeToRefs(companyStore);
const { states, statesMap } = storeToRefs(statesStore);

companyStore.ensureStatusAreSubscribed();
statesStore.ensureStatesAreSubscribed();

let form = $ref<QForm | null>(null);

let loadingSubmit = $ref<boolean>(false);

let route = $ref<string | undefined>();
let stateId = $ref<string | undefined>();
let statusId = $ref<string | undefined>();
let numberOfDeliveries = $ref<string | undefined>();
let weightInKg = $ref<string | undefined>();
let payment = $ref<string | undefined>();
let advancePayment = $ref<string | undefined>();
let driverName = $ref<string | undefined>();
let driverPhone = $ref<string | undefined>();
let note = $ref<string | undefined>();

function resetPublicFields() {
  route = undefined;
  stateId = undefined;
  statusId = undefined;
  numberOfDeliveries = undefined;
  weightInKg = undefined;
}

function resetPrivateFields() {
  payment = undefined;
  advancePayment = undefined;
  driverName = undefined;
  driverPhone = undefined;
  note = undefined;
}

function resetAllFields() {
  resetPublicFields();
  resetPrivateFields();
}

function getStateSelectLabel(state: QueryDocumentSnapshot<State>) {
  return state.data().name;
}

function getStatusSelectLabel(status: QueryDocumentSnapshot<Status>) {
  return status.data().name;
}

watch(
  [$$(modelValue), $$(cargo)],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ([_, c]) => {
    if (!c) return resetPublicFields();
    const data = c.data();
    route = data.route;
    stateId = data.state.id;
    statusId = data.status.id;
    numberOfDeliveries = data.numberOfDeliveries.toString();
    weightInKg = data.weightInKg.toString();
  },
  { immediate: true }
);

watch(
  [$$(modelValue), $$(cargoPrivate)],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ([_, cp]) => {
    if (!cp) return resetPrivateFields();
    const data = cp.data();
    payment = data.payment.toString();
    advancePayment = data.advancePayment.toString();
    driverName = data.driverName;
    driverPhone = data.driverPhone;
    note = data.note;
  },
  { immediate: true }
);

async function onSubmit() {
  if (!statesStore.statesMap || !companyStore.statusesMap) return;

  loadingSubmit = true;
  Loading.show();

  const stateRef = statesStore.statesMap[stateId!].ref;
  const statusRef = companyStore.statusesMap[statusId!].ref;

  const cargoDocData = {
    route: route as string,
    numberOfDeliveries: Number(numberOfDeliveries),
    weightInKg: Number(weightInKg),
    state: stateRef,
    status: statusRef,
  };

  const cargoPrivateDocData = {
    payment: Number(payment),
    advancePayment: Number(advancePayment),
    driverName: (driverName as string) || '',
    driverPhone: (driverPhone as string) || '',
    note: (note as string) || '',
  };

  const cargoPromise = cargo
    ? updateDoc(cargo.ref, {
        ...cargoDocData,
        updatedAt: serverTimestamp(),
      }).then(() => cargo.ref)
    : addDoc(db.companyCargoes(companyStore.company!.id), {
        ...cargoDocData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

  cargoPromise
    .then((cargoRef) => {
      return cargoPrivate
        ? updateDoc(cargoPrivate.ref, {
            ...cargoPrivateDocData,
            updatedAt: serverTimestamp(),
          })
        : setDoc(doc(db.cargoPrivate(cargoRef), 'extra'), {
            ...cargoPrivateDocData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
    })
    .then(() => emit('update:modelValue', false))
    .catch(handleFirebaseError)
    .finally(() => {
      resetAllFields();
      loadingSubmit = false;
      Loading.hide();
    });
}
</script>
