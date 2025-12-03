import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_Y = "scrollY:";
const KEY_X = "scrollX:";
const KEY_CAT = "selectedCategory:";

// 세로 스크롤 저장
export const saveScrollY = async (path: string, value: number) => {
  await AsyncStorage.setItem(KEY_Y + path, JSON.stringify(value));
};

export const getScrollY = async (path: string) => {
  const v = await AsyncStorage.getItem(KEY_Y + path);
  return v ? JSON.parse(v) : 0;
};

// 가로 스크롤 저장
export const saveScrollX = async (path: string, value: number) => {
  await AsyncStorage.setItem(KEY_X + path, JSON.stringify(value));
};

export const getScrollX = async (path: string) => {
  const v = await AsyncStorage.getItem(KEY_X + path);
  return v ? JSON.parse(v) : 0;
};

// 선택된 카테고리 저장
export const saveSelectedCategory = async (path: string, category: string) => {
  await AsyncStorage.setItem(KEY_CAT + path, category);
};

export const getSelectedCategory = async (path: string) => {
  const v = await AsyncStorage.getItem(KEY_CAT + path);
  return v ?? "전체";
};


export const resetScrollStorage = async () => {
  try {
    await AsyncStorage.multiRemove([
      KEY_Y,
      KEY_X,
      KEY_CAT
    ]);
  } catch (err) {
  }
};
