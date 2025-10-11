import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
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

  // API로 단어 뜻 가져오기
  useEffect(() => {
    if (visible && word) {
      fetchDefinition()
    }
  }, [visible, word])

  const fetchDefinition = async () => {
    try {
      setLoading(true)
      // TODO: 실제 API 호출
      // const response = await dictionaryService.getDefinition(word);
      // setDefinition(response);
      
      console.log('단어 뜻 API 호출:', word)
      
    } catch (error) {
      console.error('단어 뜻 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  };

  const handleSaveAndNavigate = async () => {
    await onSave();
    setTimeout(() => {
      router.push('/(tabs)/wordbook')
    }, 1000)
  };

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
          {/* 단어 */}
          <Text className="text-2xl font-bold text-center mb-4">{word}</Text>

          {/* 뜻 */}
          <View className="bg-blue-50 rounded-2xl p-4 mb-6 min-h-32">
            {loading ? (
              <ActivityIndicator size="large" color="#006716" />
            ) : definition ? (
              definition.definitions.map((def, index) => (
                <Text key={index} className="text-base leading-6 mb-2">
                  {def}
                </Text>
              ))
            ) : (
              <Text className="text-base text-gray-500 text-center">
                단어 뜻을 불러오는 중...
              </Text>
            )}
          </View>

          {/* 저장 버튼 */}
          <TouchableOpacity
            className={`py-4 rounded-xl ${isSaved ? 'bg-[#A8E6B8]' : 'bg-[#006716]'}`}
            onPress={isSaved ? onClose : handleSaveAndNavigate}
          >
            <Text className="text-center text-white font-semibold">
              {isSaved ? "단어장에 성공적으로 저장했어요!" : "단어장에 넣기"}
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  )
}