import { CategoryChipGroup } from "@/components/common";
import HeroSection from "@/components/screens/HomePage/HeroSection";
import NewsCardList from "@/components/screens/HomePage/NewsCardList";
import NewsCardSlider from "@/components/screens/HomePage/NewsCardSlider";
import { TodayNewsModal } from "@/components/screens/HomePage/TodayNewsModal";
import { newsService } from "@/services";
import { fetchCategoryRecommendNews } from "@/services/api/categoryRecommendNews";
import { fetchRecommendNews } from "@/services/api/recommendNews";
import { todayNewsService } from "@/services/api/todayNews";
import { useCategoryStore } from "@/services/utils/categoryStore";
import { usePlaylistStore } from "@/stores/playlistStore";
import { useTodayNewsStore } from "@/stores/todayNewsStore";
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

  // Zustand - 오늘의 뉴스 (완전히 Zustand로 관리)
  const {
    showModal,
    hasShownInitialModal,
    completedNewsIds,
    lastViewedNewsId,
    _hasHydrated,
    pendingReturn,
    userDismissed,
    setShowModal,
    setHasShownInitialModal,
    dismissModal,
    onNewsCardClick,
    checkAndShowOnReturn,
  } = useTodayNewsStore();
  const [todayNewsItems, setTodayNewsItems] = useState<any[]>([]);
  const [userGender, setUserGender] = useState<string>("");
  const [userAge, setUserAge] = useState<string>("");

  const offset = useSharedValue(selectedCategory ? 1 : 0);
  const pathname = usePathname();
  const router = useRouter();

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

  // 오늘의 뉴스 데이터 및 사용자 정보 로드
  useEffect(() => {
    const loadTodayNewsAndUserInfo = async () => {
      try {
        console.log('========================================');
        console.log('오늘의 뉴스 API 호출 시작');
        console.log('========================================');

        // 로그인 시 userDismissed 초기화 (매번 팝업 표시를 위해)
        useTodayNewsStore.getState().setUserDismissed(false);
        console.log('[Index] userDismissed 초기화됨');

        // 맞춤 기사 가져오기
        const articles = await todayNewsService.getTopByDemographic();
        console.log('맞춤 기사 API 응답 성공');
        console.log('받아온 기사 개수:', articles?.length || 0);
        console.log('기사 데이터:', JSON.stringify(articles, null, 2));

        if (articles && articles.length > 0) {
          const news = articles.map((article) => ({
            id: article.id.toString(),
            title: article.title,
            imageUrl: article.imageUrl,
            summary: article.description,
            category: article.category,
          }));
          setTodayNewsItems(news);
          console.log('todayNewsItems 설정 완료:', news.length, '개');
        } else {
          console.log('받아온 기사가 없음 (빈 배열 또는 null)');
          setTodayNewsItems([]);
        }

        console.log('========================================');
        console.log('사용자 정보 API 호출 시작');
        console.log('========================================');

        // 사용자 성별/나이 가져오기
        // const userDemographic = await todayNewsService.getUserDemographic();
        // console.log('사용자 정보 API 응답 성공');
        // console.log('사용자 데이터:', JSON.stringify(userDemographic, null, 2));

        // const genderText = userDemographic.gender === "M" ? "남성" : "여성";
        // const ageText = Math.floor(userDemographic.age / 10) * 10;
        
        // 로컬 테스트를 위해 하드코딩된 값 사용 (원하는 값으로 변경 가능)
        const genderText = "여성"; // "남성" 또는 "여성"
        const ageText = 20; // 원하는 나이대 (예: 10, 20, 30)

        setUserGender(genderText);
        setUserAge(ageText.toString());
        console.log('사용자 정보 설정 완료:', ageText, '대', genderText);

        console.log('========================================');
        console.log('모든 API 호출 완료');
        console.log('========================================');
      } catch (error) {
        console.log('========================================');
        console.error("API 호출 실패");
        console.error("에러 타입:", error?.constructor?.name);
        console.error("에러 메시지:", error?.message);
        console.error("에러 상세:", error);
        if (error?.response) {
          console.error("HTTP 상태:", error.response.status);
          console.error("응답 데이터:", JSON.stringify(error.response.data, null, 2));
        }
        console.log('========================================');
      }
    };

    loadTodayNewsAndUserInfo();
  }, []);

  // 맨 처음 앱 진입 시에만 모달 표시
  useEffect(() => {
    console.log('[Index] 첫 로그인 체크:', {
      hasShownInitialModal,
      todayNewsItems: todayNewsItems.length,
      _hasHydrated,
      userDismissed,
    });

    // 매번 팝업 표시 (단, 사용자가 직접 닫은 경우 제외)
    if (todayNewsItems.length > 0 && _hasHydrated && !showModal && !userDismissed) {
      console.log('[Index] 로그인 시 팝업 표시 예정');
      setTimeout(() => {
        console.log('[Index] 팝업 표시 실행');
        setShowModal(true);
        setHasShownInitialModal(true);
      }, 500);
    }
  }, [todayNewsItems.length, _hasHydrated, showModal, userDismissed, setShowModal, setHasShownInitialModal]);

  // 백버튼으로 돌아왔을 때 모달 표시
  useFocusEffect(
    useCallback(() => {
      console.log('[Index] useFocusEffect - pendingReturn:', pendingReturn);

      if (_hasHydrated && pendingReturn && todayNewsItems.length > 0) {
        console.log('[Index] 백버튼 후 팝업 표시');
        checkAndShowOnReturn();
      }
    }, [_hasHydrated, pendingReturn, todayNewsItems.length, checkAndShowOnReturn])
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
    console.log('[Index] 해 아이콘 클릭 - 팝업 표시');
    setShowModal(true);
  };

  const handleNewsCardPress = async (newsId: string) => {
    console.log('[Index] 뉴스 카드 클릭 - ID:', newsId);

    // Zustand에 백버튼 예약 및 완료 ID 저장
    onNewsCardClick(newsId);

    try {
      // 플레이리스트 생성
      const todayNewsIds = todayNewsItems.map(item => parseInt(item.id));
      const randomArticles = await newsService.getArticles(0, 100);
      const randomIds = randomArticles.map(article => article.id);
      const allIds = [...todayNewsIds, ...randomIds.filter(id => !todayNewsIds.includes(id))];

      usePlaylistStore.getState().setPlaylist(allIds);
      const startIndex = allIds.indexOf(parseInt(newsId));
      usePlaylistStore.setState({ currentIndex: startIndex });

      console.log('[Index] 플레이리스트 생성 완료 - 시작 인덱스:', startIndex);
    } catch (error) {
      console.error('[Index] 플레이리스트 생성 오류:', error);
    }

    // 라우팅
    console.log('[Index] 라우팅: /newsplayer/' + newsId);
    router.push(`/newsplayer/${newsId}?playlist=true&from=todaynews`);
  };

  return (
    <View className="flex-1 bg-white">
      <HeroSection
        offset={offset}
        userLevel={level}
        onTodayNewsPress={handleTodayNewsPress}
      />

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
