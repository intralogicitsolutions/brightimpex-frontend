export interface IResponse<T> {
  success: number;
  code: number;
  msg: string;
  body: T;
}
