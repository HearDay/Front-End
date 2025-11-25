import { QuizScreen } from '../../components/screens/Quiz'
import { useLocalSearchParams } from 'expo-router'

export default function QuizPage() {
  const { id } = useLocalSearchParams<{ id: string }>()

  if (!id) {
    return null
  }

  return <QuizScreen articleId={id} />
}
