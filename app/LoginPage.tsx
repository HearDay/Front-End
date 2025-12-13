import { Modal } from "@/components/common";
import InputBox from "@/components/common/InputBox";
import PrimaryButton from "@/components/common/PrimaryButton";
import { useAuthStore } from "@/services/api/authStore";
import { login } from "@/services/api/login";
import { saveAccessToken } from "@/services/utils/tokenStorage";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const LoginPage = () => {
  const router = useRouter();
  const setAuthReady = useAuthStore((s) => s.setAuthReady);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSecure, setIsSecure] = useState(true);
  const [delayedSecure, setDelayedSecure] = useState(true);

  // 애니메이션 값
  const fadeTree = useRef(new Animated.Value(1)).current;
  const moveTree = useRef(new Animated.Value(0)).current;
  const moveForm = useRef(new Animated.Value(0)).current;

  // 키보드 애니메이션
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      Animated.parallel([
        Animated.timing(fadeTree, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(moveTree, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(moveForm, {
          toValue: -250,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      Animated.parallel([
        Animated.timing(fadeTree, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(moveTree, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(moveForm, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDelayedSecure(isSecure), 50);
    return () => clearTimeout(t);
  }, [isSecure]);

  // 로그인 처리
  const handleLogin = async () => {
    if (!email || !password) {
      setModalMessage("아이디와 비밀번호를 모두 입력해주세요.");
      setIsSuccess(false);
      setIsModalVisible(true);
      return;
    }

    try {
      const res = await login({ email, password });

      if (res.success && res.data?.accessToken) {
        // SecureStore에 토큰 저장
        await saveAccessToken(res.data.accessToken);

        // 로그인 완료 신호
        setAuthReady(true);

        setModalMessage("로그인에 성공했습니다!");
        setIsSuccess(true);
        setIsModalVisible(true);
      } else {
        setModalMessage(res.message || "존재하지 않는 아이디입니다.");
        setIsSuccess(false);
        setIsModalVisible(true);
      }
    } catch (err: any) {
      console.error("로그인 오류:", err.response?.data || err.message);
      setModalMessage("서버 요청 중 오류가 발생했습니다.");
      setIsSuccess(false);
      setIsModalVisible(true);
    }
  };

  // 모달 확인 → 홈 이동
  const handleModalConfirm = () => {
    setIsModalVisible(false);
    if (isSuccess) {
      router.replace("/(tabs)");
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <LinearGradient
        colors={["#006716", "#428F48", "#85B77A", "#FBFFD3"]}
        locations={[0, 0.22, 0.54, 0.85]}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          {/* 로고 */}
          <View style={{ alignItems: "center", marginTop: 50, marginBottom: 10 }}>
            <Image
              source={require("../my-expo-app/assets/images/HEARDAY.png")}
              className="w-[156px] h-[56px]"
              resizeMode="contain"
            />
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
            style={{ flex: 1 }}
          >
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingBottom: 40,
              }}
              keyboardShouldPersistTaps="handled"
            >
              {/* Tree */}
              <Animated.View
                style={{
                  opacity: fadeTree,
                  transform: [{ translateY: moveTree }],
                }}
              >
                <View className="items-center mb-2">
                  <Image
                    source={require("../my-expo-app/assets/images/Tree.png")}
                    className="w-[267px] h-[267px]"
                    resizeMode="contain"
                  />
                </View>
              </Animated.View>

              {/* 입력 영역 */}
              <Animated.View
                style={{
                  transform: [{ translateY: moveForm }],
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <View className="gap-3 mb-3">
                  <InputBox
                    placeholder="이메일을 입력해 주세요"
                    value={email}
                    onChangeText={setEmail}
                    variant="transparent"
                  />

                  <View className="flex-row items-center w-[350px] h-[50px] rounded-[10px] px-6 bg-white/20">
                    <TextInput
                      placeholder="비밀번호를 입력해 주세요"
                      placeholderTextColor="white"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={delayedSecure}
                      style={{ flex: 1, fontSize: 17, color: "#FFFFFF" }}
                    />
                    <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
                      {isSecure ? (
                        <EyeOff size={22} color="#FFFFFFB3" />
                      ) : (
                        <Eye size={22} color="#FFFFFFB3" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="gap-3 mb-5">
                  <PrimaryButton title="로그인" variant="white" onPress={handleLogin} />
                  <PrimaryButton
                    title="카카오로 시작하기"
                    variant="kakao"
                    onPress={() => router.push("/KakaoLoginView")}
                  />
                </View>

                <View className="flex-row items-center gap-2 mt-4">
                  <TouchableOpacity onPress={() => router.push("/CertificationPage")}>
                    <Text className="text-[#006716] text-[13px]">비밀번호 변경</Text>
                  </TouchableOpacity>
                  <Text className="text-[#006716] text-[13px]">|</Text>
                  <TouchableOpacity onPress={() => router.push("/SignUpPage")}>
                    <Text className="text-[#006716] text-[13px]">회원가입</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>

        <Modal
          visible={isModalVisible}
          title={modalMessage}
          confirmText="확인"
          onConfirm={handleModalConfirm}
          onClose={() => setIsModalVisible(false)}
        />
      </LinearGradient>
    </>
  );
};

export default LoginPage;
