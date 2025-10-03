// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // 🚨 핵심: app 폴더 내의 모든 파일을 스캔하도록 경로를 추가합니다.
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};