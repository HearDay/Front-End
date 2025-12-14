import { Modal } from "@/components/common/Modal";
import TopBar from "@/components/common/TopBar";
import EmailInputWithSelect from "@/components/screens/SignUp/EmailInputWithSelect";
import InputBoxWithButton from "@/components/screens/SignUp/InputWithButton";
import {
  sendCertificationCode,
  verifyCertificationCode,
} from "@/services/api/certification";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";

const CertificationPage = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();

  const [emailId, setEmailId] = useState("");
  const [emailDomain, setEmailDomain] = useState("@gmail.com");
  const [certificationCode, setCertificationCode] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (email) {
      const [id, domain] = email.split("@");
      setEmailId(id);
      setEmailDomain("@" + domain);
    }
  }, [email]);

  const handleVerify = async () => {
    const fullEmail = `${emailId}${emailDomain}`;
    if (!emailId) return Alert.alert("이메일을 입력해주세요.");

    try {
      const res = await sendCertificationCode(fullEmail);
      if (res.success) {
        setShowCodeInput(true);
        setModalMessage(
          "이메일로 인증코드를 발송했습니다.\n5분 안에 인증을 완료해주세요."
        );
        setModalVisible(true);
      } else {
        Alert.alert("발송 실패", res.message);
      }
    } catch {
      Alert.alert("오류", "서버 요청 중 문제가 발생했습니다.");
    }
  };

  const handleCodeConfirm = async () => {
    const fullEmail = `${emailId}${emailDomain}`;
    if (!certificationCode)
      return Alert.alert("인증번호를 입력해주세요.");

    try {
      const res = await verifyCertificationCode(
        fullEmail,
        certificationCode
      );
      if (res.success) {
        router.push({
          pathname: "/ResetPasswordPage",
          params: { email: fullEmail },
        });
      } else {
        Alert.alert("인증 실패", res.message);
      }
    } catch {
      Alert.alert("오류", "서버 요청 중 문제가 발생했습니다.");
    }
  };

  return (
    <View className="flex-1 bg-[#F5FCE9]">
      <Stack.Screen options={{ headerShown: false }} />
      <TopBar showBackButton onBackPress={() => router.replace("/LoginPage")} />

      <View className="flex-1 items-center px-6 pt-40">
        <Text className="text-xl sm:text-xl font-bold text-[#002C09] mb-8 mt-10">
          비밀번호 변경하기
        </Text>

        <EmailInputWithSelect
          emailId={emailId}
          onChangeEmailId={setEmailId}
          emailDomain={emailDomain}
          onChangeEmailDomain={setEmailDomain}
          onPressVerify={handleVerify}
        />

        {showCodeInput && (
          <View className="w-full items-center mb-10 mt-3">
            <InputBoxWithButton
              placeholder="인증번호"
              value={certificationCode}
              onChangeText={setCertificationCode}
              buttonText="확인"
              onPressButton={handleCodeConfirm}
            />
          </View>
        )}
      </View>

      <Modal
        visible={modalVisible}
        title={modalMessage}
        confirmText="확인"
        onConfirm={() => setModalVisible(false)}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default CertificationPage;
