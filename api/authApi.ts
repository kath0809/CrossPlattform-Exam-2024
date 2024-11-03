import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

const auth = getAuth();

// Function to handle user login
export const loginUser = async (
  email: string,
  password: string
): Promise<{ success: boolean; msg?: string; data?: User }> => {
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, data: response.user };
  } catch (error: any) {
    let msg = error.message;
    if (msg.includes("(auth/invalid-email)")) msg = "User not found";
    if (msg.includes("(auth/invalid-credential)")) msg = "Invalid credentials";
    return { success: false, msg };
  }
};

// Function to handle user logout
export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

// Function to handle user registration
export const registerUser = async (
  email: string,
  password: string,
  username: string,
  profileImage: string
): Promise<{ success: boolean; msg?: string; data?: User }> => {
  try {
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // Store additional user information in Firestore
    await setDoc(doc(db, "users", response.user.uid), {
      username,
      profileImage,
      userId: response.user.uid,
    });
    return { success: true, data: response.user };
  } catch (error: any) {
    let msg = error.message;
    if (msg.includes("(auth/invalid-email)")) msg = "Invalid email";
    if (msg.includes("(auth/email-already-in-use)"))
      msg = "Email already in use";
    return { success: false, msg };
  }
};
