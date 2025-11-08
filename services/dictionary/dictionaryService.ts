import { WordDefinition, ApiResponse } from '../../types/screens'
import apiClient from '../api/client'
import { ENDPOINTS } from '../api/endpoints'

export const dictionaryService = {
  async getDefinition(word: string): Promise<WordDefinition> {
    const response = await apiClient.get<ApiResponse<string[]>>(ENDPOINTS.DICTIONARY.SEARCH(word))

    return {
      word,
      definitions: response.data.data,
    }
  },
}
