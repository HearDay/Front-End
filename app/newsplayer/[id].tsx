import { NewsTest } from '@/components/screens/NewsPlayer'
import { Stack, useLocalSearchParams } from 'expo-router'

export default function NewsPlayerPage() {
  const { id } = useLocalSearchParams()
  
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <NewsTest newsId={id as string} />
    </>
  )
}