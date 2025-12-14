export interface ProfileInfo {
  nickname: string;
  gender: "M" | "F";
  age: number;
  phone: string;
  email: string;
}

export interface GetProfileInfoResponse {
  success: boolean;
  message: string;
  data: ProfileInfo;
  errorCode?: string;
}
