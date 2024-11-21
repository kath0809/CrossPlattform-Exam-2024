import { Author, PostData } from "@/utils/postData";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, getDownloadUrl } from "@/firebaseConfig";
import { uploadImagesToFirebase } from "@/api/imageApi";

// Functions to create, read, update and delete ++ posts in the firebase database "posts" collection.
// Most of the functions are copied from the lecture code. I see no reason to change them, as they provide the functionality needed.
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
  } catch (error) {
    console.log("Error adding document", error);
  }
};

export const getAllPosts = async () => {
  const queryResult = await getDocs(collection(db, "posts"));
  return queryResult.docs.map((doc) => {
    const data = doc.data();
    //console.log(doc.data());
    return {
      ...doc.data(),
      id: doc.id,
      createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
    } as PostData;
  });
};

export const getPostById = async (id: string) => {
  const specificPost = await getDoc(doc(db, "posts", id));
  console.log("post with id: ", specificPost.data());
  return {
    ...specificPost.data(),
    id: specificPost.id,
  } as PostData;
};

export const deletePost = async (id: string) => {
  try {
    await deleteDoc(doc(db, "posts", id));
    console.log("Document deleted!");
  } catch (error) {
    console.error("Error removing document: ", error);
  }
};

export const toggleLike = async (id: string, userId: string) => {
  const postRef = doc(db, "posts", id);
  const post = await getDoc(postRef);
  const postData = post.data();
  if (!postData) {
    throw new Error("Post not found");
  }
  const likes = postData.likes || [];
  const updatedLikes = likes.includes(userId)
    ? likes.filter((like: string) => like !== userId)
    : [...likes, userId];
  await updateDoc(postRef, { likes: updatedLikes });
};

// To show a signed in users images in their profile, and to show other artists images in their profile.
/*
1. Takes the authorId as input.
2. Search all posts in the database (posts collection) where the authorId is the same as the input authorId. (where("authorId", "==", authorId))
3. Retrieves the data, structures it into a list of postData objects
4. Returns the list of postData objects.
*/
export const getUserPosts = async (authorId: string): Promise<PostData[]> => {
  const postRef = collection(db, "posts");
  const q = query(postRef, where("authorId", "==", authorId));
  const querySnapshot = await getDocs(q);

  const posts: PostData[] = [];
  querySnapshot.forEach((doc) => {
    posts.push({
      id: doc.id,
      ...doc.data(),
    } as PostData);
  });
  //console.log("Fetched user posts:", posts);
  return posts;
};

// To show an artist profile.
export const getAuthorById = async (authorId: string): Promise<Author> => {
  const authorDocRef = doc(db, "users", authorId);
  const authorDoc = await getDoc(authorDocRef);

  if (!authorDoc.exists()) {
    throw new Error("Author not found");
  }

  const authorData = authorDoc.data();

  return {
    authorId: authorId,
    authorName: authorData.username,
    profileImage: authorData.profileImage || "",
  } as Author;
};
