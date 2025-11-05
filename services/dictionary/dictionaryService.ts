import { WordDefinition, ApiResponse } from '../../types/screens'
import apiClient from '../api/client'
import { ENDPOINTS } from '../api/endpoints'

const USE_DUMMY_DATA = false

export const dictionaryService = {
  async getDefinition(word: string): Promise<WordDefinition> {
    if (USE_DUMMY_DATA) {
      const dummyDefinition: WordDefinition = {
        word,
        definitions: [
          `1. ${word}의 첫 번째 뜻`,
          `2. ${word}의 두 번째 뜻`,
        ],
      }
      return new Promise((resolve) => {
        setTimeout(() => resolve(dummyDefinition), 500)
      })
    }

    // API 호출: GET /api/dictionary/search/{word}
    const response = await apiClient.get<ApiResponse<string[]>>(ENDPOINTS.DICTIONARY.SEARCH(word))

    // 응답의 data 배열을 WordDefinition 형태로 변환
    return {
      word,
      definitions: response.data.data,
    }
  },
}