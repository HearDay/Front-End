import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { SpinnerProps } from '../../types/components'

export const Spinner = ({
  size = 'large',
  color = '#7DD3AE',
}: SpinnerProps) => {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};