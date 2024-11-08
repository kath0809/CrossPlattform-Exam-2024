import { CameraView, useCameraPermissions } from "expo-camera";
import { StyleSheet, Text, TouchableOpacity, View, Button } from "react-native";
import * as ImagePicker from "expo-image-picker";
import React from "react";

type SelectImageModalProps = {
  closeModal: () => void;
  setImage: (image: string) => void;
};

export default function SelectImageModal({
  closeModal,
  setImage,
}: SelectImageModalProps) {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  let camera: CameraView | null = null;

  const captureImage = async () => {
    if (camera) {
      const image = await camera.takePictureAsync();
      if (image) {
        setImage(image.uri);
        closeModal();
      }
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      closeModal();
    }
  };

  return (
    // CameraView screen.
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={"back"}
        ref={(r) => (camera = r)}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => pickImage()}>
            <Text style={styles.text}>Libary</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => captureImage()}
          >
            <Text style={styles.text}>Picture</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={closeModal}>
            <Text style={styles.text}>Close</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "space-between",
    marginBottom: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});

/* NEW */

// import { useState } from "react";
// import { CameraView, useCameraPermissions } from "expo-camera";
// import * as ImagePicker from "expo-image-picker";

// export function useImagePicker() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const [cameraRef, setCameraRef] = useState<CameraView | null>(null);

//   const checkPermissions = async () => {
//     if (!permission) {
//       await requestPermission();
//     }
//     return permission?.granted;
//   };

//   const captureImage = async (setImage: (image: string) => void) => {
//     if (cameraRef) {
//       const image = await cameraRef.takePictureAsync();
//       if (image) {
//         setImage(image.uri);
//       }
//     }
//   };

//   const pickImage = async (setImage: (image: string) => void) => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setImage(result.assets[0].uri);
//     }
//   };

//   return {
//     checkPermissions,
//     captureImage,
//     pickImage,
//     setCameraRef,
//   };
// }