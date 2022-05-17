import { TimestampedModel } from '.';
import { DocumentReference, Timestamp } from 'firebase/firestore';

export default interface Cargo extends TimestampedModel {
  route: string;
  numberOfDeliveries: number;
  weightInKg: number;
  state: DocumentReference;
  status: DocumentReference;
}

export interface CargoPrivate extends TimestampedModel {
  payment: number;
  advancePayment: number;
  driverName: string;
  driverPhone: string;
  note: string;
  statusChanges?: CargoStatusChange[];
}

export interface CargoStatusChange {
  old: DocumentReference;
  new: DocumentReference;
  timestamp: Timestamp;
}
