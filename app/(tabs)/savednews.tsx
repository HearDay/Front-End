import { SavedNewsScreen } from '@/components/screens/SavedNews/SavedNewsScreen'
import { Stack } from 'expo-router'

export default function SavedNewsPage() {
  return (
  <>
  <Stack.Screen options={{ headerShown: false }} />
  <SavedNewsScreen />
  </>
)}