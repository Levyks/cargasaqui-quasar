import { Timestamp } from 'firebase/firestore';

export interface TimestampedModel {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type { default as Company } from './company';
export type { default as Cargo, CargoPrivate } from './cargo';
export type { default as Status } from './status';
export type { default as State } from './state';
