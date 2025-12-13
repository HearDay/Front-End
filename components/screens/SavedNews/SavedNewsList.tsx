import { useSavedNewsScroll } from '@/contexts/SavedNewsScrollContext';
import { forwardRef, memo, useCallback, useImperativeHandle, useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, View } from 'react-native';
import { SavedNewsListProps } from '../../../types/screens';
import { SavedNewsCard, SavedNewsCardRef } from './SavedNewsCard';

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
  const cardRefsMap = useRef<Map<string, SavedNewsCardRef>>(new Map());
  const currentOpenedId = useRef<string | null>(null);

  useImperativeHandle(ref, () => ({
    scrollToPosition: (y: number) => {
      scrollViewRef.current?.scrollTo({ y, animated: false });
    },
  }));

  const handleSwipeableOpen = useCallback((newsId: string) => {
    // 이전에 열린 카드가 있고, 다른 카드를 열려고 하면 닫기
    if (currentOpenedId.current && currentOpenedId.current !== newsId) {
      const prevCardRef = cardRefsMap.current.get(currentOpenedId.current);
      if (prevCardRef) {
        prevCardRef.close();
      }
    }
    // 현재 열린 카드 ID 저장
    currentOpenedId.current = newsId;
  }, []);

  const handleCardTouch = useCallback((newsId: string) => {
    // 터치하는 순간 이전에 열린 카드가 있으면 닫기
    if (currentOpenedId.current && currentOpenedId.current !== newsId) {
      const prevCardRef = cardRefsMap.current.get(currentOpenedId.current);
      if (prevCardRef) {
        prevCardRef.close();
      }
      currentOpenedId.current = null;
    }
  }, []);

  const setCardRef = useCallback((newsId: string, ref: SavedNewsCardRef | null) => {
    if (ref) {
      cardRefsMap.current.set(newsId, ref);
    } else {
      cardRefsMap.current.delete(newsId);
    }
  }, []);

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
          ref={(ref) => setCardRef(news.id, ref)}
          news={news}
          onPress={() => onNewsPress(news.id)}
          onDelete={onDelete}
          onSwipeableOpen={() => handleSwipeableOpen(news.id)}
          onCardTouch={handleCardTouch}
        />
      ))}
    </ScrollView>
  )
}))
