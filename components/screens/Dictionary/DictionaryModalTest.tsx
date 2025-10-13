import { useRouter } from 'expo-router'
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native'

interface DictionaryModalTestProps {
  visible: boolean
  word: string
  isSaved: boolean
  onClose: () => void
  onSave: () => void
}

export function DictionaryModalTest({
  visible,
  word,
  isSaved,
  onClose,
  onSave,
}: DictionaryModalTestProps) {
  const router = useRouter()

  const dummyDefinitions: Record<string, string[]> = {
    '흥행': [
      '1. 영리를 목적으로 연극, 영화, 서커스 따위를 요금을 받고 대중에게 보여 줌.',
      '2. 공연 상영 따위가 성공적으로 큰 수익을 거둠.',
    ],
    '박스오피스': [
      '1. 영화관 따위의 매표소.',
      '2. 영화의 흥행 성적을 나타내는 지표.',
    ],
    '기록': [
      '1. 어떤 사실을 적어서 남김.',
      '2. 운동 경기 따위에서 세운 성적.',
    ],
  }

  const definitions = dummyDefinitions[word] || ['단어 뜻을 찾을 수 없습니다.']

  // ✅ 수정: 단어장 이동 제거, 저장만 하고 모달 닫기
  const handleSave = async () => {
    await onSave()
    // setTimeout 제거 - 바로 모달 닫기
    onClose()
  }

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

          <View className="bg-blue-50 rounded-2xl p-4 mb-6">
            {definitions.map((def, index) => (
              <Text key={index} className="text-base leading-6 mb-2">
                {def}
              </Text>
            ))}
          </View>

          <TouchableOpacity
            className={`py-4 rounded-xl ${isSaved ? 'bg-[#A8E6B8]' : 'bg-[#006716]'}`}
            onPress={isSaved ? onClose : handleSave}
            activeOpacity={0.7}
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