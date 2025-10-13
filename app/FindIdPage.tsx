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

  // 본인인증 버튼 클릭 시 모달 표시
  const handleVerify = () => {
    if (!emailId) return;
    setModalVisible(true);
  };

  // 모달 내 확인 버튼 클릭 시 로그인 페이지 이동
  const handleModalConfirm = () => {
    setModalVisible(false);
    router.replace("/LoginPage");
  };

  return (
    <View className="flex-1 bg-[#F5FCE9]">

      <Stack.Screen options={{ headerShown: false }} />

      <TopBar showBackButton />

      <View className="flex-[0.75] items-center justify-center">
        <Text
          className="text-2xl font-bold mb-10 text-[#002C09]"
        >
          아이디 찾기
        </Text>
        <EmailInputWithSelect
          emailId={emailId}
          onChangeEmailId={setEmailId}
          emailDomain={emailDomain}
          onChangeEmailDomain={setEmailDomain}
          onPressVerify={handleVerify}
          buttonType="confirm"
        />
      </View>
      
      <Modal
        visible={modalVisible}
        title="비밀번호가 성공적으로 변경되었습니다."
        onConfirm={handleModalConfirm}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default FindIdPage;
