import React from "react";
import { View } from "react-native";
import LottieView from "lottie-react-native";

export default function LoadingComponent({ size }: { size: number }) {
  return (
    <View style={{ height: size, aspectRatio: 2 }}>
      <LottieView
        style={{ flex: 1 }}
        source={require("../assets/animations/loadingAnimation.json")}
        autoPlay
        loop
      />
    </View>
  );
}
