import { dictionaryService } from '@/services'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native'
import { DictionaryModalProps } from '../../../types/screens'


interface WordDefinition {
  word: string
  definitions: string[]
}

export function DictionaryModal({
  visible,
  word,
  saveState = 'IDLE',
  onClose,
  onSave,
}: DictionaryModalProps) {
  const [definition, setDefinition] = useState<WordDefinition | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDefinition = useCallback(async () => {
    if (!word) return;
    try {
      setLoading(true)
      setError(null)
      const response = await dictionaryService.getDefinition(word)
      setDefinition(response)
    } catch (err) {
      setError('단어 뜻을 불러올 수 없습니다.')
      console.error('단어 뜻 로드 실패:', err)
    } finally {
      setLoading(false)
    }
  }, [word])

  useEffect(() => {
    if (visible) {
      fetchDefinition()
    }
  }, [visible, fetchDefinition])

  const handleSave = () => {
    if (definition) {
      onSave(definition.definitions.join('\n'));
    }
  }

  const { buttonText, buttonStyle, disabled } = useMemo(() => {
    switch (saveState) {
      case 'SAVING':
        return { buttonText: '저장 중...', buttonStyle: 'bg-gray-400', disabled: true };
      case 'SAVED':
        return { buttonText: '단어장에 성공적으로 저장했어요!', buttonStyle: 'bg-[#A8E6B8]', disabled: true };
      case 'ALREADY_EXISTS':
        return { buttonText: '오늘 이미 같은 단어를 저장했어요!', buttonStyle: 'bg-[#A8E6B8]', disabled: true };
      case 'IDLE':
      default:
        return { buttonText: '단어장에 넣기', buttonStyle: 'bg-[#006716]', disabled: loading || !definition };
    }
  }, [saveState, loading, definition]);

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

          <View className="bg-blue-50 rounded-2xl p-4 mb-6 min-h-32 justify-center">
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
            onPress={handleSave}
            disabled={disabled}
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