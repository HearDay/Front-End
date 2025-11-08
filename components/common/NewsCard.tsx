import React from "react";
import { Image, Text, View } from "react-native";

type BackgroundVariant = "green" | "white";

interface NewsCardProps {
  title: string;
  description: string;
  imageUrl?: any; //
  background?: BackgroundVariant;
}

const NewsCard = ({
  title,
  description,
  imageUrl,
  background = "white",
}: NewsCardProps) => {
  const backgroundColor = background === "green" ? "#F1F6EF" : "#FFFFFF";

  //
  const imageSource =
    typeof imageUrl === "string"
      ? { uri: imageUrl }
      : imageUrl
      ? imageUrl
      : require("../../my-expo-app/assets/images/DefaultCard.png");

  return (
    <View
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
        borderRadius: 16,
      }}
      className="self-center mb-5"
    >
      <View
        className="flex-row items-center w-[350px] h-[106px] px-4 py-3 rounded-2xl overflow-hidden"
        style={{ backgroundColor }}
      >
        <View
          className="mr-4 rounded-md overflow-hidden"
          style={{
            width: 148,
            aspectRatio: 148 / 83,
          }}
        >
          <Image
            source={imageSource} 
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
            className="text-[13px] text-[#4B5563] leading-snug"
            numberOfLines={2}
          >
            {description}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default NewsCard;
