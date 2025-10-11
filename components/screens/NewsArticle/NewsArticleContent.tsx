import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { NewsArticleContentProps } from '../../../types/screens';

export function NewsArticleContent ({ 
  content, 
  highlightWord,
  onWordPress 
}: NewsArticleContentProps) {
  
  // 단어 하이라이트 처리
  const renderContent = () => {
    if (!highlightWord) {
      return <Text className="text-base leading-7 text-gray-800">{content}</Text>
    }

    const parts = content.split(new RegExp(`(${highlightWord})`, 'gi'));

    return (
      <Text className="text-base leading-7 text-gray-800">
        {parts.map((part, index) => 
          part.toLowerCase() === highlightWord.toLowerCase() ? (
            <TouchableOpacity key={index} onPress={() => onWordPress(part)}>
              <Text className="bg-yellow-200 font-bold">{part}</Text>
            </TouchableOpacity>
          ) : (
            <Text key={index}>{part}</Text>
          )
        )}
      </Text>
    )
  }

  return (
    <ScrollView className="flex-1 px-6 py-4">
      {renderContent()}
    </ScrollView>
  )
}