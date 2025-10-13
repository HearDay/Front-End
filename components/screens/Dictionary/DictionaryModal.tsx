import { useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native'

interface DictionaryModalProps {
  visible: boolean
  word: string
  isSaved: boolean
  onClose: () => void
  onSave: () => void
}

interface WordDefinition {
  word: string
  definitions: string[]
}

export function DictionaryModal({
  visible,
  word,
  isSaved,
  onClose,
  onSave,
}: DictionaryModalProps) {
  const router = useRouter()
  const [definition, setDefinition] = useState<WordDefinition | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null) 

  // useCallback으로 최적화
  const fetchDefinition = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // TODO: 실제 API 호출
      // const response = await dictionaryService.getDefinition(word)
      // setDefinition(response)
      
      console.log('단어 뜻 API 호출:', word)
      
    } catch (err) {
      setError('단어 뜻을 불러올 수 없습니다.')
      console.error('단어 뜻 로드 실패:', err)
    } finally {
      setLoading(false)
    }
  }, [word])

  useEffect(() => {
    if (visible && word) {
      fetchDefinition()
    }
  }, [visible, word, fetchDefinition])

  const handleSaveAndNavigate = useCallback(async () => {
    await onSave()
    setTimeout(() => {
      router.push('/(tabs)/wordbook')
    }, 1000)
  }, [onSave, router])

  // 상수 분리
  const buttonText = isSaved 
    ? "단어장에 성공적으로 저장했어요!" 
    : "단어장에 넣기"
  
  const buttonStyle = isSaved ? 'bg-[#A8E6B8]' : 'bg-[#006716]'

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable 
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
        onPress={onClose}
      >
        <Pressable 
          className="bg-white rounded-3xl p-6 mx-8 w-full max-w-md"
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="text-2xl font-bold text-center mb-4">{word}</Text>

          <View className="bg-blue-50 rounded-2xl p-4 mb-6 min-h-32">
            {loading ? (
              <ActivityIndicator size="large" color="#006716" />
            ) : error ? (
              <Text className="text-base text-red-500 text-center">{error}</Text>
            ) : definition ? (
              definition.definitions.map((def, index) => (
                <Text key={index} className="text-base leading-6 mb-2">
                  {def}
                </Text>
              ))
            ) : (
              <Text className="text-base text-gray-500 text-center">
                단어 뜻을 불러오는 중..
              </Text>
            )}
          </View>

          <TouchableOpacity
            className={`py-4 rounded-xl ${buttonStyle}`}
            onPress={isSaved ? onClose : handleSaveAndNavigate}
            disabled={loading} // 로딩 중 비활성화
          >
            <Text className="text-center text-white font-semibold">
              {buttonText}
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  )
}