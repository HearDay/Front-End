import { Modal } from '@/components/common'
import { Text, TouchableOpacity, View } from 'react-native'
import { DiscussionModalProps } from '../../../types/screens'

export function DiscussionModal({
  visible,
  newsId,
  onClose,
  onStartDiscussion,
}: DiscussionModalProps) {
  return (
    <Modal
      visible={visible}
      title="이 뉴스로 AI와 토론하시겠어요?"
      onConfirm={onClose} 
      onClose={onClose}
      confirmText=""  
    >
      <View className="gap-3">
        <TouchableOpacity 
          className="bg-[#DBFDE0] py-4 rounded-2xl"
          onPress={() => newsId && onStartDiscussion('voice', newsId)}
        >
          <Text className="text-center font-medium">음성으로 토론하러 가기</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="bg-[#DBFDE0] py-4 rounded-2xl"
          onPress={() => newsId && onStartDiscussion('chat', newsId)}
        >
          <Text className="text-center font-medium">채팅으로 토론하러 가기</Text>
        </TouchableOpacity>
        
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