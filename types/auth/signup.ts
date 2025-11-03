export interface SignUpRequest {
  nickname: string;
  password: string;
  email: string;
  phone: string;
}

export interface SignUpResponse {
  success: boolean;
  message?: string;
  data?: {
    accessToken?: string;
  };
  errorCode?: string;
}
