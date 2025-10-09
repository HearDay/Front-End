import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { SpinnerProps } from '../../types/components'

//ActivityIndicator는 속도 조절 불가
//Lottie 로 속도 조절 하기 ?

export const Spinner = ({
  size = 'large',
  color = '#B3D7BB',
}: SpinnerProps) => {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size={size} color={color} />
    </View>
  )
}