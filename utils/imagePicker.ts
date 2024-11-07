import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert } from "react-native";

export const pickImageToStorage = async () => {
  console.log("PickImage called");
  // First, ask for permission to access the user's gallery
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Permission denied",
      "To upload a profile picture, you need to grant access to your gallery"
    );
    return;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });
  if (!result.canceled) {
    return null;
    }
};
