import { useSavedNewsScroll } from '@/contexts/SavedNewsScrollContext';
import { forwardRef, memo, useImperativeHandle, useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, View } from 'react-native';
import { SavedNewsListProps } from '../../../types/screens';
import { SavedNewsCard } from './SavedNewsCard';

export interface SavedNewsListRef {
  scrollToPosition: (y: number) => void;
}

export const SavedNewsList = memo(forwardRef<SavedNewsListRef, SavedNewsListProps>(function SavedNewsList({
  newsList,
  onNewsPress,
  onDelete,
}, ref) {
  const scrollViewRef = useRef<ScrollView>(null);
  const { setScrollPosition } = useSavedNewsScroll();

  useImperativeHandle(ref, () => ({
    scrollToPosition: (y: number) => {
      scrollViewRef.current?.scrollTo({ y, animated: false });
    },
  }));

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    setScrollPosition(yOffset);
  };

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
      ref={scrollViewRef}
      className="flex-1 px-4 pt-4"
      showsVerticalScrollIndicator={false}
      onScroll={handleScroll}
      scrollEventThrottle={16}
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
}))
