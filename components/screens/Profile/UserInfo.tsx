import { LinearGradient } from "expo-linear-gradient";
import { Image, Text, View } from "react-native";

interface UserInfoProps {
  nickname: string;
  email: string;
  level: number;
  point: number;
}

// 레벨별 기준 누적 포인트
const LEVEL_THRESHOLDS = {
  1: 0,
  2: 50,
  3: 130,
  4: 250,
  5: 430,
  6: 680,
};

// 각 레벨의 요구 포인트
const LEVEL_REQUIRE = {
  2: 50,
  3: 80,
  4: 120,
  5: 180,
  6: 250,
  max: 350,
};

const UserInfo = ({ nickname, email, level, point }: UserInfoProps) => {
  let currentPoint = 0;
  let nextRequire = 0;
  let remain = 0;

  const basePoint = LEVEL_THRESHOLDS[level];

  if (level === 6) {
    currentPoint = point - basePoint;
    nextRequire = LEVEL_REQUIRE.max;
    remain = Math.max(0, nextRequire - currentPoint);
  } else {
    nextRequire = LEVEL_REQUIRE[level + 1];
    currentPoint = point - basePoint;
    remain = nextRequire - currentPoint;
  }

  const progress = currentPoint / nextRequire;

  return (
    <View className="w-full max-w-[380px]">
      {/* 프로필 상단 */}
      <View className="flex-row items-center gap-4 px-2">
        <Image
          source={require("../../../my-expo-app/assets/images/DefaultProfile.png")}
          className="w-[76px] h-[76px] rounded-full"
          resizeMode="contain"
        />

        <View className="flex-1">
          <Text className="text-black font-semibold text-[18px]">
            {nickname}
          </Text>

          <Text className="text-green-700 text-[15px] mt-1">
            {email}
          </Text>

          {/* LEVEL · POINT */}
          <View className="flex-row items-center mt-2 flex-wrap">
            <Text className="text-gray-400 text-[14px] mr-1">LEVEL</Text>
            <Text className="text-black text-[14px] font-medium mr-4">
              {level}
            </Text>

            <Text className="text-gray-400 text-[14px] mr-1">POINT</Text>
            <Text className="text-black text-[14px] font-medium">
              {currentPoint}
              <Text className="text-gray-300">/{nextRequire}</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* 레벨업 문구 */}
      <Text className="text-[#00801A] text-right text-[14px] font-light mt-3 mb-1 pr-2">
        {level === 6 && currentPoint >= LEVEL_REQUIRE.max
          ? "더이상 채울 포인트가 없어요!"
          : `레벨업까지 ${remain}point 남았어요!`}
      </Text>

      {/* 게이지 바 */}
      <View className="w-full h-[10px] bg-[#D9D9D9] rounded-[10px] overflow-hidden">
        <LinearGradient
          colors={["#C9DD12", "#097745"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            width: `${Math.min(progress * 100, 100)}%`,
            height: "100%",
            borderRadius: 10,
          }}
        />
      </View>
    </View>
  );
};

export default UserInfo;
