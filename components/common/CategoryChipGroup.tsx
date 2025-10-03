import React from 'react'
import { View } from 'react-native'
import { CategoryChip } from './CategoryChip'
import { CategoryChipGroupProps } from '../../types/components'

export const CategoryChipGroup = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryChipGroupProps) => {
  return (
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
}