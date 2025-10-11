import { NewsPlayerScreen } from '@/components/screens/NewsPlayer'
import { useLocalSearchParams } from 'expo-router'

export default function NewsPlayerPage() {
  const { id } = useLocalSearchParams()
  
  return <NewsPlayerScreen newsId={id as string} />
}