import React from "react";
import { SafeAreaView, Text, View } from "react-native";

const ProfilePage = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-semibold text-gray-800">
          Profile Page
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ProfilePage;
