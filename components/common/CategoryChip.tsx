import { clsx } from 'clsx';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { CategoryChipProps } from '../../types/components';

export const CategoryChip = ({
  label,
  isSelected,
  onPress,
}: CategoryChipProps) => (
  <TouchableOpacity
    className={clsx(
      'px-8 py-2 rounded-full border border-[#00801A]',
      isSelected ? 'bg-[#B3D7BB]' : 'bg-[#F5FCE9]'
    )}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text
      className={clsx(
        'text-sm text-center font-medium',
        isSelected ? 'text-gray-800' : 'text-gray-600'
      )}
    >
      {label}
    </Text>
  </TouchableOpacity>
);