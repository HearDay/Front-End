import NewsCardList from "@/components/screens/HomePage/NewsCardList";
import ScrollButton from "@/components/screens/SearchNews/ScrollButton";
import SearchBar from "@/components/screens/SearchNews/SearchBar";
import { fetchArticles } from "@/services/api/articles";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, usePathname, useRouter } from "expo-router";

import { useFocusEffect } from "@react-navigation/native";
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
  const scrollRef = useRef<ScrollView>(null);

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

  // 초기 데이터 로드 + 저장된 상태 복구
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

  const handleScroll = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    saveScrollY(pathname, y);
  };

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const y = await getScrollY(pathname);

        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTo({ y, animated: false });
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
        <ScrollView
          ref={scrollRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <SafeAreaView style={styles.safeArea}>
            <View className="w-full items-center justify-center pb-2 relative">
              <TouchableOpacity
                onPress={() => router.push("/(tabs)")}
                className="absolute left-4 top-1"
              >
                <Image
                  source={require("../../my-expo-app/assets/images/BackButton.png")}
                  className="w-[12px] h-[18px] mt-3"
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <Image
                source={require("../../my-expo-app/assets/images/HEARDAY.png")}
                className="w-[130px] h-[45px]"
                resizeMode="contain"
              />
            </View>
          </SafeAreaView>

          <View className="items-center">
            <SearchBar
              value={searchText}
              onChangeText={setSearchText}
              onPressSearch={handleSearch}
            />
          </View>

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

          <NewsCardList
            background="white"
            articles={articles}
            onPressArticle={(id: string) => {
              router.push({
                pathname: "/newsplayer/[id]",
                params: { id, from: "category" },
              });
            }}
          />
        </ScrollView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "transparent",
  },
});
