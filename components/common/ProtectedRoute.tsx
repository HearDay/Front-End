import { storage } from '@/utils/storage'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'

type Props = {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const token = await storage.getAccessToken()
        if (!mounted) return
        if (!token) {
          // 인증 없으면 로그인 페이지로 보냅니다.
          router.replace('/(tabs)/LoginPage')
        }
      } catch (e) {
        console.warn('ProtectedRoute auth check failed', e)
        router.replace('/(tabs)/LoginPage')
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [router])

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return <>{children}</>
}
