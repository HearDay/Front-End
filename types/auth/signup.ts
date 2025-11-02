export interface SignUpRequest {
  loginId: string;
  password: string;
  email: string;
  phone: string;
  userCategory: string[];
}

export interface SignUpResponse {
  success: boolean;
  message: string;
  data?: {
    accessToken: string;
  };
  errorCode?: string;
}
