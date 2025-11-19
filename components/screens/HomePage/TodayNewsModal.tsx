import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  PanResponder,
  Text,
  TouchableOpacity,
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

  useEffect(() => {
    if (completedNewsId) {
      const index = newsItems.findIndex(item => item.id === completedNewsId)
      if (index !== -1) {
        setCurrentIndex(index)
      }
    }
  }, [completedNewsId, newsItems])

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
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
            if (currentIndex < newsItems.length - 1) {
              setCurrentIndex(currentIndex + 1)
              position.setValue(0)
            } else {
              onClose()
            }
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

  const handleCardPress = (newsId: string) => {
    router.push(`/newsplayer/${newsId}?from=todaynews`)
    onClose()
  }

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
          transform: [
            { translateX: position },
            { translateY },
            { scale },
          ],
          opacity: position.interpolate({
            inputRange: [-SCREEN_WIDTH, 0],
            outputRange: [0, 1],
          }),
        }
      : {
          transform: [
            { translateX },
            { translateY },
            { scale },
          ],
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
            shadowRadius: 10,
            elevation: newsItems.length - index,
          },
          animatedStyle,
        ]}
        {...(isCurrentCard ? panResponder.panHandlers : {})}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleCardPress(item.id)}
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
              최근 {userInfo?.age || '20'}대 {userInfo?.gender || '여성'}이 가장 많이 본 뉴스
            </Text>
            <View className="h-[1px] bg-gray-200 mb-3" />

            <Text className="text-[16px] font-bold text-[#002C14] mb-2 leading-5">
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
              <Text className="text-[13px] text-[#7B7B7B] leading-4" numberOfLines={3}>
                {item.summary}
              </Text>
            </View>
          </View>

          {/* 완료 오버레이 */}
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
        </TouchableOpacity>
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
      <View className="flex-1 bg-black/50 justify-center ">
        <TouchableOpacity
          className="absolute top-12 right-6 z-50"
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text className="text-white text-[28px] font-bold">✕</Text>
        </TouchableOpacity>

        <View className="items-center">
          {newsItems.map((item, index) => renderCard(item, index))}
        </View>
      </View>
    </Modal>
  )
}
