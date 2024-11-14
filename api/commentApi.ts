import { db } from "@/firebaseConfig";
import { CommentData, CommentObject } from "@/utils/postData";
import { addDoc, collection, doc, updateDoc, arrayUnion, arrayRemove, deleteDoc, getDoc } from "firebase/firestore";


export const addComment = async (postId: string, comment: CommentData) => {
  try {
    const commentRef = await addDoc(collection(db, "comments"), comment);
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      comments: arrayUnion(commentRef.id),
    });
    console.log("Created comment", commentRef.id);
    return commentRef.id;
  } catch (error) {
    console.log("Could not add new comment", error);
  }
};

export const deleteComment = async (commentId: string, postId: string) => {
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      comments: arrayRemove(commentId),
    });
    await deleteDoc(doc(db, "comments", commentId));
  } catch (e) {
    console.log("Error deleting document: ", e);
  }
};

export const getCommentsByIds = async (ids: string[]) => {
  try {
    const response = await Promise.all(
      ids.map(async (id) => {
        return getDoc(doc(db, "comments", id));
      })
    );
    return response.map((doc) => {
      return { id: doc.id, comment: doc.data() } as CommentObject;
    });
  } catch (e) {
    console.log("Error getting document: ", e);
  }
}