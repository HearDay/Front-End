export interface RegisterInfoRequest {
  category: string[];
  gender: string;
  age: number;
  hour: number;
  minute: number;
  dayType: "WEEKDAY" | "EVERYDAY" | "WEEKEND";
}

export interface RegisterInfoResponse {
  success: boolean;
  message: string;
  data?: any;
  errorCode?: string;
}
