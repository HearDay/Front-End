import { Modal } from "@/components/common/Modal";
import PrimaryButton from "@/components/common/PrimaryButton";
import TopBar from "@/components/common/TopBar";
import { resetPassword } from "@/services/api/resetpassword";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Platform, Text, TextInput, TouchableOpacity, View } from "react-native";

const ResetPasswordPage = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>(); // CertificationPage에서 전달됨

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSecure1, setIsSecure1] = useState(true);
  const [isSecure2, setIsSecure2] = useState(true);
  const [delayedSecure1, setDelayedSecure1] = useState(isSecure1);
  const [delayedSecure2, setDelayedSecure2] = useState(isSecure2);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // ✅ iOS secureTextEntry 버그 대응 (한 템포 늦춰 적용)
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

      <TopBar
        showBackButton
        onBackPress={() =>
          router.push({
            pathname: "/CertificationPage",
            params: { email },
          })
        }
      />

      <View className="flex-[0.8] items-center justify-center">
        <Text className="text-2xl font-bold mb-6 text-[#002C09]">
          비밀번호 변경하기
        </Text>

        {/* ✅ 첫 번째 비밀번호 입력 */}
        <View
          className="flex-row items-center w-[350px] h-[50px] bg-[#FEFFF5] rounded-[10px] px-6"
          style={{
            paddingVertical: Platform.OS === "ios" ? 10 : 6,
          }}
        >
          <TextInput
            placeholder="새 비밀번호"
            placeholderTextColor="#8AA989"
            value={newPassword}
            onChangeText={setNewPassword}
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
            textContentType="none"
          />
          <TouchableOpacity onPress={() => setIsSecure1(!isSecure1)}>
            {isSecure1 ? (
              <EyeOff size={22} color="#8AA989" />
            ) : (
              <Eye size={22} color="#8AA989" />
            )}
          </TouchableOpacity>
        </View>

        {/* ✅ 두 번째 비밀번호 확인 입력 */}
        <View
          className="flex-row items-center w-[350px] h-[50px] bg-[#FEFFF5] rounded-[10px] px-6 mt-6"
          style={{
            paddingVertical: Platform.OS === "ios" ? 10 : 6,
          }}
        >
          <TextInput
            placeholder="새 비밀번호 확인"
            placeholderTextColor="#8AA989"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
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
            textContentType="none"
          />
          <TouchableOpacity onPress={() => setIsSecure2(!isSecure2)}>
            {isSecure2 ? (
              <EyeOff size={22} color="#8AA989" />
            ) : (
              <Eye size={22} color="#8AA989" />
            )}
          </TouchableOpacity>
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
