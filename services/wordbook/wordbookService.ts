import { SavedWord, WordBookCalendarItem, ApiResponse } from '../../types/screens'
import apiClient from '../api/client'
import { ENDPOINTS } from '../api/endpoints'

export const wordbookService = {
  // 월별 저장된 단어 개수 조회
  async getCalendar(date: Date): Promise<WordBookCalendarItem[]> {
    const year = date.getFullYear()
    const month = date.getMonth() + 1

    const response = await apiClient.get<ApiResponse<{ wordCountList: WordBookCalendarItem[] }>>(
      ENDPOINTS.WORDBOOK.STATISTICS,
      { params: { year, month } }
    )

    return response.data.data.wordCountList
  },

  // 특정 날짜의 단어 목록 조회
  async getWordsByDate(date: Date): Promise<SavedWord[]> {
    // 타임존 영향 없이 날짜 문자열 생성
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`

    const response = await apiClient.get<ApiResponse<{ words: Array<{ wordId: number; word: string }> }>>(
      ENDPOINTS.WORDBOOK.WORDS_BY_DATE,
      { params: { date: dateStr } }
    )

    return response.data.data.words.map(item => ({
      id: String(item.wordId),
      word: item.word,
      savedAt: dateStr,
    }))
  },

  // 단어 저장
  async saveWord(word: string, definition: string): Promise<SavedWord> {
    await apiClient.post<ApiResponse<{}>>(
      ENDPOINTS.WORDBOOK.SAVE_WORD,
      {
        word,
        description: definition,
      }
    )

    return {
      id: Date.now().toString(),
      word,
      definition,
      savedAt: new Date().toISOString(),
    }
  },

  // 저장된 단어의 뜻 조회
  async getWordDefinition(wordId: number): Promise<{ word: string; definition: string }> {
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
    await apiClient.delete(ENDPOINTS.WORDBOOK.DELETE_WORD(wordId))
  },
}
