import InputBox from "@/components/common/InputBox";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface EmailInputWithSelectProps {
  emailId: string;
  onChangeEmailId: (text: string) => void;
  emailDomain: string;
  onChangeEmailDomain: (domain: string) => void;
  onPressVerify: () => void;
  disabled?: boolean;
  buttonType?: "verify" | "confirm";
}

const EmailInputWithSelect = ({
  emailId,
  onChangeEmailId,
  emailDomain,
  onChangeEmailDomain,
  onPressVerify,
  disabled = false,
  buttonType = "verify",
}: EmailInputWithSelectProps) => {
  const domains = ["@gmail.com", "@naver.com", "@daum.net"];
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const buttonText = buttonType === "verify" ? "확인" : "본인인증";

  return (
    <View className="w-full max-w-[380px] flex-row items-center gap-2 ">
      {/* 이메일 ID */}
      <View className="flex-1">
        <InputBox
          placeholder="이메일"
          value={emailId}
          onChangeText={onChangeEmailId}
          editable={!disabled}
          variant="default"
          style={{
            backgroundColor: disabled ? "#E5E5E5" : "#FEFFF5",
          }}
        />
      </View>

      {/* 도메인 선택 */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => !disabled && setDropdownVisible(true)}
        disabled={disabled}
        className="flex-row items-center justify-between h-[48px] px-3 rounded-[10px] border border-[#9CB59F] bg-white"
        style={{ opacity: disabled ? 0.5 : 1 }}
      >
        <Text className="text-[14px] text-[#1F2D1F] mr-1">
          {emailDomain}
        </Text>
        <Image
          source={require("../../../my-expo-app/assets/images/Down.png")}
          className="w-4 h-4"
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* 인증 버튼 */}
      <TouchableOpacity
        onPress={onPressVerify}
        activeOpacity={0.8}
        disabled={disabled}
        className={`h-[48px] px-4 rounded-[10px] border border-[#1B8131] items-center justify-center bg-white ${
          disabled ? "opacity-40" : "opacity-100"
        }`}
      >
        <Text className="text-[15px] font-semibold text-[#1B8131]">
          {buttonText}
        </Text>
      </TouchableOpacity>

      {/* 도메인 드롭다운 */}
      <Modal
        transparent
        visible={isDropdownVisible}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
          className="flex-1 justify-center items-center bg-[rgba(0,0,0,0.3)]"
        >
          <View className="bg-white w-[220px] rounded-[12px] border border-[#9CB59F]">
            <FlatList
              data={domains.filter((d) => d !== emailDomain)}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    onChangeEmailDomain(item);
                    setDropdownVisible(false);
                  }}
                  className="px-4 py-3"
                >
                  <Text className="text-[#1F2D1F] text-[14px]">
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default EmailInputWithSelect;
