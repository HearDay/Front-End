// metro.config.js

// NativeWind의 Metro 설정이 require 되는 라인입니다.
const { withNativeWind } = require('nativewind/metro');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, {
  // global.css 파일 경로를 명시합니다.
  input: './global.css',
});