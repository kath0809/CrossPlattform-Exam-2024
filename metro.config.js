const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push("cjs"); // Denne forteller metro at vi kan importere cjs filer

module.exports = withNativeWind(config, { input: "./global.css" });
