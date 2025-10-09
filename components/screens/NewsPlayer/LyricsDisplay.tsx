import { Text, View } from 'react-native'
import { LyricsDisplayProps } from '../../../types/screens'

export const LyricsDisplay = ({ 
  currentLines 
}: LyricsDisplayProps) => (
  <View className="px-6 pt-6">
    {currentLines.map((line, index) => (
      <Text 
        key={index} 
        className="text-base leading-7 text-gray-800 text-center"
      >
        {line}
      </Text>
    ))}
  </View>
)
