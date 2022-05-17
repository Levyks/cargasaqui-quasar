import { TimestampedModel } from '.';

export default interface Status extends TimestampedModel {
  name: string;
  rowClass?: string;
  qRowClass?: string;
}
