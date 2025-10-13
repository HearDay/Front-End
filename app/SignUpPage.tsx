import InputBox from "@/components/common/InputBox";
import PrimaryButton from "@/components/common/PrimaryButton";
import TopBar from "@/components/common/TopBar";
import EmailInputWithSelect from "@/components/screens/SignUp/EmailInputWithSelect";
import InputBoxWithButton from "@/components/screens/SignUp/InputWithButton";
import TermsAgreement from "@/components/screens/SignUp/TermsAgreement";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StatusBar, Text, View } from "react-native";

const SignUpPage = () => {
  const router = useRouter();

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

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* TopBar를 ScrollView 밖으로 */}
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
          <InputBoxWithButton
            placeholder="아이디"
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
              variant="default"
            />
          </View>

          <View className="mt-3">
            <EmailInputWithSelect
              emailId={emailId}
              onChangeEmailId={setEmailId}
              emailDomain={emailDomain}
              onChangeEmailDomain={setEmailDomain}
              onPressVerify={() => console.log("본인인증 클릭")}
              disabled={false}
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
            title="다음"
            variant={allRequiredAgreed ? "primary" : "secondary"}
            onPress={() => {
              if (allRequiredAgreed) router.push("/SelectCategoryPage");
              else alert("필수 약관에 동의해주세요!");
            }}
          />
        </ScrollView>
      </View>
    </>
  );
};

export default SignUpPage;
