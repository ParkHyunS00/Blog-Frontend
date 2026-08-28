export interface ApiError {
  code: string;
  message: string;
  description: string | null;
  detailErrors: unknown | null;
}

export interface StandardResponse<T> {
  status: number;
  data: T | null;
  error: ApiError | null;
}
