import React from 'react'
// 우리 컴포넌트 이름과 충돌 방지로 RNModal로 지음
// Pressable이 TouchableOpacity보다 최신이라고 함
import { Pressable, Modal as RNModal, Text, TouchableOpacity, View } from 'react-native'

interface ModalProps {
  visible: boolean
  title: string
  onConfirm: () => void
  onClose: () => void
  children?: React.ReactNode
  confirmText?: string // 선택적으로 변경
  cancelText?: string
}

export function Modal({
  visible,
  title,
  onConfirm,
  onClose,
  children,
  confirmText, // 기본값 제거
  cancelText = '닫기',
}: ModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}  //안드로이드 뒤로가기 버튼 대응
    >
      {/* 첫 번째 Pressable은 반투명 검정의 배경 */}
      <Pressable 
        className="flex-1 justify-center items-center px-8"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onPress={onClose}
      >
        <Pressable 
          className="bg-white rounded-3xl p-6 w-full"
          style={{ maxWidth: 350 }}
          //모달 내부 클릭해도 닫히지 않게
          //이벤트 전파 중단 넣어서 부모의 onPress 실행 안 됨
          onPress={(e) => e.stopPropagation()}
        >
          {/* 제목 */}
          <Text className="text-center text-xl text-normal text-gray-800 mt-2">
            {title}
          </Text>

          {/*  children */}
          {children}
          
         {/* 수정: 버튼 영역 */}
          <View className="flex-row gap-3 mt-6">
            {/* 확인 버튼 - confirmText가 있을 때만 표시 */}
            {confirmText && confirmText.length > 0 && (
              <TouchableOpacity
                onPress={onConfirm}
                className="min-w-[130px] h-[40px] mx-auto flext items-center justify-center rounded-xl"
                style={{ backgroundColor: '#006716' }}
                activeOpacity={0.7}
              >
                <Text className="text-center text-lg text-white font-semibold">
                  {confirmText}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  )
}