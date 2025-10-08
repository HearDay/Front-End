import React from "react";
import { Image, Text, View } from "react-native";

type BackgroundVariant = "green" | "white";

interface NewsCardProps {
  title: string;
  description: string;
  image: any;
  background?: BackgroundVariant;
}

const NewsCard = ({
  title,
  description,
  image,
  background = "white",
}: NewsCardProps) => {
  const backgroundColor = background === "green" ? "#F1F6EF" : "#FFFFFF";

  return (
    <View
      className="flex-row items-center w-[350px] h-[106px] px-4 py-3 mb-4 rounded-xl shadow-sm self-center overflow-hidden"
      style={{
        backgroundColor,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 1,
      }}
    >

      <View
        className="mr-4 rounded-md overflow-hidden"
        style={{
          width: 148,
          aspectRatio: 148 / 83,
        }}
      >
        <Image
          source={image}
          resizeMode="cover" 
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 8,
          }}
        />
      </View>

      <View className="flex-1 justify-center">
        <Text
          className="text-[15px] font-extrabold text-black mb-[3px]"
          numberOfLines={2}
        >
          {title}
        </Text>
        <Text
          className="text-[13px] text-gray-700 leading-snug"
          numberOfLines={2}
        >
          {description}
        </Text>
      </View>
    </View>
  );
};

export default NewsCard;
