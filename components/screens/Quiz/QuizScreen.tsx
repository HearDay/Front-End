import { quizService, QuizQuestion } from '@/services/quiz/quizService'
import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Animated, Image, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface QuizOption {
  id: number
  text: string
  isCorrect: boolean
}

interface QuizData {
  id: number
  question: string
  options: QuizOption[]
  explanation: string
}

interface QuizScreenProps {
  articleId: string
}

export const QuizScreen = ({ articleId }: QuizScreenProps) => {
  const router = useRouter()
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [showCorrectAnimation, setShowCorrectAnimation] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const shakeAnimation = useRef(new Animated.Value(0)).current
  const correctAnimation = useRef(new Animated.Value(0)).current
  const [optionAnimations, setOptionAnimations] = useState<Record<number, { translateX: Animated.Value; opacity: Animated.Value }>>({})

  // 퀴즈 데이터 로드
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true)
        const quiz = await quizService.getQuizByArticle(parseInt(articleId))

        // API 데이터를 QuizData 형식으로 변환
        const formattedQuiz: QuizData = {
          id: quiz.id,
          question: quiz.question,
          options: [
            { id: 1, text: quiz.option1, isCorrect: quiz.correctAnswer === 1 },
            { id: 2, text: quiz.option2, isCorrect: quiz.correctAnswer === 2 },
            { id: 3, text: quiz.option3, isCorrect: quiz.correctAnswer === 3 },
          ],
          explanation: quiz.explanation,
        }

        setQuizData(formattedQuiz)

        // 애니메이션 초기화
        const animations = formattedQuiz.options.reduce((acc, option) => {
          acc[option.id] = {
            translateX: new Animated.Value(0),
            opacity: new Animated.Value(1),
          }
          return acc
        }, {} as Record<number, { translateX: Animated.Value; opacity: Animated.Value }>)
        setOptionAnimations(animations)

        // 이미 풀었는지 표시
        if (quiz.isSolved) {
          setIsAnswered(true)
          setShowExplanation(true)
          setSelectedOption(quiz.correctAnswer)
        }
      } catch (err: any) {
        if (err.response?.status === 403) {
          setError('이 기사에는 아직 퀴즈가 준비되지 않았습니다.')
        } else if (err.response?.status === 404) {
          setError('퀴즈를 찾을 수 없습니다.')
        } else {
          setError('퀴즈를 불러올 수 없습니다.')
        }
        console.error('퀴즈 로드 실패:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [articleId])

  const handleOptionPress = (optionId: number) => {
    if (!isAnswered) {
      setSelectedOption(optionId)
    }
  }

  const handleConfirm = async () => {
    if (!quizData) return

    const selectedOptionData = quizData.options.find(opt => opt.id === selectedOption)

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
      // 정답 제출
      try {
        await quizService.solveQuiz(quizData.id)
      } catch (error) {
        console.error('퀴즈 제출 실패:', error)
      }

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
          const animations = quizData.options
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

  if (loading) {
    return (
      <View className="flex-1 bg-white">
        <SafeAreaView className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#006716" />
          <Text className="text-gray-600 mt-4">퀴즈를 불러오는 중...</Text>
        </SafeAreaView>
      </View>
    )
  }

  if (error || !quizData) {
    return (
      <View className="flex-1 bg-white">
        <SafeAreaView className="flex-1 justify-center items-center px-4">
          <Text className="text-red-500 text-center mb-4">{error || '퀴즈를 찾을 수 없습니다.'}</Text>
          <TouchableOpacity
            onPress={handleBack}
            className="bg-green-600 px-6 py-3 rounded-xl"
            activeOpacity={0.7}
          >
            <Text className="text-white font-semibold">돌아가기</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    )
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
          {/* Question */}
          <Text className="text-[20px] font-bold mb-8">
            <Text className="text-[#006716]">Q. </Text>
            {quizData.question}
          </Text>

          {/* Options */}
          <View className="gap-5">
            {quizData.options.map((option) => {
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
                          : optionAnimations[option.id]?.translateX || new Animated.Value(0)
                      }
                    ],
                    opacity: optionAnimations[option.id]?.opacity || new Animated.Value(1)
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
                {quizData.explanation}
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
