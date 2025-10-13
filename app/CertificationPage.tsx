import { Modal } from "@/components/common/Modal";
import TopBar from "@/components/common/TopBar";
import EmailInputWithSelect from "@/components/screens/SignUp/EmailInputWithSelect";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";

const FindIdPage = () => {
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
    router.replace("/ResetPasswordPage");
  };

  return (
    <View className="flex-1 bg-[#F5FCE9]">

      <Stack.Screen options={{ headerShown: false }} />

      <TopBar showBackButton />

      <View className="flex-[0.75] items-center justify-center">
        <Text
          className="text-[20px] font-semibold mb-10"
          style={{ color: "#002C09" }}
        >
          아이디 찾기
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
        onConfirm={handleModalConfirm}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default FindIdPage;
