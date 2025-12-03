
import { CategoryChipGroup } from "@/components/common";
import HeroSection from "@/components/screens/HomePage/HeroSection";
import NewsCardList from "@/components/screens/HomePage/NewsCardList";
import NewsCardSlider from "@/components/screens/HomePage/NewsCardSlider";
import { TodayNewsModal } from "@/components/screens/HomePage/TodayNewsModal";
import { fetchCategoryRecommendNews } from "@/services/api/categoryRecommendNews";
import { fetchRecommendNews } from "@/services/api/recommendNews";
import { todayNewsService } from "@/services/api/todayNews";
import { useCategoryStore } from "@/services/utils/categoryStore";
import { useTodayNewsStore } from "@/stores/todayNewsStore";
import { RecommendArticle } from "@/types/auth/recommendNews";
import { useFocusEffect, usePathname, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
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

  // Zustand - 오늘의 뉴스 (완전히 Zustand로 관리)
  const {
    showModal,
    hasShownInitialModal,
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
  const [showSunIcon, setShowSunIcon] = useState(!selectedCategory); // 해 아이콘 표시 여부

  const offset = useSharedValue(selectedCategory ? 1 : 0);
  const pathname = usePathname();
  const router = useRouter();

  // 애니메이션 완료 감지
  useDerivedValue(() => {
    // offset이 0에 가까우면 (홈 화면) 해 아이콘 표시
    if (offset.value < 0.1 && !selectedCategory) {
      runOnJS(setShowSunIcon)(true);
    } else {
      runOnJS(setShowSunIcon)(false);
    }
  });

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
      }
    };

    loadUserInfo();
  }, [pathname]);

  // 오늘의 뉴스 데이터 및 사용자 정보 로드
  useEffect(() => {
    const loadTodayNewsAndUserInfo = async () => {
      try {

        // 로그인 시 userDismissed 초기화 (매번 팝업 표시를 위해)
        useTodayNewsStore.getState().setUserDismissed(false);

        // 맞춤 기사 가져오기
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

          // 최초 1회만 로그인 팝업 표시 (Zustand에서 관리)
          if (!hasTriggeredInitialPopup) {
            setHasTriggeredInitialPopup(true);

            // hydration과 userDismissed 상태를 기다린 후 팝업 표시
            setTimeout(() => {
              const state = useTodayNewsStore.getState();
                _hasHydrated: state._hasHydrated,
                userDismissed: state.userDismissed,
              });

              if (!state.userDismissed) {
                setShowModal(true);
                setHasShownInitialModal(true);
              } else {
              }
            }, 800);
          }
        } else {
          setTodayNewsItems([]);
        }


        // 사용자 성별/나이 가져오기
        // const userDemographic = await todayNewsService.getUserDemographic();

        // const genderText = userDemographic.gender === "M" ? "남성" : "여성";
        // const ageText = Math.floor(userDemographic.age / 10) * 10;
        
        // 로컬 테스트를 위해 하드코딩된 값 사용 (원하는 값으로 변경 가능)
        const genderText = "여성"; // "남성" 또는 "여성"
        const ageText = 20; // 원하는 나이대 (예: 10, 20, 30)

        setUserGender(genderText);
        setUserAge(ageText.toString());

      } catch (error) {
        if (error?.response) {
        }
      }
    };

    loadTodayNewsAndUserInfo();
  }, []);

  // 백버튼으로 돌아왔을 때 모달 표시 (오늘의 뉴스 카드에서 돌아온 경우만)
  useFocusEffect(
    useCallback(() => {

      if (_hasHydrated && pendingReturn && todayNewsItems.length > 0) {
        checkAndShowOnReturn();
      } else {
      }
    }, [_hasHydrated, pendingReturn, todayNewsItems.length, checkAndShowOnReturn, showModal, userDismissed])
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

    // 해 아이콘을 직접 클릭한 경우이므로 userDismissed를 false로 리셋
    const { setUserDismissed, setLastViewedNewsId } = useTodayNewsStore.getState();
    setUserDismissed(false);

    // lastViewedNewsId를 null로 초기화하여 첫 번째 카드부터 보이도록
    setLastViewedNewsId(null);

    setShowModal(true);
  };

  const handleNewsCardPress = async (newsId: string) => {

    // 연속 재생 설정
    const { setRecommendedArticles, startRecommendedPlayback } = await import('@/stores/newsPlaybackStore').then(m => m.useNewsPlaybackStore.getState());

    // 추천 기사 5개 설정
    const recommendedArticles = todayNewsItems.map(item => ({
      id: item.id,
      title: item.title,
      imageUrl: item.imageUrl,
      summary: item.summary,
      category: item.category,
    }));

    setRecommendedArticles(recommendedArticles);

    // 클릭한 기사의 인덱스 찾기
    const clickedIndex = todayNewsItems.findIndex(item => item.id === newsId);

    // 추천 기사 재생 시작
    startRecommendedPlayback(clickedIndex);

    // 라우팅
    router.push(`/newsplayer/${newsId}?mode=recommended&from=todaynews`);
  };

  return (
    <View className="flex-1 bg-white">
      <HeroSection
        offset={offset}
        userLevel={level}
        onTodayNewsPress={handleTodayNewsPress}
      />

      {/* 해 아이콘 - 애니메이션 완료 후에만 표시 */}
      {showSunIcon && (
        <TouchableOpacity
          onPress={handleTodayNewsPress}
          style={{
            position: 'absolute',
            top: 100,
            right: 10,
            width: 80,
            height: 80,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            elevation: 9999,
          }}
          activeOpacity={0.7}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Image
            source={require("../../my-expo-app/assets/images/Sun.png")}
            style={{ width: 60, height: 60, resizeMode: "contain" }}
          />
          <Text style={{ fontSize: 8, color: '#FBFFD3', fontWeight: '600' }}>
            TODAY'S NEWS
          </Text>
        </TouchableOpacity>
      )}

      <TodayNewsModal
        visible={showModal}
        onClose={dismissModal}
        onNewsCardPress={handleNewsCardPress}
        newsItems={todayNewsItems}
        userInfo={{ age: userAge, gender: userGender }}
        completedNewsIds={completedNewsIds}
        lastViewedNewsId={lastViewedNewsId}
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
                onPressArticle={async (id) => {

                  // 연속 재생 설정
                  const { setRecommendedArticles, startRecommendedPlayback } = await import('@/stores/newsPlaybackStore').then(m => m.useNewsPlaybackStore.getState());

                  // 카테고리 기사들을 추천 기사로 설정 (최대 100개)
                  const playbackArticles = categoryArticles.slice(0, 100).map(article => ({
                    id: String(article.id),
                    title: article.title,
                    imageUrl: article.imageUrl,
                    summary: article.description,
                    category: article.category,
                  }));

                  setRecommendedArticles(playbackArticles);

                  // 클릭한 기사의 인덱스 찾기
                  const clickedIndex = categoryArticles.findIndex(article => String(article.id) === id);

                  // 연속 재생 시작
                  startRecommendedPlayback(clickedIndex);

                  router.push(`/newsplayer/${id}?from=home&mode=recommended`);
                }}
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
