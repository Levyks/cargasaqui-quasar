import { DocumentReference, getFirestore, QueryDocumentSnapshot } from "firebase-admin/firestore";
import app from "./app";

import type { FirebaseModel, Company, Cargo, CargoPrivate, Status, State } from "./typings";

export const firestore = getFirestore(app);

export const db = {
    companies: dataPoint<Company>("companies"),
    states: dataPoint<State>("states"),
    companyCargoes: (company: Company) => dataPoint<Cargo>(`companies/${company.id}/cargoes`),
    cargoPrivateFromRef: (cargoRef: DocumentReference) => dataPoint<CargoPrivate>(`${cargoRef.path}/private`),
    companyStatuses: (company: Company) => dataPoint<Status>(`companies/${company.id}/statuses`),
    companyIdStatuses: (companyId: string) => dataPoint<Status>(`companies/${companyId}/statuses`),
}

function converter<T extends FirebaseModel>() {
    return {
        toFirestore: (data: T) => data,
        fromFirestore: (snap: QueryDocumentSnapshot) =>
            ({
                ...(snap.data()),
                id: snap.id,
                snap, ref: snap.ref
            }) as T
    };     
}

function dataPoint<T extends FirebaseModel>(collectionPath: string) {
    return firestore.collection(collectionPath).withConverter(converter<T>());
}
    