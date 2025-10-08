import React from 'react'
import { TouchableOpacity, Text } from 'react-native';
import { clsx } from 'clsx';
import { CategoryChipProps } from '../../types/components';

export const CategoryChip = ({
  label,
  isSelected,
  onPress,
}: CategoryChipProps) => (
  <TouchableOpacity
    className={clsx(
      'px-6 py-3 rounded-full',
      isSelected ? 'bg-[#C8F4D8]' : 'bg-[#F5F5F5]'
    )}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text
      className={clsx(
        'text-sm',
        isSelected ? 'text-gray-800 font-semibold' : 'text-gray-600'
      )}
    >
      {label}
    </Text>
  </TouchableOpacity>
);