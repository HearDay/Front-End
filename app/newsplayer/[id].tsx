import { useLocalSearchParams } from 'expo-router'
import { NewsPlayerScreen } from '../../components/screens/NewsPlayer/NewsPlayerScreen'

export default function NewsPlayerPage() {
  const { id } = useLocalSearchParams<{ id: string }>()

  if (!id) {
    return null
  }

  return <NewsPlayerScreen articleId={id} />
}
