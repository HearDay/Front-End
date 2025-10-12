import { Modal } from "@/components/common";
import InputBox from "@/components/common/InputBox";
import PrimaryButton from "@/components/common/PrimaryButton";
import KakaoAgreement from "@/components/screens/Login/KakaoAgreement";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
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

  const handleLogin = () => {
    // 로그인 검증 (테스트용) 
    setIsModalVisible(true);
  };

  const handleKakaoStart = () => {
    // 카카오 이용약관 모달 띄우기
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
              source={require("../../my-expo-app/assets/images/HEARDAY.png")}
              className="w-[156px] h-[56px]"
              resizeMode="contain"
            />
          </View>

          {/* 나무 이미지 */}
          <View className="items-center mb-3">
            <Image
              source={require("../../my-expo-app/assets/images/Tree.png")}
              className="w-[267px] h-[267px]"
              resizeMode="contain"
            />
          </View>

          {/* 입력창 */}
          <View className="gap-3 mb-3">
            <InputBox
              placeholder="아이디를 입력해 주세요"
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

          {/* 버튼 영역 */}
          <View className="gap-3">
            <PrimaryButton title="로그인" variant="white" onPress={handleLogin} />
            <PrimaryButton title="카카오로 시작하기" variant="kakao" onPress={handleKakaoStart} /> 
          </View>

          {/* 하단 링크 */}
          <View className="flex-row items-center gap-2 mt-12">
            <TouchableOpacity onPress={() => router.push("/FindIdPage")}>
              <Text className="text-[#006716] text-[13px]">아이디 찾기</Text>
            </TouchableOpacity>
            <Text className="text-[#006716] text-[13px]">|</Text>
            <TouchableOpacity onPress={() => router.push("/ResetPasswordPage")}>
              <Text className="text-[#006716] text-[13px]">비밀번호 변경</Text>
            </TouchableOpacity>
            <Text className="text-[#006716] text-[13px]">|</Text>
            <TouchableOpacity onPress={() => router.push("/SignUpPage")}>
              <Text className="text-[#006716] text-[13px]">회원가입</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <Modal
          visible={isModalVisible}
          title="존재하지 않는 아이디입니다."
          onConfirm={() => setIsModalVisible(false)}
          onClose={() => setIsModalVisible(false)}
        />
      

        {/* 카카오 약관 동의 모달 */}
        <KakaoAgreement
          visible={isKakaoModalVisible}
          onClose={() => setIsKakaoModalVisible(false)}
          onConfirm={() => {
            setIsKakaoModalVisible(false);
            // 약관 동의 완료 후 다음 단계 진행 (ex. 카카오 로그인 API 호출)
            console.log("약관 동의 완료");
          }}
        />
      </LinearGradient>
    </>
  );
};

export default LoginPage;
