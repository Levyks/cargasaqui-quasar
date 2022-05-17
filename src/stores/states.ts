import {
  onSnapshot,
  QueryDocumentSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

import { State } from 'models';
import { db } from 'services/firebase/db';

export const useStatesStore = defineStore('states', () => {
  type StatesMap = Record<string, QueryDocumentSnapshot<State>>;

  const statesMap = ref<StatesMap | undefined>();

  const states = computed(() =>
    statesMap.value ? Object.values(statesMap.value) : undefined
  );

  let unsub: Unsubscribe | undefined;

  function ensureStatesAreSubscribed() {
    if (unsub) return;
    unsub = onSnapshot(db.states, (snap) => {
      statesMap.value = snap.docs.reduce((acc, doc) => {
        acc[doc.id] = doc;
        return acc;
      }, {} as StatesMap);
    });
  }

  return { states, statesMap, ensureStatesAreSubscribed };
});
