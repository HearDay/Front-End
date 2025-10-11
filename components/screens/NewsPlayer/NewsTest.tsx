import { Modal } from '@/components/common';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router'; // ← ✅ 추가
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AudioControls } from './AudioControls';
import { NewsImagePlaceholder } from './NewsImagePlaceholder';

export function NewsTest() {
  const router = useRouter(); // ← ✅ 추가
  
  const [newsData, setNewsData] = useState({
    id: 'test-news-123',
    title: '오픈AI "내년 개인정보 필터" 오픈소스로 공개',
    imageUrl: 'https://via.placeholder.com/400x300',
    fullText: `17일 제이슨 켈리는 전 오픈AI CSO(최고전략책임자)는 서울
용산구에서 열린 글로벌 프라이버시 총회 기조연설에서 개인정보
필터링 오픈소스로 공개하겠다고 밝혔
이는 AI 모델이 학습 과정에서 개인정보를 보호하기 위한 기술이다
오픈AI는 이 기술을 통해 더 안전한 AI 생태계를 만들겠다고 강조했다
업계 전문가들은 이번 발표를 긍정적으로 평가하고 있다`,
    audioUrl: 'https://example.com/audio.mp3',
  });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCarMode, setIsCarMode] = useState(false);
  const [showDiscussionModal, setShowDiscussionModal] = useState(false);
  const [currentLines, setCurrentLines] = useState<string[]>([
    '17일 제이슨 켈리는 전 오픈AI CSO(최고전략책임자)는 서울',
    '용산구에서 열린 글로벌 프라이버시 총회 기조연설에서 개인정보',
    '필터링 오픈소스로 공개하겠다고 밝혔',
  ]);

  const handleBack = () => {
    router.back(); // ← ✅ 수정
  };

  const handlePlay = () => {
    setIsPlaying(true);
    console.log('재생 시작');
  };

  const handlePause = () => {
    setIsPlaying(false);
    console.log('일시정지');
  };

  const handleNext = () => {
    console.log('다음 기사');
    // TODO: API 연결 후 구현
    // const nextNewsId = getNextNewsId(newsData.id);
    // router.replace(`/newsplayer/${nextNewsId}`);
  };

  const handlePrev = () => {
    console.log('이전 기사');
    // TODO: API 연결 후 구현
    // const prevNewsId = getPrevNewsId(newsData.id);
    // router.replace(`/newsplayer/${prevNewsId}`);
  };

  const handleCarModeToggle = async () => {
    const newCarMode = !isCarMode;
    setIsCarMode(newCarMode);
    console.log('차량 모드:', newCarMode);
  };

  const handleDiscussion = () => {
    setShowDiscussionModal(true);
  };

  const handleDiscussionStart = (type: 'voice' | 'chat') => {
    setShowDiscussionModal(false);
    console.log('토론 시작:', type);
    router.push('/(tabs)/AiPage')
    // TODO: 음성/채팅 화면 완성 후 연결
    // if (type === 'voice') {
    //   router.push(`/discussion/voice/${newsData.id}`);
    // } else {
    //   router.push(`/discussion/chat/${newsData.id}`);
    // }
  };

  const handleSave = () => {
    console.log('저장 완료:', newsData.id);
    alert('뉴스가 저장되었습니다!')
    router.push('/(tabs)/savednews')
  };

  return (
    <LinearGradient
      colors={['#FFFEF0', '#E8F5E9', '#C8E6C9']}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        {/* 뒤로가기 버튼 */}
        <View className="px-4 pt-2">
          <TouchableOpacity onPress={handleBack}>
            <Text className="text-3xl">←</Text>
          </TouchableOpacity>
        </View>

        {/* 제목 */}
        <View className="px-6 pt-8 pb-6">
          <Text className="text-2xl font-bold leading-tight text-center">
            {newsData.title}
          </Text>
        </View>

        {/* 기사 이미지 - TouchableOpacity로 감싸기 */}
        <TouchableOpacity 
          onPress={() => router.push(`/newsarticle/${newsData.id}`)}
          activeOpacity={0.9}
        >
          <NewsImagePlaceholder imageUrl={newsData.imageUrl} />
        </TouchableOpacity>

        {/* 3줄 가사 - TouchableOpacity로 감싸기 */}
        <TouchableOpacity 
          onPress={() => router.push(`/newsarticle/${newsData.id}`)}
          activeOpacity={0.9}
        >
          <View className="px-6 pt-6">
            {currentLines.map((line, index) => (
              <Text 
                key={index} 
                className="text-base leading-7 text-gray-800 text-center"
              >
                {line}
              </Text>
            ))}
          </View>
        </TouchableOpacity>

        {/* Spacer */}
        <View className="flex-1" />

        {/* 재생 컨트롤 */}
        <AudioControls
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onNext={handleNext}
          onPrev={handlePrev}
        />

        {/* 하단 액션 버튼 */}
        <View className="flex-row justify-around items-center py-8 px-8">
          <TouchableOpacity 
            onPress={handleCarModeToggle}
            className="items-center"
          >
            <Text className="text-4xl">🚗</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleDiscussion}
            className="items-center"
          >
            <Text className="text-4xl">💬</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleSave}
            className="items-center"
          >
            <Text className="text-4xl">📥</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* 토론 모달 */}
      <Modal
        visible={showDiscussionModal}
        title="방금 들은 뉴스로 AI와 토론하시겠어요?"
        onConfirm={() => {}}
        onClose={() => setShowDiscussionModal(false)}
      >
        <View className="gap-3">
          <TouchableOpacity 
            className="bg-[#DBFDE0] py-4 rounded-2xl"
            onPress={() => handleDiscussionStart('voice')}
          >
            <Text className="text-center font-medium">음성으로 토론하러 가기</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-[#E5FDE8] py-4 rounded-2xl"
            onPress={() => handleDiscussionStart('chat')}
          >
            <Text className="text-center font-medium">채팅으로 토론하러 가기</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-[#EFF9F0] py-4 rounded-2xl"
            onPress={() => setShowDiscussionModal(false)}
          >
            <Text className="text-center font-medium">다음에 하기</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </LinearGradient>
  );
}