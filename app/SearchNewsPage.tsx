import NewsCardList from "@/components/screens/HomePage/NewsCardList";
import ScrollButton from "@/components/screens/SearchNews/ScrollButton";
import SearchBar from "@/components/screens/SearchNews/SearchBar";
import { fetchArticles } from "@/services/api/articles";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, usePathname, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  getScrollX,
  getScrollY,
  getSelectedCategory,
  saveScrollX,
  saveScrollY,
  saveSelectedCategory,
} from "@/services/utils/scrollStore";

export default function SearchNewsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const listScrollRef = useRef<ScrollView>(null);

  const { category } = useLocalSearchParams<{ category?: string }>();

  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(category || "전체");
  const [articles, setArticles] = useState<any[]>([]);
  const [categoryScrollX, setCategoryScrollX] = useState(0);

  const categoryMap: Record<string, string> = {
    전체: "전체",
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

  useEffect(() => {
    (async () => {
      const savedCat = await getSelectedCategory(pathname);
      setSelectedCategory(savedCat);

      const backendCategory = categoryMap[savedCat];
      const result = await fetchArticles("", backendCategory);
      setArticles(result);

      const savedX = await getScrollX(pathname);
      setCategoryScrollX(savedX);
    })();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [selectedCategory]);

  const handleSearch = async () => {
    const backendCategory = categoryMap[selectedCategory];
    const result = await fetchArticles(searchText, backendCategory);
    setArticles(result);

    await saveSelectedCategory(pathname, selectedCategory);
  };

  const handleScrollListY = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    saveScrollY(pathname, y);
  };

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const y = await getScrollY(pathname);

        setTimeout(() => {
          if (listScrollRef.current) {
            listScrollRef.current.scrollTo({ y, animated: false });
          }
        }, 0);
      })();
    }, [pathname])
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient
        colors={["#006716", "#428F48", "#85B77A", "#FBFFD3"]}
        locations={[0, 0, 0.12, 0.85]}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View className="px-4 pb-1">
            <View className="w-full items-center justify-center pb-2 relative">
              <TouchableOpacity
                onPress={() => router.push("/")}
                className="absolute left-4 top-1"
              >
                <Image
                  source={require("../my-expo-app/assets/images/BackButton.png")}
                  className="w-[12px] h-[18px] mt-3"
                />
              </TouchableOpacity>

              <Image
                source={require("../my-expo-app/assets/images/HEARDAY.png")}
                className="w-[130px] h-[45px]"
                resizeMode="contain"
              />
            </View>

            {/* 검색창 */}
            <View className="items-center">
              <SearchBar
                value={searchText}
                onChangeText={setSearchText}
                onPressSearch={handleSearch}
              />
            </View>

            {/* 카테고리 버튼들 */}
            <View className="mt-3">
              <ScrollButton
                categories={categories}
                selectedCategory={selectedCategory}
                onSelect={async (v) => {
                  setSelectedCategory(v);
                  await saveSelectedCategory(pathname, v);
                }}
                initialX={categoryScrollX}
                onScrollX={(x) => saveScrollX(pathname, x)}
              />
            </View>
          </View>

          <ScrollView
            ref={listScrollRef}
            onScroll={handleScrollListY}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 50 }}
          >
            <NewsCardList
              background="white"
              articles={articles}
              onPressArticle={async (id: string) => {
                console.log('[SearchNewsPage] ===== 기사 클릭 시작 =====');
                console.log('[SearchNewsPage] 기사 선택 - Article ID:', id);

                // 연속 재생 설정
                const store = await import('@/stores/newsPlaybackStore').then(m => m.useNewsPlaybackStore);
                const { setRecommendedArticles, startRecommendedPlayback } = store.getState();

                // 검색 결과 기사들을 추천 기사로 설정 (최대 100개)
                const playbackArticles = articles.slice(0, 100).map(article => ({
                  id: String(article.id),
                  title: article.title,
                  imageUrl: article.imageUrl,
                  summary: article.description,
                  category: article.category,
                }));

                console.log('[SearchNewsPage] playbackArticles 생성:', playbackArticles.length, '개');
                console.log('[SearchNewsPage] 첫 번째 기사:', playbackArticles[0]?.id);
                console.log('[SearchNewsPage] 두 번째 기사:', playbackArticles[1]?.id);

                // 클릭한 기사의 인덱스 찾기
                console.log('[SearchNewsPage] 원본 articles 첫 번째:', articles[0]?.id, typeof articles[0]?.id);
                console.log('[SearchNewsPage] 클릭한 id:', id, typeof id);

                const clickedIndex = articles.findIndex(article => String(article.id) === String(id));
                console.log('[SearchNewsPage] 클릭한 기사 인덱스:', clickedIndex);
                console.log('[SearchNewsPage] 클릭한 기사 ID:', id);

                if (clickedIndex === -1) {
                  console.error('[SearchNewsPage] ❌ 기사를 찾을 수 없음!');
                  return;
                }

                // 상태 업데이트 전 확인
                console.log('[SearchNewsPage] setRecommendedArticles 호출 전 상태:', store.getState().recommendedArticles.length);

                setRecommendedArticles(playbackArticles);

                console.log('[SearchNewsPage] setRecommendedArticles 호출 후 상태:', store.getState().recommendedArticles.length);

                // 연속 재생 시작
                console.log('[SearchNewsPage] startRecommendedPlayback 호출 - 인덱스:', clickedIndex);
                console.log('[SearchNewsPage] startRecommendedPlayback 호출 전 currentRecommendedIndex:', store.getState().currentRecommendedIndex);

                startRecommendedPlayback(clickedIndex);

                console.log('[SearchNewsPage] startRecommendedPlayback 호출 후 즉시 상태:', {
                  currentRecommendedIndex: store.getState().currentRecommendedIndex,
                  isPlayingRecommended: store.getState().isPlayingRecommended,
                  recommendedArticlesCount: store.getState().recommendedArticles.length,
                });

                // 약간 대기 후 다시 확인
                await new Promise(resolve => setTimeout(resolve, 100));

                const finalState = store.getState();
                console.log('[SearchNewsPage] 100ms 대기 후 최종 상태:', {
                  currentRecommendedIndex: finalState.currentRecommendedIndex,
                  isPlayingRecommended: finalState.isPlayingRecommended,
                  recommendedArticlesCount: finalState.recommendedArticles.length,
                  currentArticle: finalState.recommendedArticles[finalState.currentRecommendedIndex],
                });

                console.log('[SearchNewsPage] ===== 라우팅 시작 =====');

                // 라우팅
                router.push({
                  pathname: "/newsplayer/[id]",
                  params: { id, from: "category", mode: "recommended" },
                });
              }}
            />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "transparent",
  },
});
