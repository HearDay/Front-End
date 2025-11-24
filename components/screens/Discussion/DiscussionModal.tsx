// DiscussionModal.tsx
import { Modal } from "@/components/common";
import { Text, TouchableOpacity, View } from "react-native";

interface DiscussionModalProps {
  visible: boolean;
  articleId: string;
  onClose: () => void;
  onStartDiscussion: (mode: "voice" | "chat") => void;
}

export function DiscussionModal({
  visible,
  articleId,
  onClose,
  onStartDiscussion, 
}: DiscussionModalProps) {
  return (
    <Modal
      visible={visible}
      title="이 뉴스로 AI와 토론하시겠어요?"
      onClose={onClose}
      confirmText=""
      onConfirm={onClose}
    >
      <View className="gap-3 mt-6">
        <TouchableOpacity
          className="bg-[#DBFDE0] py-4 rounded-2xl"
          onPress={() => onStartDiscussion("voice")}
        >
          <Text className="text-center font-medium">음성으로 토론하기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-[#DBFDE0] py-4 rounded-2xl"
          onPress={() => onStartDiscussion("chat")}
        >
          <Text className="text-center font-medium">채팅으로 토론하기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-[#DBFDE0] py-4 rounded-2xl"
          onPress={onClose}
        >
          <Text className="text-center font-medium">다음에 하기</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
