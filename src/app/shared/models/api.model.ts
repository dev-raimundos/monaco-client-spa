export interface LaravelResponse<T = any> {
  error: boolean;
  message: string;
  data: T;
}
