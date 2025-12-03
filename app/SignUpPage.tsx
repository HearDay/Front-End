import InputBox from "@/components/common/InputBox";
import { Modal } from "@/components/common/Modal";
import PrimaryButton from "@/components/common/PrimaryButton";
import TopBar from "@/components/common/TopBar";
import EmailInputWithSelect from "@/components/screens/SignUp/EmailInputWithSelect";
import InputBoxWithButton from "@/components/screens/SignUp/InputWithButton";
import TermsAgreement from "@/components/screens/SignUp/TermsAgreement";
import { sendCertificationCode, verifyCertificationCode } from "@/services/api/certification";
import { signup } from "@/services/api/signup";
import { Stack, useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SignUpPage = () => {
  const router = useRouter();

  const [nickname, setNickname] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [phone, setPhone] = useState("");
  const [emailId, setEmailId] = useState("");
  const [emailDomain, setEmailDomain] = useState("@gmail.com");
  const [certificationCode, setCertificationCode] = useState("");

  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [terms, setTerms] = useState({
    service: false,
    privacy: false,
    marketing: false,
  });

  const [isSecure1, setIsSecure1] = useState(true);
  const [isSecure2, setIsSecure2] = useState(true);
  const [delayedSecure1, setDelayedSecure1] = useState(isSecure1);
  const [delayedSecure2, setDelayedSecure2] = useState(isSecure2);

  const [showCodeInput, setShowCodeInput] = useState(false);

  // 모달 관련 상태
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState<() => void>(() => () => {});

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

  const allRequiredAgreed = terms.service && terms.privacy;

  // 모달 열기 함수
  const showModal = (message: string, onConfirm?: () => void) => {
    setModalMessage(message);
    setOnConfirmAction(() => onConfirm || (() => setModalVisible(false)));
    setModalVisible(true);
  };

  const handleModalConfirm = () => {
    setModalVisible(false);
    onConfirmAction();
  };

  // 이메일 인증번호 전송
  const handleVerify = async () => {
    const fullEmail = `${emailId}${emailDomain}`;
    if (!emailId) return showModal("이메일을 입력해주세요.");

    try {
      const res = await sendCertificationCode(fullEmail);
      if (res.success) {
        setShowCodeInput(true);
        showModal("이메일로 인증코드를 발송했습니다.\n5분 안에 인증을 완료해주세요.");
      } else {
        showModal(res.message || "이메일 전송에 실패했습니다.");
      }
    } catch (err) {
      showModal("서버 요청 중 문제가 발생했습니다.");
    }
  };

  // 인증번호 확인
  const handleCodeConfirm = async () => {
    const fullEmail = `${emailId}${emailDomain}`;
    if (!certificationCode) return showModal("인증번호를 입력해주세요.");

    try {
      const res = await verifyCertificationCode(fullEmail, certificationCode);
      if (res.success) {
        setIsEmailVerified(true);
        showModal("이메일 인증이 성공적으로 완료되었습니다!");
      } else {
        setIsEmailVerified(false);
        showModal(res.message || "잘못된 인증번호입니다.");
      }
    } catch (err) {
      showModal("서버 요청 중 문제가 발생했습니다.");
    }
  };

  // 회원가입 버튼 활성 조건
  const isSignUpEnabled =
    allRequiredAgreed &&
    isEmailVerified &&
    nickname.trim() !== "" &&
    pwd.trim() !== "" &&
    pwd === confirmPw &&
    phone.trim() !== "";

  // 회원가입 요청
  const handleSignUp = async () => {
    if (!isSignUpEnabled) {
      return showModal("모든 항목을 올바르게 입력하고 인증을 완료해주세요!");
    }

    const body = {
      nickname,
      password: pwd,
      email: `${emailId}${emailDomain}`,
      phone,
    };

    try {
      const res = await signup(body);

      if (res.success) {
        showModal("회원가입이 완료되었습니다!\n선호 카테고리를 선택해주세요.", () =>
          router.push({
            pathname: "/SelectCategoryPage",
            params: {
              nickname,
              password: pwd,
              email: `${emailId}${emailDomain}`,
              phone,
            },
          })
        );
      } else {
        showModal(res.message || "회원가입 중 오류가 발생했습니다.");
      }
    } catch (err: any) {
      showModal(err.response?.data?.message || "요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <View className="flex-1 bg-[#F5FCE9]">
      <Stack.Screen options={{ headerShown: false }} />
      <TopBar showBackButton onBackPress={() => router.push("/LoginPage")} />

      {/* ScrollView */}
      <View className="flex-1 items-center">
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

        {/* 이메일 입력 */}
        <View>
          <EmailInputWithSelect
            emailId={emailId}
            onChangeEmailId={setEmailId}
            emailDomain={emailDomain}
            onChangeEmailDomain={setEmailDomain}
            onPressVerify={handleVerify}
            disabled={isEmailVerified} 
          />
        </View>

        {/* 인증번호 입력 */}
        {showCodeInput && (
          <View className="mb-3">
            <InputBoxWithButton
              placeholder="인증번호"
              value={certificationCode}
              onChangeText={setCertificationCode}
              buttonText="확인"
              onPressButton={handleCodeConfirm}
              disabled={isEmailVerified} 
            />
          </View>
        )}

        {/* 닉네임 */}
        <View>
          <InputBox placeholder="닉네임" value={nickname} onChangeText={setNickname} />
        </View>

        {/* 비밀번호 */}
        <View
          className="flex-row items-center w-[350px] h-[50px] bg-[#FEFFF5] rounded-[10px] px-6 mt-3"
          style={{ paddingVertical: Platform.OS === "ios" ? 10 : 6 }}
        >
          <TextInput
            placeholder="비밀번호"
            placeholderTextColor="#8AA989"
            value={pwd}
            onChangeText={setPwd}
            secureTextEntry={delayedSecure1}
            style={{
              flex: 1,
              fontSize: 17,
              color: "#1F2D1F",
              paddingVertical: 0,
            }}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            importantForAutofill="no"
            textContentType="oneTimeCode"
          />
          <TouchableOpacity onPress={() => setIsSecure1(!isSecure1)}>
            {isSecure1 ? (
              <EyeOff size={22} color="#8AA989" />
            ) : (
              <Eye size={22} color="#8AA989" />
            )}
          </TouchableOpacity>
        </View>

        {/* 비밀번호 확인 */}
        <View
          className="flex-row items-center w-[350px] h-[50px] bg-[#FEFFF5] rounded-[10px] px-6 mt-3"
          style={{ paddingVertical: Platform.OS === "ios" ? 10 : 6 }}
        >
          <TextInput
            placeholder="비밀번호 확인"
            placeholderTextColor="#8AA989"
            value={confirmPw}
            onChangeText={setConfirmPw}
            secureTextEntry={delayedSecure2}
            style={{
              flex: 1,
              fontSize: 17,
              color: "#1F2D1F",
              paddingVertical: 0,
            }}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            importantForAutofill="no"
            textContentType="oneTimeCode"
          />
          <TouchableOpacity onPress={() => setIsSecure2(!isSecure2)}>
            {isSecure2 ? (
              <EyeOff size={22} color="#8AA989" />
            ) : (
              <Eye size={22} color="#8AA989" />
            )}
          </TouchableOpacity>
        </View>

        {/* 전화번호 */}
        <View className="mt-3">
          <InputBox
            placeholder="전화번호 (-없이 번호 입력)"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* 안내 문구 */}
        <View className="w-[350px] mt-2 mb-2">
          <Text className="text-[11px] text-[#B7B7B7] leading-5 ml-3">
            • 앱의 모든 기능을 원활하게 사용하기 위해서 정확한 정보를 입력해야 합니다{"\n"}
            • 본인확인 및 보안을 위한 정보이며, 다른 용도로 사용되지 않습니다
          </Text>
        </View>

        {/* 약관 */}
        <TermsAgreement value={terms} onChange={setTerms} />

        {/* 회원가입 버튼 */}
        <PrimaryButton
          title="회원가입"
          variant={isSignUpEnabled ? "primary" : "secondary"}
          onPress={handleSignUp}
        />
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

export default SignUpPage;
