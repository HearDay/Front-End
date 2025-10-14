import { WordBookScreen } from '@/components/screens/WordBook/WordBookScreen'
import { Stack } from 'expo-router'

export default function WordBookPage() {
  return (
  <>
  <Stack.Screen options={{ headerShown: false }} />
  <WordBookScreen />
  </>
)}