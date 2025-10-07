import { View, Text } from 'react-native';
import { ModalButton } from '@/components/common';

export default function TestModalButton() {
  return (
    <View className="flex-1 justify-center items-center bg-white p-4 gap-4">
      <Text className="text-2xl font-bold mb-4">ModalButton 테스트</Text>
      
      <ModalButton 
        title="음성으로 토론하러 가기" 
        variant="voice" 
        onPress={() => console.log('voice 클릭!')} 
      />
      
      <ModalButton 
        title="채팅으로 토론하러 가기" 
        variant="chat" 
        onPress={() => console.log('chat 클릭!')} 
      />
      
      <ModalButton 
        title="다음에 하기" 
        variant="skip" 
        onPress={() => console.log('skip 클릭!')} 
      />
    </View>
  );
}