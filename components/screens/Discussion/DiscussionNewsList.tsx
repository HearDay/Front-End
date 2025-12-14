import { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { DiscussionNewsListProps } from "../../../types/screens";
import { DiscussionNewsCard } from "./DiscussionNewsCard";

export function DiscussionNewsList({
  news,
  sortBy,
  onSortChange,
  onNewsPress,
}: DiscussionNewsListProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const sortOptions = [
    { value: "latest", label: "최신순" },
    { value: "oldest", label: "오래된순" },
  ] as const;

  const currentLabel =
    sortOptions.find((opt) => opt.value === sortBy)?.label || "최신순";

  // id 기준 중복 제거
  const uniqueNews = useMemo(() => {
    const map = new Map<string, typeof news[number]>();
    news.forEach((item) => {
      map.set(String(item.id), item);
    });
    return Array.from(map.values());
  }, [news]);

  return (
    <View className="flex-1 px-4">
      {/* 헤더 */}
      <View className="pb-3">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-[16px] sm:text-[17px] lg:text-[18px] font-semibold">
            내가 본 뉴스
          </Text>

          {/* 정렬 드롭다운 */}
          <View>
            <TouchableOpacity
              onPress={() => setShowDropdown((prev) => !prev)}
              className="flex-row items-center"
            >
              <Text className="text-[13px] sm:text-[14px] lg:text-[15px] text-[#00801A] mr-1">
                {currentLabel}
              </Text>
              <Text className="text-[#00801A]">
                {showDropdown ? "▲" : "▼"}
              </Text>
            </TouchableOpacity>

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
                    <Text
                      className={`text-[13px] sm:text-[14px] lg:text-[15px] ${
                        sortBy === option.value
                          ? "text-[#00801A] font-bold"
                          : "text-gray-700"
                      }`}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* 언더라인 */}
        <View className="h-px bg-[#00801A]" />
      </View>

      {/* 뉴스 리스트 */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        {uniqueNews.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-[14px] sm:text-[15px] lg:text-[16px] text-gray-400">
              본 뉴스가 없습니다
            </Text>
          </View>
        ) : (
          uniqueNews.map((item) => (
            <DiscussionNewsCard
              key={String(item.id)}
              news={item}
              onPress={() => onNewsPress(item.id)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
