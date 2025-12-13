import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

interface PlaybackSpeedButtonProps {
  currentSpeed: number;
  onSpeedChange: (speed: number) => void;
}

const SPEED_OPTIONS = [0.8, 1.0, 1.2, 1.5, 1.8, 2.0];

export const PlaybackSpeedButton = ({
  currentSpeed,
  onSpeedChange,
}: PlaybackSpeedButtonProps) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSpeedSelect = (speed: number) => {
    onSpeedChange(speed);
    setShowDropdown(false);
  };

  return (
    <View className="items-center">
      {/* 배속 버튼 */}
      <Pressable
        onPress={() => setShowDropdown(!showDropdown)}
        className="px-3 py-1.5 rounded-lg"
        style={{ backgroundColor: '#002C14' }}
      >
        <Text className="text-white text-sm font-semibold">
          x{currentSpeed.toFixed(1)}
        </Text>
      </Pressable>

      {/* 드롭다운 모달 */}
      <Modal
        visible={showDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <Pressable
          className="flex-1"
          onPress={() => setShowDropdown(false)}
        >
          <View className="flex-1 justify-center items-center">
            {/* 드롭다운 메뉴 */}
            <View
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
              style={{
                width: 100,
                borderWidth: 1,
                borderColor: 'rgba(0, 0, 0, 0.1)',
              }}
            >
              {SPEED_OPTIONS.map((speed, index) => (
                <Pressable
                  key={speed}
                  onPress={() => handleSpeedSelect(speed)}
                  className="py-3 px-4"
                  style={[
                    {
                      backgroundColor: currentSpeed === speed ? '#002C14' : 'white',
                    },
                    index !== SPEED_OPTIONS.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: 'rgba(0, 0, 0, 0.05)',
                    },
                  ]}
                >
                  <Text
                    className="text-center font-medium"
                    style={{
                      color: currentSpeed === speed ? 'white' : '#1F2937',
                    }}
                  >
                    x{speed.toFixed(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};
