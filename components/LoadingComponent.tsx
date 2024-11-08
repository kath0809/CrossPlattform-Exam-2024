import React from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import LottieView from "lottie-react-native";

export default function LoadingComponent({ size }: { size: number }) {
  return (
    <View style={{ height: size, aspectRatio: 2 }}>
      {Platform.OS === "web" ? (
        <ActivityIndicator size="large" color="teal" />
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
