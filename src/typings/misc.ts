import { Unsubscribe } from 'firebase/firestore';

export type Lazy<T> = () => Promise<T>;

export type Pagination = {
  page?: number;
  rowsPerPage?: number;
  rowsNumber?: number;
  sortBy?: string;
  descending?: boolean;
};

export type TableColumnProps = {
  name: string;
  label: string;
  align: 'left' | 'right' | 'center';
  __iconClass: string;
  __thClass: string;
  value: string | number;
};

export type TableBodySlotProps<T> = {
  key: string;
  row: T;
  rowIndex: number;
  pageIndex: number;
  cols: TableColumnProps[];
  colsMap: Record<string, TableColumnProps>;
  sort: (col: TableColumnProps) => void;
  selected: boolean;
  expand: boolean;
  color: string;
  dark: boolean;
  dense: boolean;
  __trClass: string;
};

export type Page<T> = {
  number: number;
  items: T[] | null;
  unsub: Unsubscribe;
};
