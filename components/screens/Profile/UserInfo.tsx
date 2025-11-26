import { LinearGradient } from "expo-linear-gradient";
import { Image, Text, View } from "react-native";

interface UserInfoProps {
  nickname: string;
  email: string;
  level: number;
  point: number;
}

const UserInfo = ({ nickname, email, level, point }: UserInfoProps) => {
  const progress = point / 100;

  return (
    <View className="w-full px-6">

      <View className="flex-row items-center gap-4">
        <Image
          source={require("../../../my-expo-app/assets/images/DefaultProfile.png")}
          className="w-[85px] h-[85px] rounded-full"
        />

        {/* 닉네임, 이메일, 레벨/포인트 */}
        <View className="flex-col ml-2">
          <Text className="text-black font-semibold text-[19px]">
            {nickname}
          </Text>

          <Text className="text-green-700 font-medium text-[17px] mt-2">
            {email}
          </Text>

          {/* LEVEL · POINT */}
          <View className="flex-row items-center gap-4 mt-2">
            <Text className="text-gray-400 text-[17px]">LEVEL</Text>
            <Text className="text-black text-[17px] font-medium">{level}</Text>

            <Text className="text-gray-400 text-[17px] ml-4">POINT</Text>
            <Text className="text-black text-[17px] font-medium">
              {point}
              <Text className="text-gray-300">/100</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* 레벨업 문구 */}
      <Text className="text-[#00801A] text-right text-[16px] font-light mt-3 mr-2 ml-1 mb-1">
        레벨업까지 {100 - point}point 남았어요!
      </Text>

      {/* 게이지 바 */}
      <View className="w-[350px] h-[11px] bg-[#D9D9D9] mx-auto rounded-[10px] mt-1 overflow-hidden">
        <LinearGradient
          colors={["#C9DD12", "#097745"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            borderRadius: 10,
          }}
        />
      </View>
    </View>
  );
};

export default UserInfo;
