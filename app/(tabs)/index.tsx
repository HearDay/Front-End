import { CategoryChipGroup } from "@/components/common";
import HeroSection from "@/components/screens/HomePage/HeroSection";
import NewsCardSlider from "@/components/screens/HomePage/NewsCardSlider";
import { TodayNewsModal } from "@/components/screens/HomePage/TodayNewsModal";
import { useAuthStore } from "@/services/api/authStore";
import { fetchCategoryRecommendNews } from "@/services/api/categoryRecommendNews";
import { fetchRecommendNews } from "@/services/api/recommendNews";
import { todayNewsService } from "@/services/api/todayNews";
import { useCategoryStore } from "@/services/utils/categoryStore";
import { useTodayNewsStore } from "@/stores/todayNewsStore";
import { RecommendArticle } from "@/types/auth/recommendNews";
import { useFocusEffect, usePathname, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function Index() {
  // auth 상태
  const isAuthReady = useAuthStore((s) => s.isAuthReady);

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
    경제: "경제",
    "방송 / 연예": "방송_연예",
    IT: "IT",
    쇼핑: "쇼핑",
    생활: "생활",
    해외: "해외",
    스포츠: "스포츠",
    정치: "정치",
  };

  const categories = Object.keys(categoryMap);

  // 유저 정보
  const [nickname, setNickname] = useState("");
  const [level, setLevel] = useState(1);
  const [updateTime, setUpdateTime] = useState("");
  const [recommendedArticles, setRecommendedArticles] = useState<
    RecommendArticle[]
  >([]);

  // 오늘의 뉴스 Zustand
  const {
    showModal,
    completedNewsIds,
    lastViewedNewsId,
    _hasHydrated,
    pendingReturn,
    userDismissed,
    hasTriggeredInitialPopup,
    setShowModal,
    setHasShownInitialModal,
    dismissModal,
    checkAndShowOnReturn,
    setHasTriggeredInitialPopup,
  } = useTodayNewsStore();

  const [todayNewsItems, setTodayNewsItems] = useState<any[]>([]);
  const [userGender, setUserGender] = useState<string>("");
  const [userAge, setUserAge] = useState<string>("");

  const [showSunIcon, setShowSunIcon] = useState(!selectedCategory);
  const offset = useSharedValue(selectedCategory ? 1 : 0);

  const pathname = usePathname();
  const router = useRouter();

  // 애니메이션 완료 감지
  useDerivedValue(() => {
    if (offset.value < 0.1 && !selectedCategory) {
      runOnJS(setShowSunIcon)(true);
    } else {
      runOnJS(setShowSunIcon)(false);
    }
  });

  /**
   * 유저 기본 정보 로드
   */
  useEffect(() => {
    if (!isAuthReady) return;

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
  }, [pathname, isAuthReady]);

  /**
   * 오늘의 뉴스 로드
   */
  useEffect(() => {
    if (!isAuthReady) return;

    const loadTodayNews = async () => {
      try {
        useTodayNewsStore.getState().setUserDismissed(false);

        const articles = await todayNewsService.getTopByDemographic();

        if (articles && articles.length > 0) {
          const news = articles.map((article) => ({
            id: article.id.toString(),
            title: article.title,
            imageUrl: article.imageUrl,
            summary: article.description,
            category: article.category,
          }));

          setTodayNewsItems(news);

          if (!hasTriggeredInitialPopup) {
            setHasTriggeredInitialPopup(true);

            setTimeout(() => {
              const state = useTodayNewsStore.getState();
              if (!state.userDismissed) {
                setShowModal(true);
                setHasShownInitialModal(true);
              }
            }, 800);
          }
        } else {
          setTodayNewsItems([]);
        }

        // 임시 사용자 정보
        setUserGender("여성");
        setUserAge("20");
      } catch (error) {
        console.error("오늘의 뉴스 로드 실패:", error);
      }
    };

    loadTodayNews();
  }, [isAuthReady]);

  /**
   * 백버튼 복귀 시 오늘의 뉴스 처리
   */
  useFocusEffect(
    useCallback(() => {
      if (_hasHydrated && pendingReturn && todayNewsItems.length > 0) {
        checkAndShowOnReturn();
      }
    }, [_hasHydrated, pendingReturn, todayNewsItems.length])
  );

  // 카테고리 선택
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

  const handleBackToHome = () => {
    clearCategory();
    offset.value = withTiming(0, { duration: 600 });
  };

  const listStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming((1 - offset.value) * 50) }],
    opacity: withTiming(offset.value),
  }));

  const handleTodayNewsPress = () => {
    useTodayNewsStore.getState().setUserDismissed(false);
    useTodayNewsStore.getState().setLastViewedNewsId(null);
    setShowModal(true);
  };

  return (
    <View className="flex-1 bg-white">
      <HeroSection
        offset={offset}
        userLevel={level}
        onTodayNewsPress={handleTodayNewsPress}
      />

      {/* 해 아이콘 */}
      {showSunIcon && (
        <TouchableOpacity
          onPress={handleTodayNewsPress}
          style={{
            position: "absolute",
            top: 100,
            right: 10,
            width: 80,
            height: 80,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <Image
            source={require("../../my-expo-app/assets/images/Sun.png")}
            style={{ width: 60, height: 60 }}
          />
          <Text style={{ fontSize: 8, color: "#FBFFD3", fontWeight: "600" }}>
            TODAY&apos;S NEWS
          </Text>
        </TouchableOpacity>
      )}

      <TodayNewsModal
        visible={showModal}
        onClose={dismissModal}
        onNewsCardPress={() => {}}
        newsItems={todayNewsItems}
        userInfo={{ age: userAge, gender: userGender }}
        completedNewsIds={completedNewsIds}
        lastViewedNewsId={lastViewedNewsId}
      />

      {/* 나머지 UI는 기존 그대로 */}
      {selectedCategory ? (
        <Animated.View style={[{ flex: 1 }, listStyle]}>
          {/* ... 기존 코드 그대로 ... */}
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
