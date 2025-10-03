// app/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';
import "../global.css";


function RootLayout() {
  return (
    <Stack>
      {/* (tabs) 그룹의 화면을 숨깁니다. */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
      {/* 기타 라우트 설정 */}
    </Stack>
  );
}

// RootLayout을 기본으로 내보냅니다.
export default RootLayout;