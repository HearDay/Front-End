import { useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, Text, TextInput, TouchableOpacity } from 'react-native'
import { DictionarySearchBarProps } from '../../../types/screens'

const SCREEN_WIDTH = Dimensions.get('window').width

export function DictionarySearchBar({ 
  visible, 
  onClose, 
  onSearch 
}: DictionarySearchBarProps) {
  const [searchText, setSearchText] = useState('')
  const widthAnim = useRef(new Animated.Value(56)).current // (돋보기 크기)

  useEffect(() => {
    if (visible) {
      // 열릴 때: 오른쪽에서 왼쪽으로 확장
      Animated.spring(widthAnim, {
        toValue: SCREEN_WIDTH - 48, // 양쪽 여백 24px씩
        useNativeDriver: false,
        tension: 65,
        friction: 8,
      }).start()
    } else {
      // 닫힐 때: 다시 돋보기 크기로
      Animated.spring(widthAnim, {
        toValue: 56,
        useNativeDriver: false,
        tension: 65,
        friction: 8,
      }).start()
    }
  }, [visible])

  const handleSearch = () => {
    if (searchText.trim()) {
      onSearch(searchText.trim())
      setSearchText('')
    }
  }

  return (
    <Animated.View
      style={{ 
        width: widthAnim,
        backgroundColor: visible ? '#E8F5E9' : '#ffffff', // 열렸을 때 연한 초록
      }}
      className="h-14 rounded-full shadow-lg flex-row items-center overflow-hidden"
    >
      {visible ? (
        // 검색창 열림
        <>
          <TextInput
            placeholder="단어 검색"
            placeholderTextColor="#8AA989"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            autoFocus
            className="flex-1 text-base text-gray-800 px-6"
          />
          <TouchableOpacity onPress={onClose} className="px-4">
            <Text className="text-xl text-gray-500">✕</Text>
          </TouchableOpacity>
        </>
      ) : (
        // 돋보기만 (닫힘)
        <TouchableOpacity
          onPress={() => {}} // 부모에서 처리
          className="w-14 h-14 bg-green-600 rounded-full items-center justify-center"
        >
          <Text className="text-2xl">🔍</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  )
}