import { ScrollView, Text, View } from 'react-native';
import { DiscussionRecordItem } from '../../../types/screens';
import { DiscussionRecordCard } from './DiscussionRecordCard';

interface DiscussionRecordListProps {
  records: DiscussionRecordItem[];
}

export function DiscussionRecordList({ records }: DiscussionRecordListProps) {
  return (
    <View className="flex-1">
      {/* 헤더 */}
      <View className="px-4 pb-3">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-semibold">토론 기록</Text>
          {/* 정렬 토글 (UI만) */}
          <Text className="text-sm text-[#00801A]">최신순 ▼</Text>
        </View>
        {/* 초록색 언더라인 */}
        <View className="h-px bg-[#00801A]" />
      </View>

      {/* 기록 리스트 */}
      <ScrollView className="flex-1">
        {records.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-gray-400 text-base">토론 기록이 없습니다</Text>
          </View>
        ) : (
          records.map((item) => (
            <DiscussionRecordCard
              key={item.id}
              record={item}
              onPress={() => console.log('Record pressed:', item.id)} // TODO: 기록 상세 화면으로 이동
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
