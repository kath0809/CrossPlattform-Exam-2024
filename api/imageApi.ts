import { getStorageRef } from "@/firebaseConfig";
import { getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { Alert } from "react-native";

// export const uploadImageToFirebase = async (uri: string) => {
//   const fetchResponse = await fetch(uri);
//   const blob = await fetchResponse.blob();

//   const imagePath = uri.split("/").pop()?.split(".")[0] ?? "Anonymous Picture";

//   const uploadPath = `images/${imagePath}`;

//   const imageRef = getStorageRef(uploadPath);

//   try {
//     await uploadBytesResumable(imageRef, blob);
//     return uploadPath;
//   } catch (error) {
//     console.error("error uploading image", error);
//     return (
//       Alert.alert("Error uploading image", "Please try again later"),
//       null
//     );
//   }
// };

/* The code above works for single image */

// Test multiple image upload

export const uploadImagesToFirebase = async (uris: string[]) => {
  const uploadURLs = []; // Store each image's public download URL

  console.log("Starting uploads for URIs:", uris);

  for (const uri of uris) {
    try {
      // Fetch the image data as a blob
      const fetchResponse = await fetch(uri);
      const blob = await fetchResponse.blob();

      // Generate a unique storage path for each image
      const uniqueId = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;
      const imagePath = `multipleImage/${uniqueId}`;

      const imageRef = getStorageRef(imagePath);

      // Upload the blob to Firebase Storage
      await uploadBytesResumable(imageRef, blob);

      // Get the download URL for the uploaded image
      const downloadURL = await getDownloadURL(imageRef);

      // Store the download URL in the array
      uploadURLs.push(downloadURL);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }
  console.log("Completed uploads, URLs:", uploadURLs);
  return uploadURLs; // Array of download URLs for each uploaded image
};
