import {
  CollectionReference,
  doc,
  FirestoreError,
  onSnapshot,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { Cargo, CargoPrivate } from 'models';
import { db } from 'services/firebase/db';
import { computed, onUnmounted, ref, watch } from 'vue';

export function useFirestoreCollection<T>(
  collection: CollectionReference<T>,
  constraints: QueryConstraint[] = []
) {
  const docs = ref<QueryDocumentSnapshot<T>[] | undefined>();
  const loading = computed(() => !docs.value);
  const error = ref<FirestoreError | undefined>();

  const unsub = onSnapshot(
    query(collection, ...constraints),
    (snap) => (docs.value = snap.docs),
    (e) => (error.value = e)
  );

  onUnmounted(unsub);

  return { docs, loading, error };
}

export function useCargoPrivate(cargo: QueryDocumentSnapshot<Cargo>) {
  const snap = ref<QueryDocumentSnapshot<CargoPrivate> | undefined>();
  const data = computed(() => snap.value?.data());
  const loading = computed(() => !data.value);
  const error = ref<FirestoreError | undefined>();

  let unsub: Unsubscribe | undefined;
  let idSubscribed: string | undefined;

  watch(
    () => cargo.id,
    (id) => {
      if (id === idSubscribed) return;

      idSubscribed = id;
      if (unsub) unsub();

      unsub = onSnapshot(
        doc(db.cargoPrivate(cargo.ref), 'extra'),
        (s) => (snap.value = s.exists() ? s : undefined),
        (e) => (error.value = e)
      );
    },
    {
      immediate: true,
    }
  );

  return { snap, data, loading, error };
}
