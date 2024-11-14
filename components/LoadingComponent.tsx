import React from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import LottieView from "lottie-react-native";


// My LoadingComponent is downloaded and modified 02.11.204
// from https://lottiefiles.com/free-animation/loading-animation-dDllMXjht9 
export default function LoadingComponent({ size }: { size: number }) {
  return (
    <View style={{ height: size, aspectRatio: 2 }}>
      {Platform.OS === "web" ? (
        // Since LottieView is not supported on web, I'm using Rect-Native "ActivityIndicator"
        // for web, and LottieView for mobile devices
        <ActivityIndicator size="large" color="orange" />
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
