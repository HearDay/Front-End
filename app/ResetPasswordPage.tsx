import InputBox from "@/components/common/InputBox";
import { Modal } from "@/components/common/Modal";
import PrimaryButton from "@/components/common/PrimaryButton";
import TopBar from "@/components/common/TopBar";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";

const ResetPasswordPage = () => {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); // 모달 타입 구분용

  const handleNext = () => {
    if (!newPassword || !confirmPassword) {
      setModalMessage("비밀번호를 모두 입력해주세요.");
      setIsSuccess(false);
      setModalVisible(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setModalMessage("이전 비밀번호와 같지 않아야 합니다.");
      setIsSuccess(false);
      setModalVisible(true);
      return;
    }

    // 성공 시
    setModalMessage("비밀번호가 성공적으로 변경되었습니다.");
    setIsSuccess(true);
    setModalVisible(true);
  };

  // ✅ 모달 확인 버튼 클릭 시
  const handleModalConfirm = () => {
    setModalVisible(false);

    if (isSuccess) {
      router.replace("/LoginPage"); // 성공 시 로그인 페이지로 이동
    }
  };

  return (
    <View className="flex-1 bg-[#F5FCE9]">
      <Stack.Screen options={{ headerShown: false }} />

      <TopBar showBackButton />

      <View className="flex-[0.8] items-center justify-center">
        <Text
          className="text-2xl font-bold mb-8 text-[#002C09]"
        >
          비밀번호 변경하기
        </Text>

        {/* 새 비밀번호 */}
        <InputBox
          placeholder="새 비밀번호"
          value={newPassword}
          onChangeText={setNewPassword}
          variant="password"
        />

        {/* 새 비밀번호 확인 */}
        <View className="mt-6">
          <InputBox
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            variant="password"
          />
        </View>

        {/* 다음 버튼 */}
        <View className="mt-6">
          <PrimaryButton title="다음" variant="primary" onPress={handleNext} />
        </View>
      </View>

      {/* 모달 */}
      <Modal
        visible={modalVisible}
        title={modalMessage}
        onConfirm={handleModalConfirm}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default ResetPasswordPage;
