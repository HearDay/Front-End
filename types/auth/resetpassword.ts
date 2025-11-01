export interface ResetPasswordRequest {
  email: string;
  password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  data?: Record<string, any>;
  errorCode?: string;
}
