/*
// API 기본 설정
export const API_CONFIG = {
  BASE_URL: 'http://hearday-backend-env.eba-cz9gkqcp.ap-northeast-2.elasticbeanstalk.com',
  TIMEOUT: 10000, // 10초
  HEADERS: {
    'Content-Type': 'application/json',
  },
}
*/
// 환경 변수에서 직접 API URL을 가져옵니다.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL
export const API_TIMEOUT = 10000
export const API_HEADERS = {
  'Content-Type': 'application/json',
}


// 스토리지 키
export const STORAGE_KEYS = {
  ACCESS_TOKEN: '@hearday_access_token',
  REFRESH_TOKEN: '@hearday_refresh_token',
  USER_INFO: '@hearday_user_info',
  SELECTED_CATEGORIES: '@hearday_selected_categories',
}

// 앱 설정
export const APP_CONFIG = {
  MAX_RETRY_COUNT: 3,
  RETRY_DELAY: 1000, // 1초
}