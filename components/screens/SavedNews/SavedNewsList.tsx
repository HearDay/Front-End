import { ScrollView, Text, View } from 'react-native';
import { SavedNewsListProps } from '../../../types/screens';
import { SavedNewsCard } from './SavedNewsCard';

export const SavedNewsList = ({
  newsList,
  onNewsPress,
  onDelete,
}: SavedNewsListProps) => {
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
    <ScrollView className="flex-1 px-4 pt-4">
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
}