import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
} from '@/services/utils/tokenStorage'
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios'

// API 기본 설정
const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL
if (!BASE_URL) {
  throw new Error('EXPO_PUBLIC_API_BASE_URL이 .env 파일에 정의되지 않았습니다!')
}
const TIMEOUT = 10000

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터: accessToken을 Authorization 헤더에 추가
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getAccessToken()
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.error('토큰 가져오기 실패:', error)
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 응답 인터셉터: accessToken 만료 시 refreshToken으로 재발급
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest
    ) {
      originalRequest._retry = true

      try {
        const refreshToken = await getRefreshToken()
        if (!refreshToken) {
          throw new Error('No refresh token')
        }

        const response = await axios.post(
          `${BASE_URL}/api/auth/refresh`,
          { refreshToken }
        )

        const { accessToken } = response.data

        // 재발급된 accessToken 저장
        await saveAccessToken(accessToken)

        // 실패했던 요청에 새 토큰 적용 후 재요청
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }

        return apiClient(originalRequest)
      } catch (refreshError) {
        // 토큰 갱신 실패 시 모든 토큰 제거
        await clearTokens()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
