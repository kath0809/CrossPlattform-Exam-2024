import React from "react";
import { View, Platform } from "react-native";

let LottieView: any;
if (Platform.OS === "web") {
  LottieView = require("@lottiefiles/react-lottie-player").Player;
} else {
  LottieView = LottieView;
}

export default function LoadingComponent({ size }: { size: number }) {
  return (
    <View style={{ height: size, aspectRatio: 2 }}>
      {Platform.OS === "web" ? (
        <LottieView
          autoplay
          loop
          src={require("../assets/animations/loadingAnimation.json")}
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <LottieView
          style={{ flex: 1 }}
          source={require("../assets/animations/loadingAnimation.json")}
          autoPlay
          loop
        />
      )}
    </View>
  );
}
