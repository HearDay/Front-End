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
    <View className="flex-row items-center w-[350px] mx-auto mb-3 gap-2">
      {/* 이메일 아이디 입력 */}
      <View className="flex-1">
        <InputBox
          placeholder="이메일"
          value={emailId}
          onChangeText={onChangeEmailId}
          variant="default"
          editable={!disabled}
          style={{ width: 260, backgroundColor: disabled ? "#E5E5E5" : "#FEFFF5" }}
        />
      </View>

      {/* 도메인 선택 (disabled일 때 선택 불가능) */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => !disabled && setDropdownVisible(true)} 
        disabled={disabled}
        style={{
          borderColor: "#9CB59F",
          borderWidth: 1,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
          backgroundColor: disabled ? "#E5E5E5" : "white",
        }}
        className="flex-row justify-between items-center px-3 w-[130px] h-[50px]"
      >
        <Text
          className="text-[#1F2D1F] mr-1 text-[14px]"
          style={{ color: disabled ? "#8A8A8A" : "#1F2D1F" }}
        >
          {emailDomain}
        </Text>

        <Image
          source={require("../../../my-expo-app/assets/images/Down.png")}
          style={{ width: 20, height: 20, opacity: disabled ? 0.4 : 1 }} 
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* 인증 버튼 */}
      <TouchableOpacity
        onPress={onPressVerify}
        activeOpacity={0.8}
        disabled={disabled}
        className={`w-[80px] h-[50px] bg-white rounded-[10px] border border-[#1B8131] items-center justify-center ${
          disabled ? "opacity-40" : "opacity-100"
        }`}
      >
        <Text className="text-lg font-semibold text-[#1B8131]">
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
          <View className="bg-white w-[200px] rounded-[12px] border border-[#9CB59F] shadow-lg">
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
                  <Text className="text-[#1F2D1F] text-[14px]">{item}</Text>
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
