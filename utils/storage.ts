import { STORAGE_KEYS } from '@/constants/config'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const storage = {
  // 토큰 관리
  async setAccessToken(token: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
  },

  async getAccessToken(): Promise<string | null> {
    return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  },

  async setRefreshToken(token: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token)
  },

  async getRefreshToken(): Promise<string | null> {
    return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
  },

  async clearTokens(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
    ])
  },

  // 사용자 정보 관리
  async setUserInfo(userInfo: object): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo))
  },

  async getUserInfo<T>(): Promise<T | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_INFO)
    return data ? JSON.parse(data) : null
  },

  async clearUserInfo(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_INFO)
  },

  // 선택된 카테고리 관리
  async setSelectedCategories(categories: string[]): Promise<void> {
    await AsyncStorage.setItem(
      STORAGE_KEYS.SELECTED_CATEGORIES,
      JSON.stringify(categories)
    )
  },

  async getSelectedCategories(): Promise<string[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_CATEGORIES)
    return data ? JSON.parse(data) : []
  },

  // 전체 삭제
  async clearAll(): Promise<void> {
    await AsyncStorage.clear()
  },
}