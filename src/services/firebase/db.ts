import {
  collection,
  DocumentReference,
  getFirestore,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { Cargo, CargoPrivate, Company, State, Status } from 'models';

const firestore = getFirestore();

export const db = {
  companies: dataPoint<Company>('companies'),
  states: dataPoint<State>('states'),
  companyStatuses: (companyId: string) =>
    dataPoint<Status>(`companies/${companyId}/statuses`),
  companyCargoes: (companyId: string) =>
    dataPoint<Cargo>(`companies/${companyId}/cargoes`),
  cargoPrivate: (cargoRef: DocumentReference<Cargo>) =>
    dataPoint<CargoPrivate>(`${cargoRef.path}/private`),
};

function converter<T>() {
  return {
    toFirestore: (data: T) => data,
    fromFirestore: (snap: QueryDocumentSnapshot<T>) => snap.data(),
  };
}

function dataPoint<T>(collectionPath: string) {
  return collection(firestore, collectionPath).withConverter(converter<T>());
}
