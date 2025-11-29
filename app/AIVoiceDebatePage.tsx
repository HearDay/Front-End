import axiosInstance from "@/services/api/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system/legacy";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Speaker = "AI" | "User" | "Pending" | "None";

export default function AIVoiceDebatePage() {
  const router = useRouter();
  const {
    articleId,
    level,
    title,
    discussionId: paramDiscussionId,
  } = useLocalSearchParams<{
    articleId?: string;
    level?: string;
    title?: string;
    discussionId?: string;
  }>();

  // discussionId를 URL에서 우선 읽기
  const [discussionId, setDiscussionId] = useState<number | null>(
    paramDiscussionId ? Number(paramDiscussionId) : null
  );

  const [currentSpeaker, setCurrentSpeaker] = useState<Speaker>("None");
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // iOS 재생 설정
  useEffect(() => {
    const setAudioMode = async () => {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });
    };
    setAudioMode();

    return () => {
      cleanUpAudio();
    };
  }, []);

  // 녹음/재생 모두 정리
  const cleanUpAudio = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync().catch(() => {});
        setRecording(null);
      }
      if (sound) {
        await sound.unloadAsync().catch(() => {});
        setSound(null);
      }
    } catch (e) {
      console.error("오디오 정리 오류:", e);
    }
  };

  // 녹음 시작
  const startRecording = async () => {
    try {
      setCurrentSpeaker("User");

      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
    } catch (err) {
      console.error("녹음 시작 실패:", err);
    }
  };

  // 녹음 종료
  const stopRecording = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (uri) sendVoice(uri);
    } catch (err) {
      console.error("녹음 종료 실패:", err);
    }
  };

  // 서버로 음성 전송
  const sendVoice = async (uri: string) => {
    try {
      setCurrentSpeaker("Pending");

      const rawToken = await AsyncStorage.getItem("accessToken");
      const token = rawToken ? rawToken.replace(/"/g, "") : "";

      if (!articleId) return;

      const ext = uri.split(".").pop();
      const mime =
        ext === "m4a"
          ? "audio/m4a"
          : ext === "caf"
          ? "audio/x-caf"
          : "audio/m4a";

      const formData = new FormData();
      formData.append("audioFile", {
        uri,
        name: `voice.${ext}`,
        type: mime,
      } as any);

      const response = await axiosInstance.post(
        `/api/discussion/voice/${articleId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          params: {
            level,
            ...(discussionId ? { discussionId } : {}),
          },
        }
      );

      let replyBase64 = response.data.data.reply;
      replyBase64 = replyBase64.replace(/^data:audio\/wav;base64,/, "");

      const newId = response.data.data.discussionId;

      // discussionId 최초 생성 시 URL에 저장
      if (newId && !discussionId) {
        setDiscussionId(newId);
        router.setParams({ discussionId: String(newId) });
      }

      await playBase64Wav(replyBase64);

      setCurrentSpeaker("AI");
    } catch (error) {
      console.error("음성 토론 실패:", error);
      setCurrentSpeaker("User");
    }
  };

  // Base64 → wav 재생
  const playBase64Wav = async (base64: string) => {
    try {
      const path = FileSystem.cacheDirectory + `ai_reply.wav`;

      await FileSystem.writeAsStringAsync(path, base64, {
        encoding: "base64",
      });

      if (sound) await sound.unloadAsync();

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: path },
        { shouldPlay: true }
      );

      setSound(newSound);
    } catch (err) {
      console.error("AI 음성 재생 실패:", err);
    }
  };

  // 상태별 이미지
  const getImageSource = () => {
    switch (currentSpeaker) {
      case "None":
        return require("../my-expo-app/assets/images/VoiceOff.png");
      case "AI":
        return require("../my-expo-app/assets/images/VoiceOn_AI.png");
      case "User":
        return require("../my-expo-app/assets/images/VoiceOn_User.png");
      default:
        return require("../my-expo-app/assets/images/VoiceOff.png");
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 items-center justify-center bg-[#FEFFF5] px-6">

        {/* 제목 */}
        <View className="items-center px-4">
          <Text className="text-left text-2xl font-semibold text-black mb-10">
            <Text className="font-black">{title ?? ""}</Text>
            <Text className="font-light"> 로 토론 중이에요!</Text>
          </Text>
        </View>

        {/* 상태 문구 */}
        {currentSpeaker === "AI" ? (
          <Text className="text-[#002C09] text-3xl font-normal mt-2">
            <Text className="font-black">AI</Text>가 말하고 있어요!
          </Text>
        ) : currentSpeaker === "User" ? (
          <Text className="text-[#002C09] text-3xl font-normal mt-2">
            <Text className="font-black">서진님</Text> 차례예요!
          </Text>
        ) : currentSpeaker === "None" ? (
          <Text className="text-[#002C09] text-3xl font-normal mt-2">
            <Text className="font-black">서진님</Text>이 준비되면 시작해요!
          </Text>
        ) : (
          <Text className="text-[#002C09] text-3xl font-normal mt-2">
            <Text className="font-black">AI</Text>가 답변을 생각하고 있어요!
          </Text>
        )}

        <Image
          source={getImageSource()}
          className="w-[310px] h-[310px] my-8"
          resizeMode="contain"
        />

        {recording ? (
          <TouchableOpacity onPress={stopRecording}>
            <Text className="text-red-600 text-[17px] underline">
              내 차례 멈추기
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={startRecording}>
            <Text className="text-[#2E7D32] text-[17px] underline">
              내 차례 시작하기
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/AIChatRecordPage",
              params: { discussionId: discussionId ?? "" },
            })
          }
        >
          <Text className="text-[#2E7D32] text-[15px] mt-10 mb-5">
            이전 대화 보러가기
          </Text>
        </TouchableOpacity>

        {/* 끝내기 */}
        <TouchableOpacity
          className="w-[101px] h-[43px] rounded-full border border-[#2E7D32] mt-10 bg-white flex items-center justify-center"
          onPress={async () => {
            await cleanUpAudio();
            router.replace("/AiPage");
          }}
        >
          <Text className="text-[#2E7D32] font-medium text-[15px] ">끝내기</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
