import { useRouter } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  Image,
  InteractionManager,
  Modal,
  PanResponder,
  Pressable,
  Text,
  View,
} from 'react-native'

interface TodayNewsItem {
  id: string
  title: string
  imageUrl: string
  summary: string
  category: string
}

interface TodayNewsModalProps {
  visible: boolean
  onClose: () => void
  newsItems: TodayNewsItem[]
  userInfo?: {
    age: string
    gender: string
  }
  completedNewsId?: string | null
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const SWIPE_THRESHOLD = -120
const CARD_WIDTH = SCREEN_WIDTH - 100

export const TodayNewsModal = ({
  visible,
  onClose,
  newsItems,
  userInfo,
  completedNewsId,
}: TodayNewsModalProps) => {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const position = useRef(new Animated.Value(0)).current
  const newsItemsRef = useRef(newsItems)

  // newsItems가 변경될 때마다 ref 업데이트
  useEffect(() => {
    newsItemsRef.current = newsItems
  }, [newsItems])

  useEffect(() => {
    if (visible) {
      if (completedNewsId) {
        const index = newsItems.findIndex(item => item.id === completedNewsId)
        if (index !== -1) {
          setCurrentIndex(index)
        } else {
          setCurrentIndex(0)
        }
      } else {
        setCurrentIndex(0)
      }
      position.setValue(0)
    }
  }, [visible, completedNewsId, newsItems])

  const handleCardPress = useCallback(
    (newsId: string) => {
      router.push(`/(tabs)?showTodayNews=true&newsId=${newsId}&from=todaynews`)
      router.push(`/newsplayer/${newsId}?from=todaynews`)
      onClose()
    },
    [router, onClose]
  )

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => {
        return Math.abs(gesture.dx) > 5
      },
      onPanResponderMove: (_, gesture) => {
        if (gesture.dx < 0) {
          position.setValue(gesture.dx)
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx < SWIPE_THRESHOLD) {
          Animated.timing(position, {
            toValue: -SCREEN_WIDTH,
            duration: 250,
            useNativeDriver: true,
          }).start(() => {
            setCurrentIndex(prevIndex => {
              const newIndex = prevIndex + 1
              if (newIndex >= newsItemsRef.current.length) {
                InteractionManager.runAfterInteractions(() => {
                  onClose()
                })
                return prevIndex
              }
              position.setValue(0)
              return newIndex
            })
          })
        } else {
          Animated.spring(position, {
            toValue: 0,
            useNativeDriver: true,
          }).start()
        }
      },
    })
  ).current

  const renderCard = (item: TodayNewsItem, index: number) => {
    if (index < currentIndex) return null

    const isCurrentCard = index === currentIndex
    const offset = index - currentIndex
    const scale = 1 - offset * 0.03
    const translateY = -offset * 10
    const translateX = offset * 10
    const isCompleted = completedNewsId === item.id

    const animatedStyle = isCurrentCard
      ? {
          transform: [{ translateX: position }, { translateY }, { scale }],
          opacity: position.interpolate({
            inputRange: [-SCREEN_WIDTH, 0],
            outputRange: [0, 1],
          }),
        }
      : {
          transform: [{ translateX }, { translateY }, { scale }],
          opacity: 1,
        }

    return (
      <Animated.View
        key={item.id}
        style={[
          {
            position: 'absolute',
            width: CARD_WIDTH,
            zIndex: newsItems.length - index,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: offset * 2 },
            shadowOpacity: 0.1 + offset * 0.05,
            shadowRadius: 5,
            elevation: newsItems.length - index,
          },
          animatedStyle,
        ]}
        {...panResponder.panHandlers}
      >
        <Pressable onPress={() => isCurrentCard && handleCardPress(item.id)}>
          <View
            className="bg-white rounded-3xl overflow-hidden"
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0, 0, 0, 0.05)',
            }}
          >
            <View className="p-5">
              <Text className="text-[18px] font-bold text-[#002C14] mb-2">
                오늘의 뉴스
              </Text>
              <Text className="text-[11px] text-[#006716] mb-2">
                최근 {userInfo?.age || '20'}대 {userInfo?.gender || '여성'}이
                가장 많이 본 뉴스
              </Text>
              <View className="h-[1px] bg-gray-200 mb-3" />

              <Text
                className="text-[16px] font-bold text-[#002C14] mb-2 leading-5"
              >
                {item.title}
              </Text>
              <View className="h-[1px] bg-gray-200 mb-3" />

              <Image
                source={{ uri: item.imageUrl }}
                className="w-full h-[160px] rounded-2xl mb-3"
                resizeMode="cover"
              />

              <View className="bg-gray-50 rounded-2xl p-3">
                <Text className="text-[11px] font-semibold text-gray-600 mb-1">
                  간단 요약
                </Text>
                <Text
                  className="text-[13px] text-[#7B7B7B] leading-4"
                  numberOfLines={3}
                >
                  {item.summary}
                </Text>
              </View>
            </View>

            {isCompleted && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }}
              >
                <Image
                  source={require('../../../my-expo-app/assets/images/read.png')}
                  style={{
                    width: 200,
                    height: 200,
                    transform: [{ rotate: '-15deg' }],
                  }}
                  resizeMode="contain"
                />
              </View>
            )}
          </View>
        </Pressable>
      </Animated.View>
    )
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-center"
        style={{ paddingBottom: 80 }}
        onPress={onClose}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <Text className="text-white text-center text-[12px] mb-8 px-8">
            옆으로 스크롤하여 다음 뉴스를 확인해보세요!
          </Text>
          <View className="items-center">
            {newsItems.map((item, index) => renderCard(item, index))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}