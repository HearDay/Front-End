export interface LoginRequest {
  LoginId: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    accessToken: string;
  };
  errorCode?: string;
}
