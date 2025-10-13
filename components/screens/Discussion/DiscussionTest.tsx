import TopBar from '@/components/common/TopBar'
import { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { DiscussionNewsItem } from '../../../types/screens'
import { DiscussionActionButtons } from './DiscussionActionButtons'
import { DiscussionHeader } from './DiscussionHeader'
import { DiscussionModal } from './DiscussionModal'
import { DiscussionNewsList } from './DiscussionNewsList'

const DUMMY_VIEWED_NEWS: DiscussionNewsItem[] = [
  {
    id: 'news-1',
    title: '오픈AI "내년 개인정보 필터" 오픈소스로 공개',
    summary: '오픈AI가 개인정보 보호 강화를 위해 차세대 개발한 개인정보 필터를 내년 오픈소스로 공개하겠다고 밝혔습니다.',
    imageUrl: 'https://via.placeholder.com/150',
    viewedAt: '2025-01-19',
  },
  {
    id: 'news-2',
    title: '글로벌 경제 불확실성 속 국내 증시 영향',
    summary: '글로벌 경제 불확실성이 커지면서 국내 증시에도 영향을 미치고 있습니다.',
    imageUrl: 'https://via.placeholder.com/150',
    viewedAt: '2025-01-18',
  },
  {
    id: 'news-3',
    title: '환경부, 2030년까지 탄소중립 로드맵 발표',
    summary: '환경부가 2030년까지 탄소중립을 달성하기 위한 구체적인 로드맵을 발표했습니다.',
    imageUrl: 'https://via.placeholder.com/150',
    viewedAt: '2025-01-17',
  },
]

export function DiscussionTest() {
  const [viewedNews] = useState<DiscussionNewsItem[]>(DUMMY_VIEWED_NEWS)
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'views'>('latest')
  const [showModal, setShowModal] = useState(false)
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null)

  const handleDiscussionPress = useCallback(() => {
    console.log('토론하기')
  }, [])

  const handleRecordPress = useCallback(() => {
    console.log('기록보기')
  }, [])

  const handleNewsPress = useCallback((newsId: string) => {
    setSelectedNewsId(newsId)
    setShowModal(true)
  }, [])

  const handleStartDiscussion = useCallback((type: 'voice' | 'chat', newsId: string) => {
    setShowModal(false)
    console.log('토론 시작:', type, newsId)
  }, [])

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <TopBar showBackButton={false} />

      <DiscussionHeader />

      <DiscussionActionButtons
        onDiscussionPress={handleDiscussionPress}
        onRecordPress={handleRecordPress}
      />

      <DiscussionNewsList
        news={viewedNews}
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
  )
}