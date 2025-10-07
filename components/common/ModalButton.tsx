import { Pressable, Text, Platform } from 'react-native';
import { useState } from 'react';
import { clsx } from 'clsx';
import { ModalButtonProps } from '../../types/components';

export const ModalButton = ({
  title,
  onPress,
  variant = 'voice',
}: ModalButtonProps) => {
  // ========== 웹용 상태 ==========
  const [isHovered, setIsHovered] = useState(false);
  
  // ========== 앱용 상태 ==========
  const [isPressed, setIsPressed] = useState(false);

  const getBackgroundColor = () => {
    // 웹 or 앱 둘 다 체크
    if (isHovered || isPressed) return '#006716';

    switch (variant) {
      case 'voice':
        return '#DBFDE0';
      case 'chat':
        return '#DBFDE0';
      case 'skip':
        return '#DBFDE0';
      default:
        return '#DBFDE0';
    }
  };

  return (
    <Pressable
      className="py-6 px-8 rounded-3xl border-2 border-white shadow-lg w-full max-w-md"
      style={{ backgroundColor: getBackgroundColor() }}
      onPress={onPress}
      
      // ========== 앱용: 터치 효과 ==========
      onPressIn={() => setIsPressed(true)}   // 터치 시작
      onPressOut={() => setIsPressed(false)}  // 터치 종료
      
      // ========== 웹용: 호버 효과 ==========
      {...(Platform.OS === 'web' && {
        onMouseEnter: () => setIsHovered(true),   // 마우스 올림
        onMouseLeave: () => setIsHovered(false),  // 마우스 내림
      })}
    >
      <Text
        className="text-center text-lg font-medium"
        style={{
          color: (isHovered || isPressed) ? 'white' : '#1F2937'
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
};