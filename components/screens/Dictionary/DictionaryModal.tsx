import { dictionaryService } from '@/services'
import axios from 'axios'
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
    console.log('DictionaryModal 검색 시작:', word)
    try {
      setLoading(true)
      setError(null)
      setDefinition(null)
      const response = await dictionaryService.getDefinition(word)
      console.log('DictionaryModal 검색 결과:', {
        word,
        definitionsCount: response.definitions.length,
        definitions: response.definitions
      });
      setDefinition(response)
    } catch (err) {
      console.log('DictionaryModal 검색 에러:', word);
      setDefinition(null)
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('단어 뜻을 불러올 수 없습니다.')
      }
    } finally {
      setLoading(false)
    }
  }, [word])

  useEffect(() => {
    if (visible && word) {
      fetchDefinition()
    } else if (!visible) {
      // 모달이 닫힐 때 상태 초기화
      setDefinition(null)
      setError(null)
      setLoading(false)
    }
  }, [visible, word, fetchDefinition])

  const handleSave = () => {
    if (definition) {
      onSave(definition.definitions.join('\n'))
    }
  }

  const { buttonText, buttonColor, disabled } = useMemo(() => {
    switch (saveState) {
      case 'SAVING':
        return { buttonText: '저장 중...', buttonColor: '#9CA3AF', disabled: true }
      case 'SAVED':
        return { buttonText: '단어장에 성공적으로 저장했어요!', buttonColor: '#A8E6B8', disabled: true }
      case 'ALREADY_EXISTS':
        return { buttonText: '오늘 이미 같은 단어를 저장했어요!', buttonColor: '#A8E6B8', disabled: true }
      case 'IDLE':
      default:
        // 검색 결과가 없거나(error), 로딩 중이거나, definition이 없거나, definitions 배열이 비어있거나, "검색 결과가 없습니다" 메시지면 비활성화
        const hasNoResult = definition && (
          definition.definitions.length === 0 ||
          definition.definitions[0] === "검색 결과가 없습니다." ||
          definition.definitions[0].includes("검색 결과가 없습니다")
        );
        const isDisabled = loading || !definition || !!error || hasNoResult;
        console.log('DictionaryModal 버튼 상태:', { loading, definition: !!definition, definitionsLength: definition?.definitions.length, error, hasNoResult, isDisabled })
        return {
          buttonText: '단어장에 넣기',
          buttonColor: isDisabled ? '#9CA3AF' : '#006716',
          disabled: isDisabled
        }
    }
  }, [saveState, loading, definition, error])

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
          className="bg-white rounded-3xl p-6 mx-10 w-full max-w-sm"
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="text-2xl font-bold text-center mb-4">{word}</Text>

          <View className="bg-blue-50 rounded-2xl p-4 mb-6 min-h-32 justify-center">
            {loading ? (
              <ActivityIndicator size="large" color="#006716" />
            ) : error ? (
              <Text className="text-base text-red-500 text-center">{error}</Text>
            ) : definition && definition.definitions.length > 0 ? (
              // "검색 결과가 없습니다." 메시지인지 확인
              definition.definitions[0] === "검색 결과가 없습니다." || definition.definitions[0].includes("검색 결과가 없습니다") ? (
                <Text className="text-base leading-6 mb-2">검색 결과가 없습니다.</Text>
              ) : (
                definition.definitions.map((def, index) => (
                  <Text key={index} className="text-base leading-6 mb-2">
                    {def}
                  </Text>
                ))
              )
            ) : definition && definition.definitions.length === 0 ? (
              <Text className="text-base leading-6 mb-2">검색 결과가 없습니다.</Text>
            ) : (
              <Text className="text-base text-gray-500 text-center">
                단어 뜻을 불러오는 중..
              </Text>
            )}
          </View>

          <TouchableOpacity
            onPress={disabled ? undefined : handleSave}
            disabled={disabled}
            activeOpacity={disabled ? 1 : 0.7}
            style={{
              paddingVertical: 16,
              borderRadius: 12,
              backgroundColor: buttonColor,
              opacity: disabled ? 0.5 : 1,
            }}
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