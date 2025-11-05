import { useLocalSearchParams } from 'expo-router'
import { NewsArticleScreen } from '../../components/screens/NewsArticle/NewsArticleScreen'

export default function NewsArticlePage() {
  const { id } = useLocalSearchParams<{ id: string }>()

  if (!id) {
    return null
  }

  return <NewsArticleScreen newsId={id} />
}
