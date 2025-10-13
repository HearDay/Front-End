import { NewsArticleTest } from '@/components/screens/NewsArticle'
import { Stack, useLocalSearchParams } from 'expo-router'

export default function NewsArticlePage() {
  const { id } = useLocalSearchParams()
  
  console.log('NewsArticlePage 렌더링, id:', id) // ✅ 디버깅
  
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <NewsArticleTest newsId={id as string} />
    </>
  )
}