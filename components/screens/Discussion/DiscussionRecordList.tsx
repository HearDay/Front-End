import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { DiscussionRecordListProps } from '../../../types/screens';
import { DiscussionRecordCard } from './DiscussionRecordCard';

export function DiscussionRecordList({
  records,
  sortBy,
  onSortChange,
  onRecordPress,
}: DiscussionRecordListProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '날짜순' },
  ] as const;

  const currentLabel = sortOptions.find(opt => opt.value === sortBy)?.label || '최신순';

  return (
    <View className="flex-1">
      {/* 헤더 */}
      <View className="px-4 pb-3">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-semibold">토론 기록</Text>

          {/* 정렬 드롭다운 */}
          <View>
            <TouchableOpacity
              onPress={() => setShowDropdown(!showDropdown)}
              className="flex-row items-center"
            >
              <Text className="text-sm text-[#00801A] mr-1">{currentLabel}</Text>
              <Text className="text-[#00801A]">{showDropdown ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {/* 드롭다운 메뉴 */}
            {showDropdown && (
              <View className="absolute top-8 right-0 bg-white rounded-lg shadow-lg py-2 w-24 z-10">
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => {
                      onSortChange(option.value);
                      setShowDropdown(false);
                    }}
                    className="py-2 px-4"
                  >
                    <Text className={`text-sm ${
                      sortBy === option.value ? 'text-[#00801A] font-bold' : 'text-gray-700'
                    }`}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
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
              onPress={() => onRecordPress(item.id)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
