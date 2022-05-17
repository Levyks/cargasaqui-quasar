import { defineStore } from 'pinia';
import {
  onSnapshot,
  QueryDocumentSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { Company, Status } from 'models';
import { db } from 'services/firebase/db';
import { useLogosStore } from './logos';

export type CompanyStoreState = {
  company: QueryDocumentSnapshot<Company> | null;
  statusesMap: Record<string, QueryDocumentSnapshot<Status>> | undefined;
  statusesUnsub: Unsubscribe | null;
};

export const useCompanyStore = defineStore('company', {
  state: () =>
    ({
      company: null,
      statusesMap: undefined,
      statusesUnsub: null,
    } as CompanyStoreState),
  getters: {
    companyData: (state) => {
      if (!state.company) return null;
      return state.company.data();
    },
    statuses: (state) => {
      if (!state.statusesMap) return undefined;
      return Object.values(state.statusesMap);
    },
  },
  actions: {
    setCompany(company: QueryDocumentSnapshot<Company> | null) {
      if (this.company?.id === company?.id) {
        this.company = company;
        return;
      }

      this.company = company;
      this.statusesMap = undefined;

      if (this.statusesUnsub) {
        this.statusesUnsub();
        this.statusesUnsub = null;
      }
    },
    async getCurrentCompanyLogo(): Promise<string | null> {
      if (!this.company) return null;
      const logosStore = useLogosStore();
      return logosStore.getLogo(this.company.id);
    },
    ensureStatusAreSubscribed() {
      if (this.statusesUnsub) return;
      if (!this.company) return;

      this.statusesUnsub = onSnapshot(
        db.companyStatuses(this.company.id),
        (snap) => {
          this.statusesMap = snap.docs.reduce((acc, doc) => {
            acc[doc.id] = doc;
            return acc;
          }, {} as Record<string, QueryDocumentSnapshot<Status>>);
        }
      );
    },
  },
});
