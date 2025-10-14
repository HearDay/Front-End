import { memo } from 'react'; // 추가: 성능 최적화
import { Text, TextInput, View } from 'react-native';

interface SavedNewsSearchBarProps {
  value: string
  onChangeText: (text: string) => void
}

// 개선: memo로 컴포넌트 감싸기
// 이유: value와 onChangeText가 변하지 않으면 리렌더링 스킵
export const SavedNewsSearchBar = memo(function SavedNewsSearchBar({
  value,
  onChangeText,
}: SavedNewsSearchBarProps) {
  return (
    <View className="bg-gray-100 mx-4 my-4 rounded-full px-4 py-3 flex-row items-center">
      <Text className="text-xl mr-2">🔍</Text>
      <TextInput
        className="flex-1 text-base"
        placeholder="저장된 뉴스를 검색해보세요."
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#9CA3AF"
        returnKeyType="search" // 추가: 키보드 "검색" 버튼
        // 이유: 검색 의도 명확히
      />
    </View>
  )
})