import { NewsPlayerScreen } from '@/components/screens/NewsPlayer/NewsPlayerScreen'
import { Stack, useLocalSearchParams } from 'expo-router'

export default function NewsPlayerPage() {
  const { id } = useLocalSearchParams<{ id: string }>()
  
  if (!id) {
    return null
  }
  
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <NewsPlayerScreen newsId={id} />
    </>
  )
}