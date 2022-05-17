import { DocumentReference } from 'firebase/firestore';

export interface FirestoreDoc<T> {
  id: string;
  data: T;
  ref: DocumentReference<T>;
}
