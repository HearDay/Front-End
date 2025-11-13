import { useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, Image, TextInput, TouchableOpacity, Text, Keyboard, Platform } from 'react-native'
import { DictionarySearchBarProps } from '../../../types/screens'

const SCREEN_WIDTH = Dimensions.get('window').width
const MAGNIFIER_SIZE = 56
const SCREEN_PADDING = 48
const DEFAULT_BOTTOM = 32 // bottom-8 = 32px

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
}: DictionarySearchBarProps) {
  const [searchText, setSearchText] = useState('')
  const widthAnim = useRef(new Animated.Value(MAGNIFIER_SIZE)).current
  const bottomAnim = useRef(new Animated.Value(DEFAULT_BOTTOM)).current
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

  // 키보드 이벤트 처리
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event) => {
        Animated.spring(bottomAnim, {
          toValue: event.endCoordinates.height + 8,
          ...ANIMATION_CONFIG,
        }).start()
      }
    )

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        Animated.spring(bottomAnim, {
          toValue: DEFAULT_BOTTOM,
          ...ANIMATION_CONFIG,
        }).start()
      }
    )

    return () => {
      keyboardWillShowListener.remove()
      keyboardWillHideListener.remove()
    }
  }, [bottomAnim])

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
        bottom: bottomAnim,
        backgroundColor: visible ? '#E8F5E9' : 'transparent',
        shadowColor: visible ? '#000' : 'transparent',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: visible ? 0.25 : 0,
        shadowRadius: visible ? 3.84 : 0,
        elevation: visible ? 5 : 0,
      }}
      className="absolute right-6 h-14 rounded-full flex-row items-center overflow-hidden"
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
            style={{
              textAlignVertical: 'center',
              paddingVertical: 0,
              height: 56,
              lineHeight: 20,
            }}
          />

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