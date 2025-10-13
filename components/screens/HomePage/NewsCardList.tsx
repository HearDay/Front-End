import NewsCard from "@/components/common/NewsCard";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { newsDummy } from "./NewsCardDummy";

type BackgroundVariant = "green" | "white";

interface NewsCardListProps {
  background?: BackgroundVariant;
}

const NewsCardList = ({ background = "white" }: NewsCardListProps) => {
  const router = useRouter();

  const handleNewsPress = (newsId: string) => {
    router.push(`/newsplayer/${newsId}`);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
    >
      <View className="mt-4">
        {newsDummy.map((item, index) => (
          <TouchableOpacity
          key={item.id}
          onPress={() => handleNewsPress(item.id)}
          activeOpacity={0.8}
          >
          <NewsCard 
            title={item.title}
            description={item.description}
            image={item.image}
            background={background} 
          />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default NewsCardList;
