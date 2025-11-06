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
        {articles.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleNewsPress(item.id)}
            activeOpacity={0.8}
          >
            <NewsCard
              title={item.title}
              description={item.description}
              image={item.imageUrl}
              background={background}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default NewsCardList;
