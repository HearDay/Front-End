import { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { View, Text, ActivityIndicator } from 'react-native'

import { NewsPlayerScreen } from '../../components/screens/NewsPlayer/NewsPlayerScreen'
import { newsService } from '../../services/news/newsService'
import { ArticleData } from '../../types/screens'

export default function NewsPlayerPage() {
  const { id } = useLocalSearchParams<{ id: string }>()

  const [article, setArticle] = useState<ArticleData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchPlayerData = async () => {
      try {
        setLoading(true)
        setError(null)

        // getArticleDetail 한번만 호출하여 모든 정보를 가져옴
        const articleData = await newsService.getArticleDetail(id)
        setArticle(articleData)

      } catch (err) {
        console.error('뉴스 플레이어 데이터 가져오기 실패:', err)
        setError('뉴스 정보를 불러오는 데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchPlayerData()
  }, [id])

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{error}</Text>
      </View>
    )
  }

  if (!article) {
    return null
  }

  return (
    <NewsPlayerScreen
      title={article.title}
      imageUrl={article.imageUrl}
      fullText={article.detail.content} // 중첩 구조 사용
      audioUrl={article.detail.ttsUrl} // 중첩 구조 사용
    />
  )
}
