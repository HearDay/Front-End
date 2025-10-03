import React from 'react'
import { Modal as RNModal, Text, TouchableOpacity, Pressable, View } from 'react-native'
import { ModalProps } from '../../types/components'
/*
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
      onRequestClose={onClose}
    >
      <Pressable 
        className="flex-1 justify-center items-center px-8"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onPress={onClose}
      >
        <Pressable 
          className="bg-white rounded-3xl p-6 w-full"
          style={{ maxWidth: 384 }}
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="text-center text-base text-gray-800 mb-6">
            {title}
          </Text>

          <TouchableOpacity
            className="py-3 rounded-xl"
            style={{ backgroundColor: '#15803D' }}
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
  */