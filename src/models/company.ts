import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import type { DocumentReference } from 'firebase/firestore';
import { TimestampedModel } from '.';

export default interface Company extends TimestampedModel {
  name: string;
  public_statuses: DocumentReference[];
}

export function fetchLogoSrc(companyId: string): Promise<string> {
  const storage = getStorage();
  const logoRef = ref(storage, `companies/${companyId}/logo.png`);
  return getDownloadURL(logoRef);
}
