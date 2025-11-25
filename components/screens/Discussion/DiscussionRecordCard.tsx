import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { DiscussionRecordItem } from "../../../types/screens";

interface DiscussionRecordCardProps {
  record: DiscussionRecordItem;
}

export function DiscussionRecordCard({ record }: DiscussionRecordCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/AIChatRecordPage",
      params: { discussionId: record.id },
    });
  };


  return (
    <TouchableOpacity
      onPress={handlePress}
      className="bg-white rounded-2xl mx-4 mb-3 p-4 flex-row items-center shadow-sm"
      activeOpacity={0.7}
    >
      {/* 좌측: 아이콘과 날짜 */}
      <View className="items-center mr-4">
        <Image
          source={require("../../../my-expo-app/assets/images/history.png")}
          className="w-10 h-10"
          resizeMode="contain"
        />
        <Text className="text-xs text-gray-500 mt-1">{record.discussedAt}</Text>
      </View>

      {/* 우측: 제목 */}
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-800" numberOfLines={2}>
          {record.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
