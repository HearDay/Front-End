import { Audio } from 'expo-av'
import { usePathname } from 'expo-router'
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

interface AudioContextType {
  sound: Audio.Sound | null
  isPlaying: boolean
  currentArticleId: string | null
  currentPosition: number
  loadAudio: (audioUrl: string, articleId: string) => Promise<void>
  play: () => Promise<void>
  pause: () => Promise<void>
  unload: () => Promise<void>
  setOnAudioEnd: (callback: (() => void) | null) => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const soundRef = useRef<Audio.Sound | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null)
  const [currentPosition, setCurrentPosition] = useState(0)
  const onAudioEndCallback = useRef<(() => void) | null>(null)

  // 초기 오디오 모드 설정
  useEffect(() => {
    const setupAudioMode = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          interruptionModeIOS: 0,
          shouldDuckAndroid: false,
          playThroughEarpieceAndroid: false,
        })
      } catch {
        // 오디오 모드 설정 실패 시 무시
      }
    }
    setupAudioMode()
  }, [])

  const loadAudio = useCallback(async (audioUrl: string, articleId: string) => {
    try {
      // 기존 오디오가 같은 기사면 유지
      if (currentArticleId === articleId && soundRef.current) {
        return
      }

      // 다른 기사면 기존 오디오 정리
      if (soundRef.current) {
        await soundRef.current.unloadAsync()
        soundRef.current = null
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      )

      soundRef.current = sound
      setCurrentArticleId(articleId)

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setIsPlaying(status.isPlaying)
          setCurrentPosition(status.positionMillis / 1000)

          // 뉴스 재생 종료 감지
          if (status.didJustFinish) {
            console.log('[AudioContext] 오디오 재생 완료 - 콜백 실행');
            if (onAudioEndCallback.current) {
              onAudioEndCallback.current();
            }
          }
        }
      })
    } catch (err) {
      console.error('오디오 로드 실패:', err);
    }
  }, [currentArticleId])

  const play = useCallback(async () => {
    if (!soundRef.current) return
    try {
      await soundRef.current.playAsync()
      setIsPlaying(true)
    } catch (err) {
      console.error('재생 실패:', err)
    }
  }, [])

  const pause = useCallback(async () => {
    if (!soundRef.current) return
    try {
      await soundRef.current.pauseAsync()
      setIsPlaying(false)
    } catch (err) {
      console.error('일시정지 실패:', err)
    }
  }, [])

  const unload = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync()
      soundRef.current = null
      setCurrentArticleId(null)
      setIsPlaying(false)
      setCurrentPosition(0)
    }
  }, [])

  const setOnAudioEnd = useCallback((callback: (() => void) | null) => {
    console.log('[AudioContext] 오디오 종료 콜백 설정:', !!callback);
    onAudioEndCallback.current = callback;
  }, [])

  // 뉴스 재생/기사 화면이 아니면 오디오 정리
  useEffect(() => {
    const isNewsScreen = pathname.includes('/newsplayer/') || pathname.includes('/newsarticle/')

    if (!isNewsScreen && soundRef.current) {
      unload()
    }
  }, [pathname, unload])

  return (
    <AudioContext.Provider
      value={{
        sound: soundRef.current,
        isPlaying,
        currentArticleId,
        currentPosition,
        loadAudio,
        play,
        pause,
        unload,
        setOnAudioEnd,
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}

export const useAudio = () => {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider')
  }
  return context
}
