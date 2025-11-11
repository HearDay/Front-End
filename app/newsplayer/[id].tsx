import { useLocalSearchParams } from 'expo-router'
import { NewsPlayerScreen } from '../../components/screens/NewsPlayer/NewsPlayerScreen'

export default function NewsPlayerPage() {
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>()

  if (!id) {
    return null
  }

  return <NewsPlayerScreen articleId={id} from={from} />
}
