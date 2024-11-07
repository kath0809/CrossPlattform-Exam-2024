import { PostData } from "@/utils/postData";
import {addDoc, collection } from "firebase/firestore";
import { db, getDownloadUrl } from "@/firebaseConfig";
import { uploadImageToFirebase } from "@/api/imageApi";

export const createPost = async (post: PostData) => {
  try {
    const firebaseImage = await uploadImageToFirebase(post.imageURL);
    console.log("firebaseImage", firebaseImage);
    if (firebaseImage === "ERROR") {
      return;
    }
    const postImageDownloadUrl = await getDownloadUrl(firebaseImage); //
    const postWithImageData: PostData = {
      ...post,
      imageURL: postImageDownloadUrl,
    };
    const docRef = await addDoc(collection(db, "posts"), postWithImageData);
    console.log("Document written with ID:", docRef.id);
  } catch (e) {
    console.log("Error adding document", e);
  }
};