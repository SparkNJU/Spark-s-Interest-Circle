/**
 * @description User-Service parameters
 */
export interface IUserOptions {
  uid: number;
}

export interface IGetUserResponse {
  success: boolean;
  message: string;
  data?: any;
}