const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// react-native-maps to @teovilla/react-native-web-maps
// This is so that we can use the same code for both web and mobile.
const ALIASES = {
  "react-native-maps": "@teovilla/react-native-web-maps",
};

const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push("cjs"); // Denne forteller metro at vi kan importere cjs filer

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === "web") {
    // The alias will only be used when bundling for the web.
    return context.resolveRequest(
      context,
      ALIASES[moduleName] ?? moduleName,
      platform
    );
  }
  // Ensure you call the default resolver.
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: "./global.css" });
