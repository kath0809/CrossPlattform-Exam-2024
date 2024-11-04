import { useAuth } from "@/providers/authContext";
import React from "react";
import { View, Text, Pressable } from "react-native";

export default function Gallery() {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View className="flex-1 bg-black">
      <Text>Gallery Page</Text>
      <Pressable onPress={handleLogout}>
        <Text>Sign out</Text>
      </Pressable>
    </View>
  );
}
