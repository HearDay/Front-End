import { CategoryChipGroup } from "@/components/common";
import HeroSection from "@/components/screens/HomePage/HeroSection";
import NewsCardList from "@/components/screens/HomePage/NewsCardList";
import NewsCardSlider from "@/components/screens/HomePage/NewsCardSlider";
import { DUMMY_TODAY_NEWS } from "@/components/screens/HomePage/TodayNewsDummy";
import { TodayNewsModal } from "@/components/screens/HomePage/TodayNewsModal";
import { newsService } from "@/services";
import { fetchCategoryRecommendNews } from "@/services/api/categoryRecommendNews";
import { fetchRecommendNews } from "@/services/api/recommendNews";
import { useCategoryStore } from "@/services/utils/categoryStore";
import { RecommendArticle } from "@/types/auth/recommendNews";
import { useLocalSearchParams, usePathname, useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { ScrollView, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function Index() {
  // Zustand
  const {
    selectedCategory,
    categoryArticles,
    scrollX,
    setSelectedCategory,
    setCategoryArticles,
    setScrollX,
    clearCategory,
  } = useCategoryStore();

  // 카테고리 매핑
  const categoryMap: Record<string, string> = {
    "경제": "경제",
    "방송 / 연예": "방송_연예",
    "IT": "IT",
    "쇼핑": "쇼핑",
    "생활": "생활",
    "해외": "해외",
    "스포츠": "스포츠",
    "정치": "정치",
  };

  const categories = Object.keys(categoryMap);

  // 유저 정보 (develop 브랜치 코드)
  const [nickname, setNickname] = useState("");
  const [level, setLevel] = useState(1);
  const [updateTime, setUpdateTime] = useState("");
  const [recommendedArticles, setRecommendedArticles] = useState<
    RecommendArticle[]
  >([]);

  // 오늘의 뉴스 관련 state (내 작업)
  const [showTodayNewsModal, setShowTodayNewsModal] = useState(false);
  const [todayNewsItems, setTodayNewsItems] = useState<any[]>([]);
  const [completedNewsId, setCompletedNewsId] = useState<string | null>(null);
  const hasShownModal = useRef(false);
  const isFirstMount = useRef(true);

  const offset = useSharedValue(selectedCategory ? 1 : 0);
  const pathname = usePathname();
  const router = useRouter();
  const { showTodayNews, newsId, from } = useLocalSearchParams<{ showTodayNews?: string; newsId?: string; from?: string }>();

  // 유저 정보 로드
  useEffect(() => {
    const publicRoutes = [
      "/LoginPage",
      "/SignUpPage",
      "/CertificationPage",
      "/ResetPasswordPage",
      "/SelectCategoryPage",
      "/KakaoLoginView",
    ];
    if (publicRoutes.includes(pathname)) return;

    const loadUserInfo = async () => {
      try {
        const res = await fetchRecommendNews();
        if (res.success) {
          setNickname(res.data.nickname);
          setLevel(res.data.level);
          setUpdateTime(res.data.updateTime);
          setRecommendedArticles(res.data.recommendedArticles);
        }
      } catch (err) {
        console.error("유저 정보 로드 실패:", err);
      }
    };

    loadUserInfo();
  }, [pathname]);

  // 오늘의 뉴스 데이터 로드 (내 작업)
  useEffect(() => {
    const loadTodayNews = async () => {
      try {
        const articles = await newsService.getArticles(0, 5);
        const news = articles.map((article) => ({
          id: article.id.toString(),
          title: article.title,
          imageUrl: article.imageUrl,
          summary: article.description,
          category: article.category,
        }));
        setTodayNewsItems(news);
      } catch (error) {
        console.error("오늘의 뉴스 로드 실패:", error);
        setTodayNewsItems(DUMMY_TODAY_NEWS);
      }
    };

    loadTodayNews();
  }, []);

  // 오늘의 뉴스에서 돌아올 때만 모달 표시 (내 작업)
  useEffect(() => {
    if (showTodayNews === 'true' && from === 'todaynews') {
      setShowTodayNewsModal(true);
      if (newsId) {
        setCompletedNewsId(newsId);
      }
      router.setParams({ showTodayNews: undefined, from: undefined });
    }
  }, [showTodayNews, newsId, from, router]);

  // 맨 처음 앱 진입 시에만 모달 표시 (내 작업)
  useFocusEffect(
    useCallback(() => {
      const publicRoutes = [
        "/LoginPage",
        "/SignUpPage",
        "/CertificationPage",
        "/ResetPasswordPage",
        "/SelectCategoryPage",
        "/KakaoLoginView",
      ];

      if (hasShownModal.current || showTodayNews || publicRoutes.includes(pathname)) {
        return;
      }

      if (isFirstMount.current && pathname === "/") {
        isFirstMount.current = false;
        setTimeout(() => {
          setShowTodayNewsModal(true);
          hasShownModal.current = true;
        }, 500);
      }
    }, [showTodayNews, pathname])
  );

  // 카테고리 선택 시 (develop 브랜치 코드)
  const handleSelectCategory = async (category: string) => {
    setSelectedCategory(category);
    offset.value = withTiming(1, { duration: 600 });

    try {
      const backendCategory = categoryMap[category] || category;
      const res = await fetchCategoryRecommendNews(backendCategory);

      if (res.success) {
        setCategoryArticles(res.data);
      }
    } catch (err) {
      console.error("카테고리별 뉴스 로드 실패:", err);
    }
  };

  // 뒤로가기 (홈으로)
  const handleBackToHome = () => {
    clearCategory();
    offset.value = withTiming(0, { duration: 600 });
  };

  // 애니메이션 스타일
  const listStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming((1 - offset.value) * 50) }],
    opacity: withTiming(offset.value),
  }));

  const handleTodayNewsPress = () => {
    setShowTodayNewsModal(true);
  };

  return (
    <View className="flex-1 bg-white">
      <HeroSection
        offset={offset}
        userLevel={level}
        onTodayNewsPress={handleTodayNewsPress}
      />

      <TodayNewsModal
        visible={showTodayNewsModal}
        onClose={() => {
          setTimeout(() => {
            setShowTodayNewsModal(false);
            setCompletedNewsId(null);
          }, 0);
        }}
        newsItems={todayNewsItems.length > 0 ? todayNewsItems : DUMMY_TODAY_NEWS}
        userInfo={{ age: "20", gender: "여성" }}
        completedNewsId={completedNewsId}
      />

      {selectedCategory ? (
        <Animated.View style={[{ flex: 1 }, listStyle]}>
          <View className="flex-row justify-between items-center px-6 mt-7 mb-2">
            <Text className="text-[17px] font-extrabold text-[#002C14]">
              {selectedCategory} 관련 추천 뉴스
            </Text>

            <Text
              className="text-[14px] text-gray-600 pr-2"
              onPress={handleBackToHome}
            >
              돌아가기
            </Text>
          </View>

          <View className="mb-4 mt-3">
            <CategoryChipGroup
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              scrollX={scrollX}
              onScrollXChange={setScrollX}
            />
          </View>

          <View style={{ flex: 1 }}>
            <ScrollView
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 50 }}
            >
              <NewsCardList
                background="green"
                articles={categoryArticles}
                onPressArticle={(id) =>
                  router.push(`/newsplayer/${id}?from=home`)
                }
              />
            </ScrollView>
          </View>
        </Animated.View>
      ) : (
        <>
          <View className="px-6 mt-4">
            <Text className="text-[16px] text-right font-extrabold text-[#002C14] mt-2 mr-2">
              {nickname
                ? `${nickname}님이 좋아할 만한 오늘의 추천 뉴스`
                : "오늘의 추천 뉴스"}
            </Text>
          </View>

          <NewsCardSlider updateTime={updateTime} articles={recommendedArticles} />

          <View className="px-6 mt-4">
            <Text className="text-[16px] text-right font-extrabold text-[#002C14] mt-2 mb-4 mr-2">
              카테고리별로 추천 뉴스 골라보기
            </Text>
          </View>

          <CategoryChipGroup
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            scrollX={scrollX}
            onScrollXChange={setScrollX}
          />
        </>
      )}
    </View>
  );
}
