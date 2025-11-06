import { format } from 'date-fns'
import { SavedWord, WordBookCalendarItem, ApiResponse } from '../../types/screens'
import apiClient from '../api/client'
import { ENDPOINTS } from '../api/endpoints'

// 더미 데이터
const DUMMY_CALENDAR: WordBookCalendarItem[] = [
  { date: '2025-01-10', count: 5 },
  { date: '2025-01-09', count: 3 },
  { date: '2025-01-08', count: 7 },
]

const DUMMY_WORDS: SavedWord[] = [
  {
    id: '1',
    word: 'economy',
    definition: '1. 경제\n2. 절약',
    savedAt: '2025-01-10',
  },
  {
    id: '2',
    word: 'technology',
    definition: '1. 기술\n2. 과학기술',
    savedAt: '2025-01-10',
  },
]

const USE_DUMMY_DATA = false

export const wordbookService = {
  // 월별 저장된 단어 개수 조회
  async getCalendar(date: Date): Promise<WordBookCalendarItem[]> {
    if (USE_DUMMY_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(DUMMY_CALENDAR), 500)
      })
    }

    const year = date.getFullYear()
    const month = date.getMonth() + 1 // 0부터 시작하므로 +1

    // GET /api/words/statistics?year=2025&month=11
    const response = await apiClient.get<ApiResponse<{ wordCountList: WordBookCalendarItem[] }>>(
      ENDPOINTS.WORDBOOK.STATISTICS,
      { params: { year, month } }
    )

    return response.data.data.wordCountList
  },

  // 특정 날짜의 단어 목록 조회
  async getWordsByDate(date: Date): Promise<SavedWord[]> {
    if (USE_DUMMY_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(DUMMY_WORDS), 500)
      })
    }

    const dateStr = format(date, 'yyyy-MM-dd')

    // GET /api/words/date?date=2025-11-05
    const response = await apiClient.get<ApiResponse<{ words: Array<{ wordId: number; word: string }> }>>(
      ENDPOINTS.WORDBOOK.WORDS_BY_DATE,
      { params: { date: dateStr } }
    )

    // API 응답을 SavedWord 형태로 변환
    return response.data.data.words.map(item => ({
      id: String(item.wordId),
      word: item.word,
      savedAt: dateStr,
    }))
  },

  // 단어 저장
  async saveWord(word: string, definition: string): Promise<SavedWord> {
    if (USE_DUMMY_DATA) {
      const newWord: SavedWord = {
        id: Date.now().toString(),
        word,
        definition,
        savedAt: new Date().toISOString(),
      }
      return new Promise((resolve) => {
        setTimeout(() => resolve(newWord), 500)
      })
    }

    // POST /api/words/
    await apiClient.post<ApiResponse<{}>>(
      ENDPOINTS.WORDBOOK.SAVE_WORD,
      {
        word,
        description: definition, // API는 "description" 필드 사용
      }
    )

    // 저장 성공 시 새로운 SavedWord 객체 반환
    return {
      id: Date.now().toString(), // 실제로는 백엔드에서 반환해야 하는데 현재는 빈 객체 반환
      word,
      definition,
      savedAt: new Date().toISOString(),
    }
  },

  // 저장된 단어의 뜻 조회
  async getWordDefinition(wordId: number): Promise<{ word: string; definition: string }> {
    if (USE_DUMMY_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ word: 'test', definition: '1. 테스트' }), 500)
      })
    }

    // GET /api/words/{wordsId}
    const response = await apiClient.get<ApiResponse<{ word: string; description: string }>>(
      ENDPOINTS.WORDBOOK.GET_WORD(wordId)
    )

    return {
      word: response.data.data.word,
      definition: response.data.data.description,
    }
  },

  // 단어 삭제
  async deleteWord(wordId: string): Promise<void> {
    if (USE_DUMMY_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 500)
      })
    }

    await apiClient.delete(ENDPOINTS.WORDBOOK.DELETE_WORD(wordId))
  },
}