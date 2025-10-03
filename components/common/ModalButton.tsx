import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import clsx from 'clsx'
import { ModalButtonProps } from '../../types/components'

export const ModalButton = ({
  title,
  onPress,
  variant = 'voice',
}: ModalButtonProps) => {
  return (
    <TouchableOpacity 
      className={clsx(
        "py-4 rounded-2xl",
        variant === 'voice' && "bg-[#C8F4D8]",
        variant === 'chat' && "bg-[#D5F4E0]",
        variant === 'skip' && "bg-[#E0F7E9]"
      )}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text className="text-center text-base font-medium text-gray-800">
        {title}
      </Text>
    </TouchableOpacity>
  );
};