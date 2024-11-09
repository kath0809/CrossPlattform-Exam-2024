import { PostData } from "@/utils/postData";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db, getDownloadUrl } from "@/firebaseConfig";
import { uploadImagesToFirebase } from "@/api/imageApi";

// export const createPost = async (post: PostData) => {
//   try {
//     const firebaseImage = await uploadImageToFirebase(post.imageURL);
//     console.log("firebaseImage", firebaseImage);
//     if (firebaseImage === "ERROR") {
//       return;
//     }
//     const postImageDownloadUrl = await getDownloadUrl(firebaseImage); //
//     const postWithImageData: PostData = {
//       ...post,
//       imageURL: postImageDownloadUrl,
//       createdAt: new Date(),
//     };
//     const docRef = await addDoc(collection(db, "posts"), postWithImageData);
//     console.log("Document written with ID:", docRef.id);
//   } catch (e) {
//     console.log("Error adding document", e);
//   }
// };

/* The Code Above Works for single upload, lets try for multiple */
export const createPost = async (post: PostData) => {
  try {
    const firebaseImages = await uploadImagesToFirebase(post.imageURLs);
    console.log("firebaseImages", firebaseImages);
    if (firebaseImages.includes("ERROR")) {
      return;
    }
    const postImageDownloadUrls = await Promise.all(
      firebaseImages.map((firebaseImage) => getDownloadUrl(firebaseImage))
    );
    const postWithImageData: PostData = {
      ...post,
      imageURLs: postImageDownloadUrls,
      createdAt: new Date(),
    };
    const docRef = await addDoc(collection(db, "posts"), postWithImageData);
    console.log("Document written with ID:", docRef.id);
  } catch (e) {
    console.log("Error adding document", e);
  }
};

export const getAllPosts = async () => {
  const queryResult = await getDocs(collection(db, "posts"));
  return queryResult.docs.map((doc) => {
    const data = doc.data();
    console.log(doc.data());
    return {
      ...doc.data(),
      id: doc.id,
      createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
    } as PostData;
  });
};

export const getPostById = async (id: string) => {
  const specificPost = await getDoc(doc(db, "posts", id));
  console.log("post by spesific id", specificPost.data());
  return {
    ...specificPost.data(),
    id: specificPost.id,
  } as PostData;
};

export const deletePost = async (id: string) => {
  try {
    await deleteDoc(doc(db, "posts", id));
    console.log("Document successfully deleted!");
  } catch (e) {
    console.error("Error removing document: ", e);
  }
};
