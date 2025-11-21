// 페이지별 스크롤 위치 저장소
const scrollStore: Record<string, number> = {};

/**
 * 스크롤 위치 저장
 * @param path 페이지 경로
 * @param y 스크롤 Y
 */
export const saveScrollY = (path: string, y: number) => {
  scrollStore[path] = y;
};

/**
 * 스크롤 위치 불러오기
 * @param path 페이지 경로
 * @returns 저장된 스크롤 Y (없으면 0)
 */
export const getScrollY = (path: string) => {
  return scrollStore[path] ?? 0;
};

/**
 * 스크롤 위치 삭제 (필요한 경우만)
 */
export const clearScrollY = (path: string) => {
  delete scrollStore[path];
};
