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
      'px-6 py-3 rounded-full',
      isSelected ? 'bg-[#B3D7BB]' : 'bg-[#DBFDE0]'
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