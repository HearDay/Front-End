import React from 'react'
// 우리 컴포넌트 이름과 충돌 방지로 RNModal로 지음
// Pressable이 TouchableOpacity보다 최신이라고 함
import { Modal as RNModal, Text, TouchableOpacity, Pressable } from 'react-native'
import { ModalProps } from '../../types/components'

export const Modal = ({
  visible,
  title,
  onConfirm,
  onClose,
}: ModalProps) => {
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
          style={{ maxWidth: 384 }}
          //모달 내부 클릭해도 닫히지 않게
          //이벤트 전파 중단 넣어서 부모의 onPress 실행 안 됨
          onPress={(e) => e.stopPropagation()}
        >
          {/* 제목 */}
          <Text className="text-center text-base text-gray-800 mb-6">
            {title}
          </Text>

          {/* 확인 버튼 */}
          <TouchableOpacity
            className="py-3 rounded-xl"
            style={{ backgroundColor: '#006716' }}
            onPress={onConfirm}
            activeOpacity={0.8}
          >
            <Text className="text-center text-white font-semibold">
              확인
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </RNModal>
  )
}
  