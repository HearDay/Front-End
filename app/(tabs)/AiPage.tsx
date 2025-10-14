import { DiscussionScreen } from '@/components/screens/Discussion/DiscussionScreen'
import { Stack } from 'expo-router'

export default function AiPage() {
  return (
  <>
  <Stack.Screen options={{ headerShown: false }} />
  <DiscussionScreen />
  </>
)}