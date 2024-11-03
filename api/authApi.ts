import { auth, db } from "@/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";







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
