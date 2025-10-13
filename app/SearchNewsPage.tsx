// app/(pages)/SearchNewsPage.tsx

import NewsCardList from "@/components/screens/HomePage/NewsCardList";
import ScrollButton from "@/components/screens/SearchNews/ScrollButton";
import SearchBar from "@/components/screens/SearchNews/SearchBar";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const SearchNewsPage = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const categories = [
    "전체",
    "경제",
    "방송/연예",
    "IT",
    "쇼핑",
    "생활",
    "해외",
    "스포츠",
    "정치",
  ];

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
                onPress={() => router.back()}
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

          <View className="items-center">
            <SearchBar
              value={searchText}
              onChangeText={setSearchText}
              onPressSearch={() =>
                console.log("검색 실행:", searchText, selectedCategory)
              }
            />
          </View>

          <View className="mt-3">
            <ScrollButton
              categories={categories}
              onSelect={(category) => setSelectedCategory(category)}
            />
          </View>

          <View className="flex-1 mt-2">
            <NewsCardList background="white" />
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
