import { auth, db } from "@/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const login = async (email: string, password: string) => {
  try {
    // Implement login logic here
  } catch (error) {
    // Handle login error here
  }
};

export const logout = async () => {
  try {
    // Implement logout logic here
  } catch (error) {
    // Handle logout error here
  }
};

export const register = async (
  email: string,
  password: string,
  username: string,
  profileImage: string
): Promise<{ success: boolean; msg?: string; data?: any }> => {
  try {
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User signed up", response?.user);

    await setDoc(doc(db, "users", response?.user?.uid), {
      username,
      profileImage,
      userId: response?.user?.uid,
    });
    return { success: true, data: response?.user };
  } catch (error: any) {
    let msg = error.message;
    if (msg.includes('(auth/invalid-email)')) msg = 'Invalid email';
    return { success: false, msg };
  }
};

/* export const register = (email: string, password: string, username: string, profileImage: string) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      await updateProfile(userCredential.user, {
        displayName: username,
      });
      console.log("User signed up", userCredential.user.email);
      console.log("User signed up", userCredential.user.displayName);
    })
    .catch((error) => {
      console.log(`Error signing up ${error.code}, message: ${error.message}`);
    }
  );
}  */
