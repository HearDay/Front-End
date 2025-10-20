import { Modal } from '@/components/common'
import { useRouter } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'
import { DiscussionModalProps } from '../../../types/screens'

export function DiscussionModal({
  visible,
  newsId,
  onClose,
}: DiscussionModalProps) {
  const router = useRouter()

  // 토론 시작 핸들러
  const handleStartDiscussion = (mode: 'voice' | 'chat') => {
    if (!newsId) return
    if (mode === 'voice') {
      router.push('/AIVoiceDebatePage') // 음성 토론 페이지로 이동
    } else {
      router.push('/AIChatDebatePage?mode=chat') // 채팅 토론 페이지로 이동
    }
    onClose()
  }

  return (
    <Modal
      visible={visible}
      title="이 뉴스로 AI와 토론하시겠어요?"
      onConfirm={onClose}
      onClose={onClose}
      confirmText=""
    >
      <View className="gap-3 mt-6">
        {/* 음성으로 토론 */}
        <TouchableOpacity
          className="bg-[#DBFDE0] py-4 rounded-2xl"
          onPress={() => handleStartDiscussion('voice')}
        >
          <Text className="text-center font-medium">음성으로 토론하러 가기</Text>
        </TouchableOpacity>

        {/* 채팅으로 토론 */}
        <TouchableOpacity
          className="bg-[#DBFDE0] py-4 rounded-2xl"
          onPress={() => handleStartDiscussion('chat')}
        >
          <Text className="text-center font-medium">채팅으로 토론하러 가기</Text>
        </TouchableOpacity>

        {/* 다음에 하기 */}
        <TouchableOpacity
          className="bg-[#DBFDE0] py-4 rounded-2xl"
          onPress={onClose}
        >
          <Text className="text-center font-medium">다음에 하기</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}
