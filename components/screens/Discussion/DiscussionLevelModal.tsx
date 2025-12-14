import { Modal } from "@/components/common";
import { Text, TouchableOpacity, View } from "react-native";

interface DiscussionLevelModalProps {
  visible: boolean;
  onClose: () => void;
  mode: "voice" | "chat";
  articleId: string;
  onSelect: (level: "beginner" | "intermediate" | "advanced") => void;
}

export function DiscussionLevelModal({
  visible,
  onClose,
  mode,
  articleId,
  onSelect, 
}: DiscussionLevelModalProps) {

  const handleSelectLevel = (level: "beginner" | "intermediate" | "advanced") => {
    onSelect(level);  // 부모로 난이도 전달
    onClose();
  };

  return (
    <Modal
      visible={visible}
      title="토론 난이도를 선택해주세요"
      onClose={onClose}
      confirmText=""
      onConfirm={onClose}
    >
      <View className="mt-6 gap-3 items-center">
        <TouchableOpacity
          className="w-[250px] py-3 rounded-2xl bg-[#1B8131]"
          onPress={() => handleSelectLevel("beginner")}
        >
          <Text className="text-white text-center text-md font-semibold">
            초급
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-[250px] py-3 rounded-2xl text-md bg-[#1B8131]"
          onPress={() => handleSelectLevel("intermediate")}
        >
          <Text className="text-white text-center font-semibold">
            중급
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-[250px] py-3 rounded-2xl text-md bg-[#1B8131]"
          onPress={() => handleSelectLevel("advanced")}
        >
          <Text className="text-white text-center font-semibold">
            고급
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
