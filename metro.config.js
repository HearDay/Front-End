const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname)

// global.css is at the project root (./global.css), not inside ./app
module.exports = withNativeWind(config, { input: "./global.css" });