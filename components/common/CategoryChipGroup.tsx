import React from 'react'
import { ScrollView, View } from 'react-native'
import { CategoryChipGroupProps } from '../../types/components'
import { CategoryChip } from './CategoryChip'

export const CategoryChipGroup = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryChipGroupProps) => (
  <View className="h-16 items-center"> 
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        alignItems: 'center',
        paddingHorizontal: 16,
        gap: 8, // gap-2에 해당
      }}
    >
      {categories.map((category) => (
        <CategoryChip
          key={category}
          label={category}
          isSelected={selectedCategory === category}
          onPress={() => onSelectCategory(category)}
        />
      ))}
    </ScrollView>
  </View>
)