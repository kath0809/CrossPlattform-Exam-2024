import { getStorageRef } from "@/firebaseConfig";
import { uploadBytesResumable } from "firebase/storage";
import { Alert } from "react-native";

export const uploadImageToFirebase = async (uri: string) => {
  const fetchResponse = await fetch(uri);
  const blob = await fetchResponse.blob();

  const imagePath = uri.split("/").pop()?.split(".")[0] ?? "Anonymous Picture";

  const uploadPath = `images/${imagePath}`;

  const imageRef = getStorageRef(uploadPath);

  try {
    await uploadBytesResumable(imageRef, blob);
    return uploadPath;
  } catch (error) {
    console.error("error uploading image", error);
    return (
      Alert.alert("Error uploading image", "Please try again later"),
      null
    );
  }
};
