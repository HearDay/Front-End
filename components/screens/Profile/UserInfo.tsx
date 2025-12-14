import { LinearGradient } from "expo-linear-gradient";
import { Image, Text, View } from "react-native";

interface UserInfoProps {
  nickname: string;
  email: string;
  level: number;  
  point: number;   // 누적 포인트 
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
  max: 350, // 6레벨 최고 포인트
};

const UserInfo = ({ nickname, email, level, point }: UserInfoProps) => {
  let currentPoint = 0;
  let nextRequire = 0;
  let remain = 0;

  // 현재 레벨의 기준점
  const basePoint = LEVEL_THRESHOLDS[level];

  // 6레벨 만렙 처리
  if (level === 6) {
    currentPoint = point - basePoint;
    nextRequire = LEVEL_REQUIRE.max;
    remain = Math.max(0, nextRequire - currentPoint);
  } else {
    nextRequire = LEVEL_REQUIRE[level + 1];
    currentPoint = point - basePoint;
    remain = nextRequire - currentPoint;
  }

  // 게이지바 진행률
  const progress = currentPoint / nextRequire;

  return (
    <View className="w-full px-6">
      <View className="flex-row items-center gap-4">
        <Image
          source={require("../../../my-expo-app/assets/images/DefaultProfile.png")}
          className="w-[83px] h-[83px] rounded-full ml-2"
        />

        <View className="flex-col ml-2">
          <Text className="text-black font-semibold text-[19px]">
            {nickname}
          </Text>

          <Text className="text-green-700 font- text-[17px] mt-2">
            {email}
          </Text>

          {/* LEVEL · POINT */}
          <View className="flex-row items-center gap-4 mt-2">
            <Text className="text-gray-400 text-[17px]">LEVEL</Text>
            <Text className="text-black text-[17px] font-medium">{level}</Text>

            <Text className="text-gray-400 text-[17px] ml-4">POINT</Text>
            <Text className="text-black text-[17px] font-medium">
              {currentPoint}
              <Text className="text-gray-300">/{nextRequire}</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* 레벨업 문구 */}
      <Text className="text-[#00801A] text-right text-[16px] font-light mt-3 mr-2 ml-1 mb-1">
        {level === 6 && currentPoint >= LEVEL_REQUIRE.max
          ? "더이상 채울 포인트가 없어요!"
          : `레벨업까지 ${remain}point 남았어요!`}
      </Text>

      {/* 게이지 바 */}
      <View className="w-[350px] h-[11px] bg-[#D9D9D9] mx-auto rounded-[10px] mt-1 overflow-hidden">
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
