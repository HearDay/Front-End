import React from "react";
import { Dimensions, Image, Text, View } from "react-native";

type BackgroundVariant = "green" | "white";

interface NewsCardProps {
  title: string;
  description: string;
  imageUrl?: any;
  background?: BackgroundVariant;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const CARD_MAX_WIDTH = 380;
const IMAGE_WIDTH_RATIO = 0.42; // 카드 대비 이미지 비율

const NewsCard = ({
  title,
  description,
  imageUrl,
  background = "white",
}: NewsCardProps) => {
  const backgroundColor = background === "green" ? "#F1F6EF" : "#FFFFFF";

  const imageSource =
    typeof imageUrl === "string"
      ? { uri: imageUrl }
      : imageUrl
      ? imageUrl
      : require("../../my-expo-app/assets/images/DefaultCard.png");

  const cardWidth = Math.min(SCREEN_WIDTH - 32, CARD_MAX_WIDTH);
  const imageWidth = cardWidth * IMAGE_WIDTH_RATIO;
  const imageHeight = imageWidth * (83 / 148);

  return (
    <View
      style={{
        width: cardWidth,
        alignSelf: "center",
        marginBottom: 13,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
        borderRadius: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 14,
          paddingVertical: 12,
          borderRadius: 16,
          backgroundColor,
        }}
      >
        {/* 이미지 */}
        <View
          style={{
            width: imageWidth,
            height: imageHeight,
            borderRadius: 8,
            overflow: "hidden",
            marginRight: 14,
          }}
        >
          <Image
            source={imageSource}
            resizeMode="cover"
            style={{ width: "100%", height: "100%" }}
          />
        </View>

        {/* 텍스트 */}
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "800",
              color: "#000",
              marginBottom: 4,
            }}
            numberOfLines={2}
          >
            {title}
          </Text>

          <Text
            style={{
              fontSize: 11,
              color: "#4B5563",
              lineHeight: 18,
            }}
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
