import { Modal } from "@/components/common/Modal";
import TopBar from "@/components/common/TopBar";
import EmailInputWithSelect from "@/components/screens/SignUp/EmailInputWithSelect";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";

const CertificationPage = () => {
  const router = useRouter();

  const [emailId, setEmailId] = useState("");
  const [emailDomain, setEmailDomain] = useState("@gmail.com");
  const [modalVisible, setModalVisible] = useState(false);

  const handleVerify = () => {
    if (!emailId) return;
    setModalVisible(true);
  };

  const handleModalConfirm = () => {
    setModalVisible(false);

    // 전체 이메일 주소 조합 후 비밀번호 재설정 페이지로 전달
    const fullEmail = `${emailId}${emailDomain}`;
    router.replace({
      pathname: "/ResetPasswordPage",
      params: { email: fullEmail },
    });
  };

  return (
    <View className="flex-1 bg-[#F5FCE9]">
      <Stack.Screen options={{ headerShown: false }} />

      <TopBar showBackButton />

      <View className="flex-[0.75] items-center justify-center">
        <Text className="text-2xl font-bold text-[#002C09] mb-10">
          비밀번호 변경하기
        </Text>

        <EmailInputWithSelect
          emailId={emailId}
          onChangeEmailId={setEmailId}
          emailDomain={emailDomain}
          onChangeEmailDomain={setEmailDomain}
          onPressVerify={handleVerify}
        />
      </View>

      <Modal
        visible={modalVisible}
        title="이메일에서 인증을 완료해주세요."
        confirmText="확인"
        onConfirm={handleModalConfirm}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default CertificationPage;
