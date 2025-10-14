import { format } from 'date-fns'
import { SavedWord, WordBookCalendarItem } from '../../types/screens'
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

const USE_DUMMY_DATA = true

export const wordbookService = {
  async getCalendar(date: Date): Promise<WordBookCalendarItem[]> {
    if (USE_DUMMY_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(DUMMY_CALENDAR), 500)
      })
    }
    
    const yearMonth = format(date, 'yyyy-MM')
    const response = await apiClient.get(ENDPOINTS.WORDBOOK.CALENDAR, {
      params: { yearMonth }
    })
    return response.data
  },

  async getWordsByDate(date: Date): Promise<SavedWord[]> {
    if (USE_DUMMY_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(DUMMY_WORDS), 500)
      })
    }
    
    const dateStr = format(date, 'yyyy-MM-dd')
    const response = await apiClient.get(ENDPOINTS.WORDBOOK.WORDS_BY_DATE, {
      params: { date: dateStr }
    })
    return response.data
  },

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
    
    const response = await apiClient.post(ENDPOINTS.WORDBOOK.SAVE_WORD, {
      word,
      definition,
    })
    return response.data
  },

  async deleteWord(wordId: string): Promise<void> {
    if (USE_DUMMY_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 500)
      })
    }
    
    await apiClient.delete(ENDPOINTS.WORDBOOK.DELETE_WORD(wordId))
  },
}