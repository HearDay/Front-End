import React from "react";
import { ScrollView, View } from "react-native";
import NewsCard from "./NewsCard";
import { newsDummy } from "./NewsCardDummy";

type BackgroundVariant = "green" | "white";

interface NewsCardListProps {
  background?: BackgroundVariant;
}

const NewsCardList = ({ background = "white" }: NewsCardListProps) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
    >
      <View className="mt-4">
        {newsDummy.map((item, index) => (
          <NewsCard
            key={index}
            title={item.title}
            description={item.description}
            image={item.image}
            background={background} 
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default NewsCardList;
