export interface AIVoiceResponseData {
  reply: string;
  discussionId: number;
}

export interface AIVoiceResponse {
  success: boolean;
  message: string;
  data: AIVoiceResponseData;
  errorCode?: string;
}
