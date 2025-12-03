import NewsCard from "@/components/common/NewsCard";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type BackgroundVariant = "green" | "white";

interface NewsCardListProps {
  background?: BackgroundVariant;
  articles?: any[];
  onPressArticle?: (id: string) => void;
}

const NewsCardList = ({
  background = "white",
  articles = [],
  onPressArticle,
}: NewsCardListProps) => {
  const router = useRouter();

  const handleNewsPress = (articleId: string) => {
    console.log('기사 선택 - Article ID:', articleId);
    if (onPressArticle) {
      onPressArticle(articleId);
    } else {
      router.push(`/newsplayer/${articleId}`);
    }
  };

  if (!articles || articles.length === 0) {
    return (
      <View className="flex-1 items-center justify-center mt-10">
        <Text className="text-gray-500">검색 결과가 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 20, paddingBottom: 20, marginTop: 16 }}>
      {articles.map((item) => {
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
  );
};

export default NewsCardList;
