import { Modal } from "@/components/common/Modal";
import TopBar from "@/components/common/TopBar";
import EmailInputWithSelect from "@/components/screens/SignUp/EmailInputWithSelect";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

const CertificationPage = () => {
  const router = useRouter();

  // ResetPasswordPage에서 push로 넘겨받은 이메일
  const { email } = useLocalSearchParams<{ email?: string }>();

  // email이 있으면 아이디/도메인 분리
  const [emailId, setEmailId] = useState("");
  const [emailDomain, setEmailDomain] = useState("@gmail.com");

  useEffect(() => {
    if (email) {
      const [id, domain] = email.split("@");
      setEmailId(id);
      setEmailDomain("@" + domain);
    }
  }, [email]);

  const [modalVisible, setModalVisible] = useState(false);

  const handleVerify = () => {
    if (!emailId) return;
    setModalVisible(true);
  };

  const handleModalConfirm = () => {
    setModalVisible(false);

    const fullEmail = `${emailId}${emailDomain}`;
    router.push({
      pathname: "/ResetPasswordPage",
      params: { email: fullEmail },
    });
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

        <EmailInputWithSelect
          // ✅ 여기가 중요!! — state를 input value로 넘겨줘야 화면에 표시돼
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
