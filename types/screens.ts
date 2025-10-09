// ========== 사전 관련 ==========

export interface WordDefinitionProps {
  word: string
  definitions: string[]  // 여러 개 뜻
}

// ========== 저장된 뉴스 관련 ==========

export interface SavedNewsItem {
  id: string
  title: string
  summary: string
  imageUrl: string
  category: string  // '전체', '경제', '기술', '환경', '사회' 등
  savedAt: string   // 저장된 날짜
}

export interface SavedNewsCardProps {
  news: SavedNewsItem
  onPress: () => void
  onDelete: (id: string) => void
}

export interface SavedNewsListProps {
  newsList: SavedNewsItem[];
  onNewsPress: (newsId: string) => void
  onDelete: (newsId: string) => void
}

export interface SavedNewsScreenProps {
  // 필요시 추가
}

// ========== 뉴스 플레이어 관련 ==========

export interface NewsPlayerData {
  id: string
  title: string
  imageUrl: string
  fullText: string    // 전체 기사 내용
  audioUrl: string    // 오디오 URL
}

export interface NewsPlayerHeaderProps {
  title: string
  onBack: () => void
}

export interface NewsImagePlaceholderProps {
  imageUrl: string
}

export interface LyricsDisplayProps {
  currentLines: string[]  // 현재 보여줄 3줄
}

export interface AudioControlsProps {
  isPlaying: boolean
  onPlay: () => void
  onPause: () => void
  onNext: () => void
  onPrev: () => void
}

export interface BottomActionsProps {
  isCarMode: boolean
  onCarModeToggle: () => void
  onDiscussionPress: () => void
  onSavePress: () => void
}

// ========== 단어장 관련 ==========

export interface SavedWord {
  id: string
  word: string
  savedDate: string  // YYYY-MM-DD
}

export interface WordBookCalendarItem {
  date: string       // YYYY-MM-DD
  count: number      // 단어 개수 (색 진하기 결정)
}

export interface WordBookCalendarProps {
  currentDate: Date
  onPrevMonth: () => void
  onNextMonth: () => void
  calendarData: WordBookCalendarItem[]
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
}

export interface WordBookDateDisplayProps {
  date: Date
}

export interface WordBookChipListProps {
  words: SavedWord[]
  selectedWord: SavedWord | null
  onWordPress: (word: SavedWord) => void
}