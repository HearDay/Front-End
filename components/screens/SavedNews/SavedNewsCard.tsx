import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { SavedNewsCardProps } from '../../../types/screens';

export interface SavedNewsCardRef {
  close: () => void;
}

export const SavedNewsCard = forwardRef<SavedNewsCardRef, SavedNewsCardProps>(
  function SavedNewsCard({ news, onPress, onDelete, onSwipeableOpen, onCardTouch }, ref) {
    const [imageError, setImageError] = useState(false);
    const swipeableRef = useRef<Swipeable>(null);

    useImperativeHandle(ref, () => ({
      close: () => {
        swipeableRef.current?.close();
      },
    }));

    const handlePressIn = () => {
      // 터치하는 순간 이전 카드 닫기
      if (onCardTouch) {
        onCardTouch(news.id);
      }
    };

    // 우측 스와이프 시 휴지통 버튼 렌더링
    const renderRightActions = () => {
      return (
        <Pressable
          onPress={() => onDelete(news.id)}
          className="bg-[#D32F2F] justify-center items-center rounded-r-2xl"
          style={{ width: 80 }}
        >
          <Image
            source={require('../../../my-expo-app/assets/images/trash.png')}
            style={{ width: 32, height: 32 }}
            resizeMode="contain"
          />
        </Pressable>
      );
    };

    return (
      <View className="mb-3">
        <Swipeable
          ref={swipeableRef}
          renderRightActions={renderRightActions}
          overshootRight={false}
          friction={2}
          onSwipeableOpen={() => onSwipeableOpen?.(news.id)}
        >
        <View className="bg-[#F5FCE9] rounded-2xl shadow-md overflow-hidden border border-gray-500/10">
          <Pressable
            className="flex-row p-4"
            onPress={onPress}
            onPressIn={handlePressIn}
          >
            {imageError ? (
              <View className="w-40 h-24 rounded-xl bg-gray-200" />
            ) : (
              <Image
                source={{ uri: news.imageUrl }}
                className="w-40 h-24 rounded-xl"
                resizeMode="cover"
                onError={() => setImageError(true)}
              />
            )}

            {/* 내용 */}
            <View className="flex-1 ml-4">
              {/* 제목 */}
              <Text className="text-base font-semibold mb-1" numberOfLines={2}>
                {news.title}
              </Text>

              {/* 요약 */}
              <Text className="text-sm text-gray-600" numberOfLines={2}>
                {news.summary}
              </Text>
            </View>
          </Pressable>
        </View>
      </Swipeable>
    </View>
  );
});