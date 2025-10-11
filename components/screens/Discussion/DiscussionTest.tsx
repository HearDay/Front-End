import TopBar from '@/components/common/TopBar';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DiscussionNewsItem } from '../../../types/screens';
import { DiscussionActionButtons } from './DiscussionActionButtons';
import { DiscussionHeader } from './DiscussionHeader';
import { DiscussionModal } from './DiscussionModal';
import { DiscussionNewsList } from './DiscussionNewsList';

export function DiscussionTest() {
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'views'>('latest');
  const [showModal, setShowModal] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);

  // 더미 데이터
  const dummyNews: DiscussionNewsItem[] = [
    {
      id: '1',
      title: '오픈AI "내년 개인정보 필터" 오픈소스로 공개',
      imageUrl: 'https://via.placeholder.com/150',
      summary: '오픈AI가 개인정보 보호 강화를 위해 차세 개발한 개인정보 필터를 내년 오픈소스로 공개하겠다고 밝혔다.',
      viewedAt: '2025-01-19T10:30:00',
      popularity: 95,
      viewCount: 15000,
    },
    {
      id: '2',
      title: '오픈AI "내년 개인정보 필터" 오픈소스로 공개',
      imageUrl: 'https://via.placeholder.com/150',
      summary: '오픈AI가 개인정보 보호 강화를 위해 차세 개발한 개인정보 필터를 내년 오픈소스로 공개하겠다고 밝혔다.',
      viewedAt: '2025-01-19T09:20:00',
      popularity: 88,
      viewCount: 12000,
    },
    {
      id: '3',
      title: '오픈AI "내년 개인정보 필터" 오픈소스로 공개',
      imageUrl: 'https://via.placeholder.com/150',
      summary: '오픈AI가 개인정보 보호 강화를 위해 차세 개발한 개인정보 필터를 내년 오픈소스로 공개하겠다고 밝혔다.',
      viewedAt: '2025-01-18T14:15:00',
      popularity: 92,
      viewCount: 18000,
    },
  ];

  const handleNewsPress = (newsId: string) => {
    setSelectedNewsId(newsId);
    setShowModal(true);
  };

  const handleStartDiscussion = (type: 'voice' | 'chat', newsId: string) => {
    setShowModal(false);
    console.log('토론 시작:', type, newsId);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <TopBar showBackButton={false} />

      <DiscussionHeader />

      <DiscussionActionButtons
        onDiscussionPress={() => console.log('토론하기')}
        onRecordPress={() => console.log('기록보기')}
      />

      <DiscussionNewsList
        news={dummyNews}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onNewsPress={handleNewsPress}
      />

      <DiscussionModal
        visible={showModal}
        newsId={selectedNewsId}
        onClose={() => setShowModal(false)}
        onStartDiscussion={handleStartDiscussion}
      />
    </SafeAreaView>
  );
}