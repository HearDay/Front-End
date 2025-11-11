import InputBox from "@/components/common/InputBox";
import PrimaryButton from "@/components/common/PrimaryButton";
import TopBar from "@/components/common/TopBar";
import EmailInputWithSelect from "@/components/screens/SignUp/EmailInputWithSelect";
import TermsAgreement from "@/components/screens/SignUp/TermsAgreement";
import axiosInstance from "@/services/api/axiosInstance";
import { signup } from "@/services/api/signup";
import { Stack, useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SignUpPage = () => {
  const router = useRouter();

  const [nickname, setNickname] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [phone, setPhone] = useState("");
  const [emailId, setEmailId] = useState("");
  const [emailDomain, setEmailDomain] = useState("@gmail.com");
  const [terms, setTerms] = useState({
    service: false,
    privacy: false,
    marketing: false,
  });

  const [isSecure1, setIsSecure1] = useState(true);
  const [isSecure2, setIsSecure2] = useState(true);
  const [delayedSecure1, setDelayedSecure1] = useState(isSecure1);
  const [delayedSecure2, setDelayedSecure2] = useState(isSecure2);

  useEffect(() => {
    if (Platform.OS === "ios") {
      const t1 = setTimeout(() => setDelayedSecure1(isSecure1), 50);
      const t2 = setTimeout(() => setDelayedSecure2(isSecure2), 50);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      setDelayedSecure1(isSecure1);
      setDelayedSecure2(isSecure2);
    }
  }, [isSecure1, isSecure2]);

  const allRequiredAgreed = terms.service && terms.privacy;

  const handleSignUp = async () => {
    if (!allRequiredAgreed) {
      return Alert.alert("필수 약관에 동의해주세요!");
    }
    if (pwd !== confirmPw) {
      return Alert.alert("비밀번호가 일치하지 않습니다.");
    }

    const body = {
      nickname,
      password: pwd,
      email: `${emailId}${emailDomain}`,
      phone,
    };

    console.log("요청 URL:", axiosInstance.defaults.baseURL + "/api/users/");
    console.log("요청 Body:", body);

    try {
      const res = await signup(body);

      if (res.success) {
        Alert.alert("회원가입 성공", "선호 카테고리를 선택해주세요!", [
          {
            text: "확인",
            onPress: () =>
              router.push({
                pathname: "/SelectCategoryPage",
                params: {
                  nickname,
                  password: pwd,
                  email: `${emailId}${emailDomain}`,
                  phone,
                },
              }),
          },
        ]);
      } else {
        Alert.alert("회원가입 실패", res.message || "오류가 발생했습니다.");
      }
    } catch (err: any) {
      console.error("회원가입 실패:", err.response?.data || err.message);
      Alert.alert(
        "회원가입 실패",
        err.response?.data?.message || "요청 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <View className="flex-1 bg-[#F5FCE9]">
      <Stack.Screen options={{ headerShown: false }} />

      <TopBar
        showBackButton
        onBackPress={() => router.push("/LoginPage")}
      />

      <View className="flex-[0.9] items-center justify-center pt-3">
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

        {/* 이메일 */}
        <View className="mt-2">
          <EmailInputWithSelect
            emailId={emailId}
            onChangeEmailId={setEmailId}
            emailDomain={emailDomain}
            onChangeEmailDomain={setEmailDomain}
            onPressVerify={() => console.log("본인인증 클릭")}
          />
        </View>

        {/* 닉네임 */}
        <InputBox
          placeholder="닉네임"
          value={nickname}
          onChangeText={setNickname}
        />

        {/* 비밀번호 입력 */}
        <View
          className="flex-row items-center w-[350px] h-[50px] bg-[#FEFFF5] rounded-[10px] px-6 mt-3"
          style={{
            paddingVertical: Platform.OS === "ios" ? 10 : 6,
          }}
        >
          <TextInput
            placeholder="비밀번호"
            placeholderTextColor="#8AA989"
            value={pwd}
            onChangeText={setPwd}
            secureTextEntry={delayedSecure1}
            style={{
              flex: 1,
              fontSize: 17,
              color: "#1F2D1F",
              includeFontPadding: false,
              textAlignVertical: "center",
              paddingVertical: 0,
            }}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            importantForAutofill="no"
            textContentType="oneTimeCode" // 자동완성 방지
          />
          <TouchableOpacity onPress={() => setIsSecure1(!isSecure1)}>
            {isSecure1 ? (
              <EyeOff size={22} color="#8AA989" />
            ) : (
              <Eye size={22} color="#8AA989" />
            )}
          </TouchableOpacity>
        </View>

        {/* 비밀번호 확인 입력 */}
        <View
          className="flex-row items-center w-[350px] h-[50px] bg-[#FEFFF5] rounded-[10px] px-6 mt-3"
          style={{
            paddingVertical: Platform.OS === "ios" ? 10 : 6,
          }}
        >
          <TextInput
            placeholder="비밀번호 확인"
            placeholderTextColor="#8AA989"
            value={confirmPw}
            onChangeText={setConfirmPw}
            secureTextEntry={delayedSecure2}
            style={{
              flex: 1,
              fontSize: 17,
              color: "#1F2D1F",
              includeFontPadding: false,
              textAlignVertical: "center",
              paddingVertical: 0,
            }}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            importantForAutofill="no"
            textContentType="oneTimeCode"
          />
          <TouchableOpacity onPress={() => setIsSecure2(!isSecure2)}>
            {isSecure2 ? (
              <EyeOff size={22} color="#8AA989" />
            ) : (
              <Eye size={22} color="#8AA989" />
            )}
          </TouchableOpacity>
        </View>

        {/* 전화번호 */}
        <View className="mt-3">
          <InputBox
            placeholder="전화번호 (-없이 번호 입력)"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* 안내 문구 */}
        <View className="w-[350px] mt-2 mb-5">
          <Text className="text-[12px] text-[#B7B7B7] leading-5 ml-3">
            • 앱의 모든 기능을 원활하게 사용하기 위해서 정확한 정보를 입력해야 합니다{"\n"}
            • 본인확인 및 보안을 위한 정보이며, 다른 용도로 사용되지 않습니다
          </Text>
        </View>

        {/* 약관 */}
        <TermsAgreement value={terms} onChange={setTerms} />

        {/* 회원가입 버튼 */}
        <PrimaryButton
          title="회원가입"
          variant={allRequiredAgreed ? "primary" : "secondary"}
          onPress={handleSignUp}
        />
      </View>
    </View>
  );
};

export default SignUpPage;
