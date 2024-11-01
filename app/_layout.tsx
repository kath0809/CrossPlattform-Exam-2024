import { Slot, useSegments } from "expo-router";
import React, { useEffect } from "react";
import "../global.css";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <View className="flex-1">
      <Slot />
    </View>
  );
}
