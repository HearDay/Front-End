import { View, Text } from 'react-native';
import { useState } from 'react';
import { Modal, ModalButton } from '@/components/common';

export default function TestModal() {
  const [showModal, setShowModal] = useState(false);

  return (
    <View className="flex-1 justify-center items-center bg-white p-4">
      <Text className="text-2xl font-bold mb-8">Modal 테스트</Text>
      
      <ModalButton 
        title="모달 열기" 
        variant="voice"
        onPress={() => {
          setShowModal(true);
          console.log('모달 열림');
        }} 
      />
      
      <Modal
        visible={showModal}
        title="이메일에서 인증을 완료해주세요."
        onConfirm={() => {
          setShowModal(false);
          console.log('확인 클릭');
        }}
        onClose={() => {
          setShowModal(false);
          console.log('닫기 클릭');
        }}
      />
    </View>
  );
}