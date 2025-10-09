import { Text, TextInput, View } from 'react-native';

interface SavedNewsSearchBarProps {
  value: string
  onChangeText: (text: string) => void
}

export const SavedNewsSearchBar = ({
  value,
  onChangeText,
}: SavedNewsSearchBarProps) => (
  <View className="bg-gray-100 mx-4 my-4 rounded-full 
    px-4 py-3 flex-row items-center">
    <Text className="text-xl mr-2">🔍</Text>
    <TextInput
      className="flex-1 text-base"
      placeholder="저장된 뉴스를 검색해보세요."
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor="#9CA3AF"
    />
  </View>
)