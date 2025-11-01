import { Modal } from "@/components/common";
import InputBox from "@/components/common/InputBox";
import PrimaryButton from "@/components/common/PrimaryButton";
import KakaoAgreement from "@/components/screens/Login/KakaoAgreement";
import { login } from "@/services/api/login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Image,
    SafeAreaView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const LoginPage = () => {
  const router = useRouter();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isKakaoModalVisible, setIsKakaoModalVisible] = useState(false);

  // ✅ 로그인 처리 함수
  const handleLogin = async () => {
    if (!id || !password) {
      return Alert.alert("입력 오류", "아이디와 비밀번호를 모두 입력해주세요.");
    }

    try {
      const body = {
        LoginId: id,
        password: password,
      };

      console.log("로그인 요청 Body:", body);

      const res = await login(body);
      console.log("로그인 응답:", res);

      if (res.success) {
        const token = res.data?.accessToken;
        console.log("✅ 로그인 성공 - Access Token:", token);

        // 🔐 토큰을 AsyncStorage에 저장
        await AsyncStorage.setItem("accessToken", token || "");

        // 🔁 로그인 후 홈 화면으로 이동
        Alert.alert("로그인 성공", res.message, [
          {
            text: "확인",
            onPress: () => router.replace("/(tabs)"),
          },
        ]);
      } else {
        Alert.alert("로그인 실패", res.message || "아이디 또는 비밀번호를 확인해주세요.");
      }
    } catch (err: any) {
      console.error("❌ 로그인 오류:", err.response?.data || err.message);
      Alert.alert(
        "로그인 실패",
        err.response?.data?.message || "서버 요청 중 오류가 발생했습니다."
      );
    }
  };

  // ✅ 카카오 로그인 모달
  const handleKakaoStart = () => {
    setIsKakaoModalVisible(true);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <LinearGradient
        colors={["#006716", "#428F48", "#85B77A", "#FBFFD3"]}
        locations={[0, 0.22, 0.54, 0.85]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ flex: 1 }}
        className="items-center justify-center"
      >
        <SafeAreaView className="flex-1 w-full items-center justify-center">
          {/* 로고 */}
          <View className="items-center mb-5 mt-3">
            <Image
              source={require("../my-expo-app/assets/images/HEARDAY.png")}
              className="w-[156px] h-[56px]"
              resizeMode="contain"
            />
          </View>

          {/* 메인 트리 이미지 */}
          <View className="items-center mb-3">
            <Image
              source={require("../my-expo-app/assets/images/Tree.png")}
              className="w-[267px] h-[267px]"
              resizeMode="contain"
            />
          </View>

          {/* 입력 필드 */}
          <View className="gap-3 mb-3">
            <InputBox
              placeholder="이메일을 입력해 주세요"
              value={id}
              onChangeText={setId}
              variant="transparent"
            />
            <InputBox
              placeholder="비밀번호를 입력해 주세요"
              value={password}
              onChangeText={setPassword}
              variant="transparent"
            />
          </View>

          {/* 버튼들 */}
          <View className="gap-3">
            <PrimaryButton title="로그인" variant="white" onPress={handleLogin} />
            <PrimaryButton
              title="카카오로 시작하기"
              variant="kakao"
              onPress={handleKakaoStart}
            />
          </View>

          {/* 하단 링크 */}
          <View className="flex-row items-center gap-2 mt-12">
            <TouchableOpacity onPress={() => router.push("/CertificationPage")}>
              <Text className="text-[#006716] text-[13px]">비밀번호 변경</Text>
            </TouchableOpacity>
            <Text className="text-[#006716] text-[13px]">|</Text>
            <TouchableOpacity onPress={() => router.push("/SignUpPage")}>
              <Text className="text-[#006716] text-[13px]">회원가입</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* 로그인 실패 모달 */}
        <Modal
          visible={isModalVisible}
          title="존재하지 않는 아이디입니다."
          onConfirm={() => setIsModalVisible(false)}
          onClose={() => setIsModalVisible(false)}
          confirmText="확인"
        />

        {/* 카카오 약관 모달 */}
        <KakaoAgreement
          visible={isKakaoModalVisible}
          onClose={() => setIsKakaoModalVisible(false)}
          onConfirm={() => {
            setIsKakaoModalVisible(false);
            console.log("약관 동의 완료");
          }}
        />
      </LinearGradient>
    </>
  );
};

export default LoginPage;
