import { WordDefinition } from '../../types/screens'
import apiClient from '../api/client'
import { ENDPOINTS } from '../api/endpoints'

const USE_DUMMY_DATA = true

export const dictionaryService = {
  async searchWord(query: string): Promise<string[]> {
    if (USE_DUMMY_DATA) {
      const results = ['example', 'test', 'word'].filter(w => 
        w.toLowerCase().includes(query.toLowerCase())
      )
      return new Promise((resolve) => {
        setTimeout(() => resolve(results), 300)
      })
    }
    
    const response = await apiClient.get(ENDPOINTS.DICTIONARY.SEARCH, {
      params: { q: query }
    })
    return response.data
  },

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
    
    const response = await apiClient.get(ENDPOINTS.DICTIONARY.DEFINITION(word))
    return response.data
  },
}