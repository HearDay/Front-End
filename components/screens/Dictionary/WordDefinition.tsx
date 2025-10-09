import { ScrollView, Text, View } from 'react-native';

interface WordDefinitionProps {
  word: string
  definitions: string[]  // 여러 개 뜻
}

export const WordDefinition = (
{ word, definitions }: WordDefinitionProps) => (
  <ScrollView className="max-h-64">
    {/* 흥행 부분 */}
    <View className="mb-4">
      <Text className="text-2xl font-bold text-center">{word}</Text>
    </View>

    {/* 뜻 */}
    <View className="bg-blue-50 rounded-2xl p-4">
      {definitions.map((definition, index) => (
        <View key={index} className="mb-3">
          <Text className="text-base leading-6 text-gray-800">
            {index + 1}. {definition}
          </Text>
        </View>
      ))}
    </View>
  </ScrollView>
);