import { NewsArticleScreen } from '@/components/screens/NewsArticle/NewsArticleScreen'
import { Stack, useLocalSearchParams } from 'expo-router'

export default function NewsArticlePage() {
  const { id } = useLocalSearchParams<{ id: string }>()
  
  if (!id) {
    return null
  }
  
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <NewsArticleScreen newsId={id} />
    </>
  )
}