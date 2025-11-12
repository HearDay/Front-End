import NewsCardList from "@/components/screens/HomePage/NewsCardList";
import ScrollButton from "@/components/screens/SearchNews/ScrollButton";
import SearchBar from "@/components/screens/SearchNews/SearchBar";
import { fetchArticles } from "@/services/api/articles";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SearchNewsPage = () => {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category?: string }>(); // URL에서 카테고리 파라미터 읽기

  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(category || "전체"); // URL 카테고리 복원
  const [articles, setArticles] = useState<any[]>([]);

  const categoryMap: Record<string, string> = {
    "전체": "전체",
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

  // 기사 조회 함수
  const handleSearch = async (title?: string, categoryParam?: string) => {
    const backendCategory = categoryMap[categoryParam ?? selectedCategory];
    const result = await fetchArticles(title ?? searchText, backendCategory);
    setArticles(result);
  };

  // 페이지 처음 진입 시 전체 기사 자동 조회
  useEffect(() => {
    handleSearch("", selectedCategory);
  }, []);

  // 카테고리 변경 시 자동 갱신
  useEffect(() => {
    handleSearch();
  }, [selectedCategory]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient
        colors={["#006716", "#428F48", "#85B77A", "#FBFFD3"]}
        locations={[0, 0, 0.12, 0.85]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ flex: 1 }}
      >
        <View className="flex-1 mt-2">
          <SafeAreaView style={styles.safeArea}>
            <View className="w-full items-center justify-center pb-2 relative bg-transparent">
              <TouchableOpacity
                onPress={() => router.push("/(tabs)")}
                className="absolute left-4 top-1"
              >
                <Image
                  source={require("../my-expo-app/assets/images/BackButton.png")}
                  className="w-[12px] h-[18px] mt-3"
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <Image
                source={require("../my-expo-app/assets/images/HEARDAY.png")}
                className="w-[130px] h-[45px]"
                resizeMode="contain"
              />
            </View>
          </SafeAreaView>

          {/* 검색창 */}
          <View className="items-center">
            <SearchBar
              value={searchText}
              onChangeText={setSearchText}
              onPressSearch={() => handleSearch()}
            />
          </View>

          {/* 카테고리 버튼 */}
          <View className="mt-3">
            <ScrollButton
              categories={categories}
              onSelect={(category) => setSelectedCategory(category)}
              selectedCategory={selectedCategory}
            />
          </View>

          {/* 기사 리스트 */}
          <View className="flex-1 mt-2">
            <NewsCardList
              background="white"
              articles={articles}
              onPressArticle={(id: string) =>
                router.push({
                  pathname: `/newsplayer/[id]`,
                  params: {
                    id: id.toString(),
                    from: "category",
                    category: selectedCategory,
                  },
                })
              }
            />
          </View>
        </View>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "transparent",
  },
});

export default SearchNewsPage;
