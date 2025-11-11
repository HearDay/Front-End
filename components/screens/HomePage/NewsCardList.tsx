import NewsCard from "@/components/common/NewsCard";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

type BackgroundVariant = "green" | "white";

interface NewsCardListProps {
  background?: BackgroundVariant;
  articles?: any[];
}

const NewsCardList = ({ background = "white", articles = [] }: NewsCardListProps) => {
  const router = useRouter();

  const handleNewsPress = (articleId: string) => {
    router.push(`/newsplayer/${articleId}`);
  };

  if (!articles || articles.length === 0) {
    return (
      <View className="flex-1 items-center justify-center mt-10">
        <Text className="text-gray-500">검색 결과가 없습니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
    >
      <View className="mt-4">
        {articles.map((item) => {
          // 필드 통합 처리
          const imageUrl = item.imageUrl || item.image_url || "";
          const title = item.title || "(제목 없음)";
          const description =
            item.description || item.origin_link || item.originLink || "";

          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleNewsPress(item.id)}
              activeOpacity={0.8}
            >
              <NewsCard
                title={title}
                description={description}
                imageUrl={imageUrl}
                background={background}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default NewsCardList;
