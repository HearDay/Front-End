import { useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { NewsArticleContentProps } from '../../../types/screens';

export function NewsArticleContent ({
  content,
  highlightWord,
  onWordPress,
  highlightMatches = [],
}: NewsArticleContentProps) {

  // 단어 하이라이트 처리 로직 개선
  const renderContent = useMemo(() => {
    if (!highlightWord || highlightMatches.length === 0) {
      return <Text className="text-base leading-7 text-gray-800">{content}</Text>
    }

    const parts = [];
    let lastIndex = 0;

    highlightMatches.forEach((match, index) => {
      // 하이라이트 이전 텍스트
      if (match.start > lastIndex) {
        parts.push(
          <Text key={`text-${lastIndex}`}>{content.substring(lastIndex, match.start)}</Text>
        );
      }

      const word = content.substring(match.start, match.end);

      // 하이라이트 텍스트 - 모두 같은 색상 (#FFD700)으로 통일
      parts.push(
        <TouchableOpacity key={`match-${index}`} onPress={() => onWordPress(word)}>
          <Text style={{
            backgroundColor: '#FFD700',
            fontWeight: 'bold',
          }}>
            {word}
          </Text>
        </TouchableOpacity>
      );
      lastIndex = match.end;
    });

    // 마지막 하이라이트 이후 텍스트
    if (lastIndex < content.length) {
      parts.push(
        <Text key={`text-${lastIndex}`}>{content.substring(lastIndex)}</Text>
      );
    }

    return <Text className="text-base leading-7 text-gray-800">{parts}</Text>;
  }, [content, highlightWord, highlightMatches, onWordPress]);

  return (
    <ScrollView className="flex-1 px-6 py-4">
      {renderContent}
    </ScrollView>
  )
}