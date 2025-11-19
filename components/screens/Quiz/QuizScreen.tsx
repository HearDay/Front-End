import { useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { Animated, Image, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface QuizOption {
  id: string
  text: string
  isCorrect: boolean
}

interface QuizData {
  id: string
  question: string
  options: QuizOption[]
  points: number
  explanation: string
}

// 더미 데이터
const DUMMY_QUIZ: QuizData = {
  id: '1',
  question: 'KT 차기 CEO 최종 후보는 언제 선정될 예정인가요?',
  options: [
    { id: '1', text: '내년 3월에 선정될 예정이다.', isCorrect: false },
    { id: '2', text: '올해 안에 선정될 예정이다.', isCorrect: true },
    { id: '3', text: '주주총회에서 선정될 예정이다.', isCorrect: false },
  ],
  points: 5,
  explanation: 'KT는 올해 안에 차기 CEO 최종 후보를 선정할 예정입니다. 현재 내부 및 외부 후보자들을 대상으로 면접과 평가가 진행 중이며, 이사회의 최종 승인을 거쳐 올해 말까지 새로운 CEO가 확정될 것으로 보입니다.',
}

export const QuizScreen = () => {
  const router = useRouter()
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [showCorrectAnimation, setShowCorrectAnimation] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const shakeAnimation = useRef(new Animated.Value(0)).current
  const correctAnimation = useRef(new Animated.Value(0)).current
  const optionAnimations = useRef(
    DUMMY_QUIZ.options.reduce((acc, option) => {
      acc[option.id] = {
        translateX: new Animated.Value(0),
        opacity: new Animated.Value(1),
      }
      return acc
    }, {} as Record<string, { translateX: Animated.Value; opacity: Animated.Value }>)
  ).current

  const handleOptionPress = (optionId: string) => {
    if (!isAnswered) {
      setSelectedOption(optionId)
    }
  }

  const handleConfirm = () => {
    const selectedOptionData = DUMMY_QUIZ.options.find(opt => opt.id === selectedOption)

    setIsAnswered(true)

    if (selectedOptionData && !selectedOptionData.isCorrect) {
      // 틀렸을 때 흔들림 애니메이션
      Animated.sequence([
        Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start()

      setTimeout(() => {
        setSelectedOption(null)
        setIsAnswered(false)
      }, 2000)
    } else if (selectedOptionData && selectedOptionData.isCorrect) {
      // 맞았을 때 O 애니메이션
      setShowCorrectAnimation(true)
      Animated.sequence([
        Animated.timing(correctAnimation, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.delay(800),
        Animated.timing(correctAnimation, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => {
        setShowCorrectAnimation(false)

        // O 애니메이션이 끝나면 해설 보여주기
        setTimeout(() => {
          // 틀린 선지들을 왼쪽으로 사라지게
          const animations = DUMMY_QUIZ.options
            .filter(opt => !opt.isCorrect)
            .map(opt =>
              Animated.parallel([
                Animated.timing(optionAnimations[opt.id].translateX, {
                  toValue: -400,
                  duration: 400,
                  useNativeDriver: true,
                }),
                Animated.timing(optionAnimations[opt.id].opacity, {
                  toValue: 0,
                  duration: 400,
                  useNativeDriver: true,
                }),
              ])
            )

          Animated.parallel(animations).start(() => {
            // 애니메이션이 끝나면 해설 표시
            setShowExplanation(true)
          })
        }, 100)
      })
    }
  }

  const handleBack = () => {
    router.back()
  }

  const getOptionStyle = (option: QuizOption) => {
    if (!isAnswered) {
      return selectedOption === option.id
        ? 'bg-[#B3D7BB] border-[#B3D7BB]'
        : 'bg-white border-[#B3D7BB]'
    }

    if (selectedOption === option.id && !option.isCorrect) {
      return 'bg-[#FFD4D4] border-[#FFD4D4]'
    }

    if (selectedOption === option.id && option.isCorrect) {
      return 'bg-[#B3D7BB] border-[#B3D7BB]'
    }

    return 'bg-white border-[#B3D7BB]'
  }

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-4 pt-2 pb-4 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image
              source={require('../../../my-expo-app/assets/images/BackButton.png')}
              className="w-[12px] h-[18px]"
              resizeMode="contain"
            />
          </TouchableOpacity>

          <Text className="text-[32px] font-bold">
            <Text className="text-[#FF9D42]">Q</Text>
            <Text className="text-[#89B93F]">U</Text>
            <Text className="text-[#FF9D42]">I</Text>
            <Text className="text-[#4A90E2]">Z</Text>
          </Text>

          <View className="w-[12px]" />
        </View>

        {/* Content */}
        <View className="flex-1 px-6 pt-6">
          {/* Points Badge */}
          <View className="self-start bg-[#FBFFD3] px-4 py-1 rounded-full mb-6">
            <Text className="text-[14px] font-semibold text-[#002C09]">
              {DUMMY_QUIZ.points} POINT
            </Text>
          </View>

          {/* Question */}
          <Text className="text-[20px] font-bold mb-8">
            <Text className="text-[#006716]">Q. </Text>
            {DUMMY_QUIZ.question}
          </Text>

          {/* Options */}
          <View className="gap-5">
            {DUMMY_QUIZ.options.map((option) => {
              if (showExplanation && !option.isCorrect) {
                return null
              }

              return (
                <Animated.View
                  key={option.id}
                  style={{
                    transform: [
                      {
                        translateX: isAnswered && selectedOption === option.id && !option.isCorrect
                          ? shakeAnimation
                          : optionAnimations[option.id].translateX
                      }
                    ],
                    opacity: optionAnimations[option.id].opacity
                  }}
                >
                  <TouchableOpacity
                    onPress={() => handleOptionPress(option.id)}
                    disabled={isAnswered}
                    activeOpacity={0.7}
                    className={`border rounded-2xl px-5 py-8 flex-row items-center ${getOptionStyle(option)}`}
                  >
                  <View className="mr-4 w-[24px] items-center justify-center">
                    {!isAnswered && selectedOption === option.id && (
                      <Text className="text-[20px] text-[#006716] leading-[20px]">✓</Text>
                    )}
                    {!isAnswered && selectedOption !== option.id && (
                      <Text className="text-[20px] text-[#B3D7BB] leading-[20px]">✓</Text>
                    )}
                    {isAnswered && selectedOption === option.id && option.isCorrect && (
                      <Text className="text-[20px] text-[#006716] leading-[20px]">✓</Text>
                    )}
                    {isAnswered && selectedOption === option.id && !option.isCorrect && (
                      <Text className="text-[20px] text-red-500 leading-[20px]">✕</Text>
                    )}
                    {isAnswered && selectedOption !== option.id && (
                      <Text className="text-[20px] text-[#B3D7BB] leading-[20px]">✓</Text>
                    )}
                  </View>
                  <Text className="text-[16px] flex-1">{option.text}</Text>
                </TouchableOpacity>
                </Animated.View>
              )
            })}
          </View>

          {/* 해설 */}
          {showExplanation && (
            <View className="mt-6 p-5 bg-gray-50 rounded-2xl">
              <Text className="text-[16px] text-[#7B7B7B] leading-6">
                {DUMMY_QUIZ.explanation}
              </Text>
            </View>
          )}

          {/* Confirm Button */}
          {!showExplanation && (
            <View className="mt-auto mb-8 items-center">
              <TouchableOpacity
                onPress={handleConfirm}
                disabled={!selectedOption || isAnswered}
                activeOpacity={0.8}
                className={`w-[200px] h-[50px] rounded-[10px] flex-row justify-center items-center ${
                  selectedOption && !isAnswered ? 'bg-[#006716]' : 'bg-[#B3D7BB]'
                }`}
              >
                <Text className="text-white text-[16px] font-bold mr-2">✓</Text>
                <Text className="text-white text-[16px] font-bold">정답 확인</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 정답 애니메이션 */}
        {showCorrectAnimation && (
          <Animated.View
            className="absolute inset-0 items-center justify-center"
            style={{
              opacity: correctAnimation,
              transform: [
                {
                  scale: correctAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 1]
                  })
                }
              ]
            }}
          >
            <View className="w-[150px] h-[150px] rounded-full border-[8px] border-[#006716] items-center justify-center bg-white/90">
              <Text className="text-[100px] text-[#006716] font-bold">O</Text>
            </View>
          </Animated.View>
        )}
      </SafeAreaView>
    </View>
  )
}
