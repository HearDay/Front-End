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
  onPress?: () => void
}

export interface LyricsDisplayProps {
  currentLines: string[]  // 현재 보여줄 3줄
  onPress?: () => void
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
//  savedDate: string  // YYYY-MM-DD
  definition?: string //추가: 단어 뜻 
  savedAt: string
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

// ========== 기사 본문 관련 ==========

export interface NewsArticleData {
  id: string
  title: string
  imageUrl: string
  content: string     // 본문
}

export interface NewsArticleScreenProps {
  newsId: string
}

export interface NewsArticleImageProps {
  imageUrl: string
  onPress: () => void   // 이미지 클릭 → 본문으로 스크롤
}

export interface NewsArticleContentProps {
  content: string
  highlightWord?: string
  onWordPress: (word: string) => void
  highlightMatches?: {start: number, end: number}[]
  currentHighlightIndex?: number
}

// ========== 단어 사전 관련 ==========

export interface DictionarySearchBarProps {
  visible: boolean
  onClose: () => void
  onSearch: (word: string) => void
  onOpen?: () => void
  matchCount?: number
  currentIndex?: number
  onPrev?: () => void
  onNext?: () => void
}

export interface DictionaryModalProps {
  visible: boolean
  word: string
  saveState?: 'IDLE' | 'SAVING' | 'SAVED' | 'ALREADY_EXISTS'
  onClose: () => void
  onSave: (definition: string) => void
}

export interface WordDefinition {
  word: string
  definitions: string[]  // ["1. 뜻1", "2. 뜻2"]
}

// ========== 토론 화면 관련 ==========

export interface DiscussionNewsItem {
  id: string
  title: string
  imageUrl: string
  summary: string
  viewedAt: string       // 재생한 시간
  popularity?: number    // 인기도
  viewCount?: number     // 조회수
}

export interface DiscussionActionButtonsProps {
  activeButton: 'discussion' | 'record';
  onDiscussionPress: () => void;
  onRecordPress: () => void;
}

export interface DiscussionNewsListProps {
  news: DiscussionNewsItem[]
  sortBy: 'latest' | 'popular' | 'views'
  onSortChange: (sort: 'latest' | 'popular' | 'views') => void
  onNewsPress: (newsId: string) => void
}

export interface DiscussionNewsCardProps {
  news: DiscussionNewsItem
  onPress: () => void
}

export interface DiscussionModalProps {
  visible: boolean
  newsId: string | null
  onClose: () => void
  onStartDiscussion: (type: 'voice' | 'chat', newsId: string) => void
}

// ========== 토론 기록 관련 ==========

export interface DiscussionRecordItem {
  id: string;
  title: string;
  discussedAt: string; // YYYY-MM-DD
}