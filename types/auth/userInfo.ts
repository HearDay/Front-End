export interface UserInfo {
  success: boolean;
  message: string;
  data: {
    level: number;
    nickname: string;
    updateTime: string;
  };
  errorCode?: string;
}
