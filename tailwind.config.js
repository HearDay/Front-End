// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // 🚨 핵심: app 폴더 내의 모든 파일을 스캔하도록 경로를 추가합니다.
    "./app/**/*.{js,jsx,ts,tsx}",
    
    // components 폴더도 계속 유지합니다.
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};