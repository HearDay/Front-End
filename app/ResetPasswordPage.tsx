import InputBox from "@/components/common/InputBox";
import { Modal } from "@/components/common/Modal";
import PrimaryButton from "@/components/common/PrimaryButton";
import TopBar from "@/components/common/TopBar";
import { resetPassword } from "@/services/api/resetpassword";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";

const ResetPasswordPage = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>(); // CertificationPage에서 전달됨

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleNext = async () => {
    if (!newPassword || !confirmPassword) {
      setModalMessage("비밀번호를 모두 입력해주세요.");
      setIsSuccess(false);
      setModalVisible(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setModalMessage("비밀번호가 일치하지 않습니다.");
      setIsSuccess(false);
      setModalVisible(true);
      return;
    }

    try {
      const res = await resetPassword({
        email: String(email),
        password: newPassword,
      });

      if (res.success) {
        setModalMessage("비밀번호가 성공적으로 변경되었습니다.");
        setIsSuccess(true);
      } else {
        setModalMessage(res.message || "비밀번호 변경에 실패했습니다.");
        setIsSuccess(false);
      }
    } catch (err) {
      console.error(err);
      setModalMessage("서버 오류가 발생했습니다. 다시 시도해주세요.");
      setIsSuccess(false);
    }

    setModalVisible(true);
  };

  const handleModalConfirm = () => {
    setModalVisible(false);
    if (isSuccess) router.replace("/LoginPage");
  };

  return (
    <View className="flex-1 bg-[#F5FCE9]">
      <Stack.Screen options={{ headerShown: false }} />

      <TopBar showBackButton />

      <View className="flex-[0.8] items-center justify-center">
        <Text className="text-2xl font-bold mb-6 text-[#002C09]">
          비밀번호 변경하기
        </Text>

        <InputBox
          placeholder="새 비밀번호"
          value={newPassword}
          onChangeText={setNewPassword}
          variant="password"
        />

        <View className="mt-6">
          <InputBox
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            variant="password"
          />
        </View>

        <View className="mt-6">
          <PrimaryButton title="다음" variant="primary" onPress={handleNext} />
        </View>
      </View>

      <Modal
        visible={modalVisible}
        title={modalMessage}
        confirmText="확인"
        onConfirm={handleModalConfirm}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default ResetPasswordPage;
