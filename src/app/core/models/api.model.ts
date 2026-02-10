export interface LaravelResponse<T> {
  error: boolean;
  message: string;
  data: T;
}
