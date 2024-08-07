interface IPagination {
  page: number;
  totalPages: number;
  total: number;
  nextPage: number | null;
  prevPage: number | null;
  message: string;
}
