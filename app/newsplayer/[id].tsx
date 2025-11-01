import { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { View, Text, ActivityIndicator } from 'react-native'

import { NewsPlayerScreen } from '../../components/screens/NewsPlayer/NewsPlayerScreen'
import { newsService } from '../../services/news/newsService'
import { ArticleData, AudioData } from '../../types/screens'

export default function NewsPlayerPage() {
  const { id } = useLocalSearchParams<{ id: string }>()

  const [article, setArticle] = useState<ArticleData | null>(null)
  const [audio, setAudio] = useState<AudioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchPlayerDara = async () => {
      try {
        setLoading(true)
        setError(null)

        // 기사 상세 정보와 오디오 정보를 동시에 요청
        const [articleData, audioData] = await Promise.all([
          newsService.getArticleDetail(id),
          newsService.getArticleAudio(id),
        ])

        setArticle(articleData)
        setAudio(audioData)

      } catch (err) {
        console.error('뉴스 플레이어 데이터 가져오기 실패:', err)
        setError('뉴스 정보를 불러오는 데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchPlayerDara()
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

  if (!article || !audio) {
    return null
  }

  return (
    <NewsPlayerScreen
      title={article.title}
      imageUrl={article.imageUrl}
      fullText={article.articleContent}
      audioUrl={audio.audioUrl}
    />
  )
}
