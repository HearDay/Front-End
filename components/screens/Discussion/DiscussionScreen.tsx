import TopBar from '@/components/common/TopBar'
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { DiscussionNewsItem } from '../../../types/screens'
import { DiscussionActionButtons } from './DiscussionActionButtons'
import { DiscussionHeader } from './DiscussionHeader'
import { DiscussionModal } from './DiscussionModal'
import { DiscussionNewsList } from './DiscussionNewsList'

export function DiscussionScreen() {
  const [viewedNews, setViewedNews] = useState<DiscussionNewsItem[]>([])
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'views'>('latest')
  const [showModal, setShowModal] = useState(false)
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null)

  useEffect(() => {
    fetchViewedNews()
  }, [sortBy])

  const fetchViewedNews = async () => {
    try {
      // TODO: API 호출
      // const response = await newsService.getViewedNews(sortBy);
      // setViewedNews(response);
      console.log('내가 본 뉴스 로드:', sortBy)
    } catch (error) {
      console.error('뉴스 로드 실패:', error)
    }
  }

  const handleDiscussionPress = () => {
    console.log('토론하기');
    // TODO: 토론 화면으로 이동
  }

  const handleRecordPress = () => {
    console.log('기록보기');
    // TODO: 기록 화면으로 이동
  }

  const handleNewsPress = (newsId: string) => {
    setSelectedNewsId(newsId)
    setShowModal(true)
  }

  const handleStartDiscussion = (type: 'voice' | 'chat', newsId: string) => {
    setShowModal(false)
    console.log('토론 시작:', type, newsId)
    // TODO: 토론 화면으로 이동 (type, newsId 전달)
  }

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