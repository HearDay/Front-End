import { View } from 'lucide-react-native'
import { useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, Text, TextInput, TouchableOpacity } from 'react-native'
import { DictionarySearchBarProps } from '../../../types/screens'

const SCREEN_WIDTH = Dimensions.get('window').width
const MAGNIFIER_SIZE = 56
const SCREEN_PADDING = 48

const ANIMATION_CONFIG = {
  tension: 65,
  friction: 8,
  useNativeDriver: false,
}

export function DictionarySearchBar({ 
  visible, 
  onClose, 
  onSearch,
  onOpen
}: DictionarySearchBarProps) {
  const [searchText, setSearchText] = useState('')
  const widthAnim = useRef(new Animated.Value(MAGNIFIER_SIZE)).current
  const inputRef = useRef<TextInput>(null) // 추가: TextInput ref

  // 애니메이션
  useEffect(() => {
    const targetWidth = visible ? SCREEN_WIDTH - SCREEN_PADDING : MAGNIFIER_SIZE
    
    Animated.spring(widthAnim, {
      toValue: targetWidth,
      ...ANIMATION_CONFIG,
    }).start(() => { //추가: 애니메이션 완료 후 키보드 자동 포커스
        if (visible) {
            inputRef.current?.focus()
        }
    })
  }, [visible, widthAnim])

  // 닫힐 때 검색어 초기화
  useEffect(() => {
    if (!visible) {
      setSearchText('')
    }
  }, [visible])

  const handleSearch = () => {
    const trimmedText = searchText.trim()
    
    if (!trimmedText) return
    
    onSearch(trimmedText)
    setSearchText('')
    // onClose() // 선택: 검색 후 자동으로 닫기
  }

  return (
    //수정: 키보드 위에 위치하도록 bottom-8 -> bottom-20
    <View
        style={{
            position: 'absolute',
            bottom: 80, //키보드 위 여유 공간
            right: 24,
        }}
    >
    <Animated.View
      style={{ 
        width: widthAnim,
        backgroundColor: visible ? '#E8F5E9' : '#ffffff',
      }}
      className="absolute bottom-8 right-6 h-14 rounded-full shadow-lg flex-row items-center overflow-hidden"
    >
      {visible ? (
        <>
          <TextInput
            ref={inputRef} //추가 : ref 연결
            placeholder="단어 검색"
            placeholderTextColor="#8AA989"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            returnKeyType="search" // 키보드 검색 버튼
            autoFocus
            className="flex-1 text-base text-gray-800 px-6"
          />
          <TouchableOpacity 
            onPress={onClose} 
            className="px-4"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // 터치 영역 확대
          >
            <Text className="text-xl text-gray-500">✕</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          onPress={onOpen}
          className="w-14 h-14 bg-green-600 rounded-full items-center justify-center"
          activeOpacity={0.8} // 터치 피드백
        >
          <Text className="text-2xl">🔍</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
    </View>
  )
}