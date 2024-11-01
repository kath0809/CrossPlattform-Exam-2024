import { StatusBar } from "expo-status-bar";
import { View, Image, Text } from "react-native";
import React from "react";

export default function SignIn() {
  return (
    <View className="pt-20">
      <StatusBar style="dark" />
      <View className="flex-1 gap-12">
        <View className="items-center">
          <Image
            source={require("../assets/images/logIn.png")}
            //accessibilityLabel="Login Ilustration"
          />
        </View>
      </View>
    </View>
  );
}
