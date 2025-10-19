import React, { useState } from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";

export default function ChatInputBar() {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim().length === 0) return;
    console.log("Send message:", message);
    setMessage("");
  };

  return (
    <View className="w-full items-center bg-[#FEFFF5] px-4 pb-6">
      <View
        className="flex-row items-center justify-between w-[340px] h-[50px] px-4 mb-7"
        style={{
          backgroundColor: "#F3FEEE",
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#C9C9C9",
        }}
      >
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="메시지를 입력하세요..."
          placeholderTextColor="#9C9C9C"
          className="flex-1 text-[13px] text-[#222222]"
          multiline
        />
        <TouchableOpacity onPress={handleSend} activeOpacity={0.7}>
          <Image
            source={require("../../../my-expo-app/assets/images/Send.png")}
            className="w-[30px] h-[30px]"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
