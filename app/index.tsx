import LoadingComponent from "@/components/LoadingComponent";
import React, { useState } from "react";
import { View, StatusBar } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function StartPage() {
  const [loading, setLoading] = useState(false);

  return (
    <View className="flex-1 bg-[#000000e5]">
      <StatusBar barStyle="light-content" />
      {loading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <LoadingComponent size={wp(25)} />
        </View>
      )}
    </View>
  );
}
