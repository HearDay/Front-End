export interface KakaoLoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
  };
  errorCode?: string;
}
