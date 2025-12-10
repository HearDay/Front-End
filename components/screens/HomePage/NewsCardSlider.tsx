import NewsCard from "@/components/common/NewsCard";
import { RecommendArticle } from "@/types/auth/recommendNews";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface NewsCardSliderProps {
  updateTime?: string;
  articles?: RecommendArticle[];
}

const NewsCardSlider = ({ updateTime, articles = [] }: NewsCardSliderProps) => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const dummyArticles: RecommendArticle[] = [
    {
      id: 477,
      title: "IT 스타트업 CES 수상 쾌거…리빌더AI·망고슬래브 혁신상",
      origin_link:
        "https://n.news.naver.com/mnews/article/001/0015729694?sid=101",
      image_url:
        "https://imgnews.pstatic.net/image/001/2025/11/07/AKR20251107063800017_02_i_P4_20251107110227368.jpg?type=w860",
    },
    {
      id: 474,
      title: "국힘, 10·15 대책 '9월 통계' 누락에 \"통계조작 정치…김윤덕 사퇴\"",
      origin_link:
        "https://n.news.naver.com/mnews/article/421/0008592232?sid=100",
      image_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYwS1K1n_IGtt8OOFdNdVMzzGlbZkuEn0tcg&s",
    },
    {
      id: 491,
      title: "LG생활건강, LG트윈스 한국시리즈 V4 우승 기념 특별 프로모션",
      origin_link:
        "https://n.news.naver.com/mnews/article/421/0008590472?sid=101",
      image_url:
        "https://imgnews.pstatic.net/image/421/2025/11/07/0008590472_001_20251107091912044.jpg?type=w860",
    },
    {
      id: 476,
      title:
        "애플, 아이폰 17 내구성·셀룰러 문제로 난리인데 침묵 일관 [1일IT템]",
      origin_link:
        "https://n.news.naver.com/mnews/article/014/0005431478?sid=105",
      image_url:
        "https://imgnews.pstatic.net/image/014/2025/11/08/0005431478_001_20251108094633029.jpg?type=w860",
    },
    {
      id: 488,
      title: "LG생활건강, LG트윈스 4번째 통합우승 기념 프로모션",
      origin_link:
        "https://n.news.naver.com/mnews/article/001/0015729386?sid=101",
      image_url:
        "https://imgnews.pstatic.net/image/001/2025/11/07/AKR20251107039400030_01_i_P4_20251107092920288.jpg?type=w860",
    },
  ];

  const displayArticles = articles.length > 0 ? articles : dummyArticles;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setActiveIndex(index);
  };

  const handleNewsPress = async (articleId: number) => {
    console.log("[NewsCardSlider] 기사 선택 - Article ID:", articleId);

    const { setRecommendedArticles, startRecommendedPlayback } = await import(
      "@/stores/newsPlaybackStore"
    ).then((m) => m.useNewsPlaybackStore.getState());

    const playbackArticles = displayArticles.map((article) => ({
      id: String(article.id),
      title: article.title,
      imageUrl: article.image_url,
      summary: article.origin_link,
      category: "전체",
    }));

    setRecommendedArticles(playbackArticles);

    const clickedIndex = displayArticles.findIndex(
      (article) => article.id === articleId
    );

    startRecommendedPlayback(clickedIndex);

    router.push(`/newsplayer/${articleId}?from=home&mode=recommended`);
  };

  return (
    <View className="items-center mt-4">
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {displayArticles.map((item) => (
          <View key={item.id} style={{ width }}>
            <TouchableOpacity
              onPress={() => handleNewsPress(item.id)}
              activeOpacity={0.8}
            >
              <NewsCard
                title={item.title}
                description={item.origin_link}
                imageUrl={item.image_url}
                background="green"
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* 인디케이터 */}
      <View className="relative w-full">
        <View className="absolute left-0 mt-1 right-0 items-center">
          <View className="flex-row">
            {displayArticles.map((_, index) => (
              <View
                key={index}
                className={`w-2 h-2 mx-1 rounded-full ${
                  index === activeIndex ? "bg-green-700" : "bg-[#B3D7BB]"
                }`}
              />
            ))}
          </View>
        </View>

        {updateTime && (
          <Text className="absolute right-8 text-gray-500 text-xs whitespace-nowrap">
            {updateTime} 업데이트
          </Text>
        )}

        <View style={{ height: 30 }} />
      </View>
    </View>
  );
};

export default NewsCardSlider;
