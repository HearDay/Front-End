import { Modal } from "@/components/common/Modal";
import TopBar from "@/components/common/TopBar";
import EmailInputWithSelect from "@/components/screens/SignUp/EmailInputWithSelect";
import InputBoxWithButton from "@/components/screens/SignUp/InputWithButton";
import { sendCertificationCode, verifyCertificationCode } from "@/services/api/certification";
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

  // 이메일 인증번호 전송
  const handleVerify = async () => {
    const fullEmail = `${emailId}${emailDomain}`;
    if (!emailId) return Alert.alert("이메일을 입력해주세요.");

    try {
      const res = await sendCertificationCode(fullEmail);
      if (res.success) {
        setShowCodeInput(true);
        setModalMessage("이메일로 인증코드를 발송했습니다.\n5분 안에 인증을 완료해주세요.");
        setModalVisible(true);
      } else {
        Alert.alert("발송 실패", res.message || "이메일 전송에 실패했습니다.");
      }
    } catch (err) {
      console.error("이메일 인증 전송 실패:", err);
      Alert.alert("오류", "서버 요청 중 문제가 발생했습니다.");
    }
  };

  // 인증번호 검증
  const handleCodeConfirm = async () => {
    const fullEmail = `${emailId}${emailDomain}`;
    if (!certificationCode) return Alert.alert("인증번호를 입력해주세요.");

    try {
      const res = await verifyCertificationCode(fullEmail, certificationCode);
      if (res.success) {
        Alert.alert("인증 완료", "인증이 성공적으로 완료되었습니다.", [
          {
            text: "확인",
            onPress: () =>
              router.push({
                pathname: "/ResetPasswordPage",
                params: { email: fullEmail },
              }),
          },
        ]);
      } else {
        Alert.alert("인증 실패", res.message || "잘못된 인증번호입니다.");
      }
    } catch (err) {
      console.error("인증번호 확인 실패:", err);
      Alert.alert("오류", "서버 요청 중 문제가 발생했습니다.");
    }
  };

  return (
    <View className="flex-1 bg-[#F5FCE9]">
      <Stack.Screen options={{ headerShown: false }} />
      <TopBar
        showBackButton
        onBackPress={() => router.replace("/LoginPage")}
      />

      <View className="flex-[0.75] items-center justify-center">
        <Text className="text-2xl font-bold text-[#002C09] mb-10">
          비밀번호 변경하기
        </Text>

        {/* 이메일 입력 */}
        <EmailInputWithSelect
          emailId={emailId}
          onChangeEmailId={setEmailId}
          emailDomain={emailDomain}
          onChangeEmailDomain={setEmailDomain}
          onPressVerify={handleVerify}
        />

        {/* 본인인증 성공 시 인증번호 입력 박스 표시 */}
        {showCodeInput && (
          <View className="mt-3">
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

      {/* 이메일 발송 모달 */}
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
