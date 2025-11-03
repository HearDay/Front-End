export interface SignUpRequest {
  nickname: string;
  password: string;
  email: string;
  phone: string;
  // 회원가입 단계에서는 userCategory를 포함하지 않음
}

export interface SignUpResponse {
  success: boolean;
  message?: string;
  data?: {
    accessToken?: string;
  };
  errorCode?: string;
}
