import InputBox from "@/components/common/InputBox";
import PrimaryButton from "@/components/common/PrimaryButton";
import TopBar from "@/components/common/TopBar";
import EmailInputWithSelect from "@/components/screens/SignUp/EmailInputWithSelect";
import InputBoxWithButton from "@/components/screens/SignUp/InputWithButton";
import TermsAgreement from "@/components/screens/SignUp/TermsAgreement";
import axiosInstance from "@/services/api/axiosInstance";
import { signup } from "@/services/api/signup";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StatusBar, Text, View } from "react-native";

const SignUpPage = () => {
  const router = useRouter(); // 라우터 훅 선언

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [phone, setPhone] = useState("");
  const [emailId, setEmailId] = useState("");
  const [emailDomain, setEmailDomain] = useState("@gmail.com");
  const [terms, setTerms] = useState({
    service: false,
    privacy: false,
    marketing: false,
  });

  const allRequiredAgreed = terms.service && terms.privacy;

  const handleSignUp = async () => {
    if (!allRequiredAgreed) {
      return Alert.alert("필수 약관에 동의해주세요!");
    }
    if (password !== confirmPw) {
      return Alert.alert("비밀번호가 일치하지 않습니다.");
    }

    const body = {
      loginId: id,
      password,
      email: `${emailId}${emailDomain}`,
      phone,
      userCategory: ["경제"], // 임시 값
    };

    console.log("요청 URL:", axiosInstance.defaults.baseURL + "/api/users/");
    console.log("요청 Body:", body);

    try {
      const res = await signup(body);
      console.log("✅ 회원가입 성공:", res);

      // ✅ 회원가입 성공 시 카테고리 선택 페이지로 이동
      Alert.alert("회원가입 성공", "선호 카테고리를 선택해주세요!", [
        {
          text: "확인",
          onPress: () =>
            router.push({
              pathname: "/SelectCategoryPage",
              params: {
                loginId: id,
                password,
                email: `${emailId}${emailDomain}`,
                phone,
              },
            }),
        },
      ]);
    } catch (err: any) {
      console.error("❌ 회원가입 실패:", err.response?.data || err.message);
      Alert.alert(
        "회원가입 실패",
        err.response?.data?.message || "요청 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <View className="bg-[#F5FCE9] flex-1">
        <TopBar showBackButton={true} />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            alignItems: "center",
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="mt-3">
            <EmailInputWithSelect
              emailId={emailId}
              onChangeEmailId={setEmailId}
              emailDomain={emailDomain}
              onChangeEmailDomain={setEmailDomain}
              onPressVerify={() => console.log("본인인증 클릭")}
            />
          </View>
          
          <InputBoxWithButton
            placeholder="닉네임"
            value={id}
            onChangeText={setId}
            buttonText="중복확인"
            onPressButton={() => console.log("중복확인 클릭!")}
          />

          <InputBox
            placeholder="비밀번호"
            value={password}
            onChangeText={setPassword}
            variant="password"
          />

          <View className="mt-3">
            <InputBox
              placeholder="비밀번호 확인"
              value={confirmPw}
              onChangeText={setConfirmPw}
              variant="password"
            />
          </View>

          <View className="mt-3">
            <InputBox
              placeholder="전화번호 (-없이 번호 입력)"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <View className="w-[350px] mt-2 mb-5">
            <Text className="text-[12px] text-[#B7B7B7] leading-5 ml-3">
              • 앱의 모든 기능을 원활하게 사용하기 위해서 정확한 정보를 입력해야 합니다{"\n"}
              • 본인확인 및 보안을 위한 정보이며, 다른 용도로 사용되지 않습니다
            </Text>
          </View>

          <TermsAgreement value={terms} onChange={setTerms} />

          <PrimaryButton
            title="회원가입"
            variant={allRequiredAgreed ? "primary" : "secondary"}
            onPress={handleSignUp}
          />
        </ScrollView>
      </View>
    </>
  );
};

export default SignUpPage;
