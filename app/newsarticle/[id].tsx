import { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { View, Text, ScrollView, ActivityIndicator } from 'react-native'

import { NewsArticleScreen } from '../../components/screens/NewsArticle/NewsArticleScreen'
import { newsService } from '../../services/news/newsService'
import { ArticleData } from '../../types/screens'

export default function NewsArticlePage() {
  const { id } = useLocalSearchParams<{ id: string }>()
  
  const [article, setArticle] = useState<ArticleData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchArticle = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await newsService.getArticleDetail(id)
        
        setArticle(data)
      } catch (err) {
        console.error('뉴스 기사 상세 정보 가져오기 실패:', err)
        setError('기사를 불러오는 데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
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
    <ScrollView>
      <NewsArticleScreen
        title={article.title}
        imageUrl={article.imageUrl}
        content={article.articleContent} // articleContent를 content로 전달
      />
    </ScrollView>
  )
}
