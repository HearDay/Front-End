import TopBar from '@/components/common/TopBar';
import { DictionaryModalTest, DictionarySearchBar } from '@/components/screens/Dictionary';
import { useRef, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NewsArticleContent } from './NewsArticleContent';
import { NewsArticleImage } from './NewsArticleImage';

export function NewsArticleTest() {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [highlightWord, setHighlightWord] = useState<string | undefined>();
  const [showDictionaryModal, setShowDictionaryModal] = useState(false);
  const [selectedWord, setSelectedWord] = useState('');
  const [wordSaved, setWordSaved] = useState(false);

  const scrollRef = useRef<ScrollView>(null);

  const dummyNews = {
    id: 'test-1',
    title: '오픈AI "내년 개인정보 필터" 오픈소스로 공개',
    imageUrl: 'https://via.placeholder.com/400x300',
    content: `일본 애니메이션 〈귀멸의 칼날〉이 북미 박스오피스에서 역대급 성적을 거뒀습니다.

극장판(無限列車)는 박스오피스 집계 사이트 박스오피스 모조에 따르면, 

북미에서 개봉 첫 주말 3300만 달러(약 460억 원)를 벌어들이며 박스오피스 1위에 올랐습니다.

같은 주말에 북미에서 개봉한 외화 중 가장 높은 흥행 성적을 기록했다고 밝혔습니다.`,
  };

  const handleImagePress = () => {
    scrollRef.current?.scrollTo({ y: 300, animated: true });
  };

  const handleSearch = (word: string) => {
    setHighlightWord(word);
  };

  const handleWordPress = (word: string) => {
    setSelectedWord(word);
    setShowDictionaryModal(true);
    setWordSaved(false);
  };

  const handleSaveWord = () => {
    console.log('단어 저장:', selectedWord);
    setWordSaved(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopBar showBackButton={true} />

      <ScrollView ref={scrollRef} className="flex-1">
        <NewsArticleImage 
          imageUrl={dummyNews.imageUrl}
          onPress={handleImagePress}
        />

        <NewsArticleContent
          content={dummyNews.content}
          highlightWord={highlightWord}
          onWordPress={handleWordPress}
        />
      </ScrollView>

      {/* 검색창 & 돋보기 통합 */}
      <View className="absolute bottom-8 right-6">
        {!showSearchBar ? (
          <TouchableOpacity
            onPress={() => setShowSearchBar(true)}
            className="bg-green-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
          >
            <Text className="text-2xl">🔍</Text>
          </TouchableOpacity>
        ) : (
          <DictionarySearchBar
            visible={showSearchBar}
            onClose={() => setShowSearchBar(false)}
            onSearch={handleSearch}
          />
        )}
      </View>

      {/* 단어 뜻 모달 */}
      <DictionaryModalTest
        visible={showDictionaryModal}
        word={selectedWord}
        isSaved={wordSaved}
        onClose={() => setShowDictionaryModal(false)}
        onSave={handleSaveWord}
      />
    </SafeAreaView>
  );
}