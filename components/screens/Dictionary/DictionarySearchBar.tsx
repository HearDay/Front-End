import { useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
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
  onOpen,
  matchCount = 0,
  currentIndex = 0,
  onPrev = () => {},
  onNext = () => {},
}: DictionarySearchBarProps) {
  const [searchText, setSearchText] = useState('')
  const widthAnim = useRef(new Animated.Value(MAGNIFIER_SIZE)).current
  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    const targetWidth = visible ? SCREEN_WIDTH - SCREEN_PADDING : MAGNIFIER_SIZE
    
    Animated.spring(widthAnim, {
      toValue: targetWidth,
      ...ANIMATION_CONFIG,
    }).start(() => {
        if (visible) {
            inputRef.current?.focus()
        }
    })
  }, [visible, widthAnim])

  useEffect(() => {
    if (!visible) {
      setSearchText('')
    }
  }, [visible])

  const handleSearch = () => {
    const trimmedText = searchText.trim()
    if (!trimmedText) return
    onSearch(trimmedText)
    // 검색 후 텍스트 유지
  }

  return (
    <Animated.View
      style={{
        width: widthAnim,
        backgroundColor: visible ? '#E8F5E9' : 'transparent',
        shadowColor: visible ? '#000' : 'transparent',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: visible ? 0.25 : 0,
        shadowRadius: visible ? 3.84 : 0,
        elevation: visible ? 5 : 0,
      }}
      className="absolute bottom-8 right-6 h-14 rounded-full flex-row items-center overflow-hidden"
    >
      {visible ? (
        <>
          <TextInput
            ref={inputRef}
            placeholder="단어 검색"
            placeholderTextColor="#8AA989"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            className="flex-1 text-base text-gray-800 px-6"
          />
          
          {matchCount > 0 && (
            <View className="flex-row items-center gap-x-2 mr-2">
              <Text className="text-sm text-gray-600 font-semibold">
                {currentIndex + 1} / {matchCount}
              </Text>
              <TouchableOpacity onPress={onPrev} hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}>
                <Text className="text-2xl text-gray-600">↑</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onNext} hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}>
                <Text className="text-2xl text-gray-600">↓</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity 
            onPress={onClose} 
            className="px-4"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text className="text-xl text-gray-500">✕</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          onPress={onOpen}
          className="w-14 h-14 items-center justify-center"
          activeOpacity={0.8}
        >
          <Image source={require('../../../my-expo-app/assets/images/Search.png')} className="w-14 h-14" />
        </TouchableOpacity>
      )}
    </Animated.View>
  )
}