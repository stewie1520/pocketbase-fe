export type Paginated<T> = {
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  items: T[];
}
