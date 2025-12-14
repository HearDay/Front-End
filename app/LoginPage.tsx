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
  Dimensions,
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

const { width } = Dimensions.get("window");

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

  const fadeTree = useRef(new Animated.Value(1)).current;
  const moveTree = useRef(new Animated.Value(0)).current;
  const moveForm = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      Animated.parallel([
        Animated.timing(fadeTree, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(moveTree, {
          toValue: 40,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(moveForm, {
          toValue: -200,
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
        await saveAccessToken(res.data.accessToken);
        setAuthReady(true);
        setModalMessage("로그인에 성공했습니다!");
        setIsSuccess(true);
        setIsModalVisible(true);
      } else {
        setModalMessage(res.message || "존재하지 않는 아이디입니다.");
        setIsSuccess(false);
        setIsModalVisible(true);
      }
    } catch {
      setModalMessage("서버 요청 중 오류가 발생했습니다.");
      setIsSuccess(false);
      setIsModalVisible(true);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <LinearGradient
        colors={["#006716", "#428F48", "#85B77A", "#FBFFD3"]}
        locations={[0, 0.22, 0.54, 0.85]}
        className="flex-1"
      >
        <SafeAreaView className="flex-1">
          {/* Logo */}
          <View className="items-center mt-20 mb-4">
            <Image
              source={require("../my-expo-app/assets/images/HEARDAY.png")}
              resizeMode="contain"
              style={{ width: Math.min(width * 0.45, 170), height: 56 }}
            />
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="flex-1"
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 48 }}
            >
              {/* Tree */}
              <Animated.View
                style={{
                  opacity: fadeTree,
                  transform: [{ translateY: moveTree }],
                }}
                className="items-center mt-10 mb-6"
              >
                <Image
                  source={require("../my-expo-app/assets/images/Tree.png")}
                  resizeMode="contain"
                  style={{
                    width: Math.min(width * 0.6, 240),
                    height: Math.min(width * 0.6, 240),
                  }}
                />
              </Animated.View>

              {/* Form */}
              <Animated.View
                style={{ transform: [{ translateY: moveForm }] }}
                className="items-center"
              >
                <View className="w-[90%] max-w-[380px] gap-3 mb-4">
                  <InputBox
                    placeholder="이메일을 입력해 주세요"
                    value={email}
                    onChangeText={setEmail}
                    variant="transparent"
                  />

                  <View className="flex-row items-center h-[48px] rounded-[10px] px-5 bg-white/20">
                    <TextInput
                      placeholder="비밀번호를 입력해 주세요"
                      placeholderTextColor="white"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={delayedSecure}
                      className="flex-1 text-white text-[16px]"
                    />
                    <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
                      {isSecure ? (
                        <EyeOff size={20} color="#FFFFFFB3" />
                      ) : (
                        <Eye size={20} color="#FFFFFFB3" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="w-[90%] max-w-[380px] gap-3">
                  <PrimaryButton title="로그인" variant="white" onPress={handleLogin} />
                  <PrimaryButton
                    title="카카오로 시작하기"
                    variant="kakao"
                    onPress={() => router.push("/KakaoLoginView")}
                  />
                </View>

                <View className="flex-row items-center gap-2 mt-6">
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
          onConfirm={() => {
            setIsModalVisible(false);
            if (isSuccess) router.replace("/(tabs)");
          }}
          onClose={() => setIsModalVisible(false)}
        />
      </LinearGradient>
    </>
  );
};

export default LoginPage;
