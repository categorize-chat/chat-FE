export type TApiResponse<T> = {
  isSuccess: boolean;
  code: number;
  message: string;
  result: T;
};
