import { NewsArticleScreen } from '@/components/screens/NewsArticle'
import { useLocalSearchParams } from 'expo-router'

export default function NewsArticlePage() {
  const { id } = useLocalSearchParams()
  
  return <NewsArticleScreen newsId={id as string} />
}