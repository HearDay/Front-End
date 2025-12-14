import { STORAGE_KEYS } from "@/constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = {

  async setUserInfo(userInfo: object): Promise<void> {
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_INFO,
      JSON.stringify(userInfo)
    );
  },

  async getUserInfo<T>(): Promise<T | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_INFO);
    return data ? JSON.parse(data) : null;
  },

  async clearUserInfo(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_INFO);
  },

  async setSelectedCategories(categories: string[]): Promise<void> {
    await AsyncStorage.setItem(
      STORAGE_KEYS.SELECTED_CATEGORIES,
      JSON.stringify(categories)
    );
  },

  async getSelectedCategories(): Promise<string[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_CATEGORIES);
    return data ? JSON.parse(data) : [];
  },


  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_INFO,
      STORAGE_KEYS.SELECTED_CATEGORIES,
    ]);
  },
};
