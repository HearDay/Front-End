import { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { DiscussionNewsListProps } from '../../../types/screens'
import { DiscussionNewsCard } from './DiscussionNewsCard'

export function DiscussionNewsList({ 
  news, 
  sortBy, 
  onSortChange, 
  onNewsPress 
}: DiscussionNewsListProps) {
  const [showDropdown, setShowDropdown] = useState(false)

  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'popular', label: '인기순' },
    { value: 'views', label: '조회순' },
  ] as const

  const currentLabel = sortOptions.find(opt => opt.value === sortBy)?.label || '최신순'

  return (
    <View className="flex-1">
      {/* 헤더 */}
      <View className="flex-row justify-between items-center px-4 py-3">
        <Text className="text-lg font-bold">내가 본 뉴스</Text>

        {/* 정렬 드롭다운 */}
        <View>
          <TouchableOpacity
            onPress={() => setShowDropdown(!showDropdown)}
            className="flex-row items-center"
          >
            <Text className="text-sm text-green-600 mr-1">{currentLabel}</Text>
            <Text className="text-green-600">{showDropdown ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {/* 드롭다운 메뉴 */}
          {showDropdown && (
            <View className="absolute top-8 right-0 bg-white rounded-lg shadow-lg py-2 w-24 z-10">
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => {
                    onSortChange(option.value);
                    setShowDropdown(false)
                  }}
                  className="py-2 px-4"
                >
                  <Text className={`text-sm ${
                    sortBy === option.value ? 'text-green-600 font-bold' : 'text-gray-700'
                  }`}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* 뉴스 리스트 */}
      <ScrollView className="flex-1">
        {news.length === 0 ? (
        <View className="flex-1 items-center justify-center py-20">
        <Text className="text-gray-400 text-base">본 뉴스가 없습니다</Text>
        </View>
        ) : (
        news.map((item) => (
          <DiscussionNewsCard
            key={item.id}
            news={item}
            onPress={() => onNewsPress(item.id)}
          />
        ))
        )}
        </ScrollView>
    </View>
    )
}