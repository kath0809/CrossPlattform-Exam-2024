import { getStorageRef } from "@/firebaseConfig";
import { getDownloadURL, uploadBytesResumable } from "firebase/storage";


export const uploadImagesToFirebase = async (uris: string[]) => {
  const uploadURLs = [];
  console.log("Starting uploads:", uris);
  for (const uri of uris) {
    try {
      // Fetch the image data as a Blob (Binary Large Object). Blob is used to store binary data like images.
      const fetchResponse = await fetch(uri);
      const blob = await fetchResponse.blob();

      // Generate a unique storage path for each image.
      // Every picture need to have a unique path in the storage to avoid overwriting eachother. Before i added the uniqueId, a post got stored with only one image.
      const uniqueId = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;
        // Store the images in firebase storage and the folder "multipleImage"
      const imagePath = `multipleImage/${uniqueId}`;
      const imageRef = getStorageRef(imagePath);
      await uploadBytesResumable(imageRef, blob);
      
      const downloadURL = await getDownloadURL(imageRef);
      uploadURLs.push(downloadURL);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  }
  return uploadURLs;
};
