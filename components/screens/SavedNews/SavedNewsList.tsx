import { memo } from 'react'; // 추가: 성능 최적화
import { ScrollView, Text, View } from 'react-native'
import { SavedNewsListProps } from '../../../types/screens'
import { SavedNewsCard } from './SavedNewsCard'

// 개선: memo로 컴포넌트 감싸기
// 이유: newsList, onNewsPress, onDelete가 변하지 않으면 리렌더링 스킵
export const SavedNewsList = memo(function SavedNewsList({
  newsList,
  onNewsPress,
  onDelete,
}: SavedNewsListProps) {
  // 빈 상태 처리 
  if (newsList.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-400">
          저장된 뉴스가 없습니다
        </Text>
      </View>
    )
  }

  return (
    <ScrollView 
      className="flex-1 px-4 pt-4"
      showsVerticalScrollIndicator={false} // 추가: 스크롤바 숨기기
      // 이유: 더 깔끔한 UI
    >
      {newsList.map((news) => (
        <SavedNewsCard
          key={news.id}
          news={news}
          onPress={() => onNewsPress(news.id)}
          onDelete={onDelete}
        />
      ))}
    </ScrollView>
  )
})