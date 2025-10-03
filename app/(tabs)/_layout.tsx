// app/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // 탭 바가 항상 보이지 않게 하려면 headerShown: false를 사용
        headerShown: false, 
        // 탭 선택 시 색상 (NativeWind 스타일이 아닌 기본 색상 사용)
        tabBarActiveTintColor: '#3b82f6', // Tailwind blue-500과 유사
        tabBarInactiveTintColor: '#6b7280', // Tailwind gray-500과 유사
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          // 탭 아이콘을 이모지로 대체했습니다.
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 28, color }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          // 탭 아이콘을 이모지로 대체했습니다.
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 28, color }}>🔍</Text>,
        }}
      />
      
      {/* 만약 다른 탭 화면(예: profile.tsx)을 추가한다면 여기에 Tabs.Screen을 추가하세요. */}
      
    </Tabs>
  );
}