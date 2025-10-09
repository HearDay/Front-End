import React from 'react'
import { View } from 'react-native'
import { CategoryChipGroupProps } from '../../types/components'
import { CategoryChip } from './CategoryChip'

export const CategoryChipGroup = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryChipGroupProps) => (
  <View className="flex-row flex-wrap gap-2 px-4">
    {categories.map((category) => (
      <CategoryChip
        key={category}
        label={category}
        isSelected={selectedCategory === category}
        onPress={() => onSelectCategory(category)}
      />
    ))}
  </View>
)