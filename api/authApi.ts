import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User,
  updateProfile,
  GoogleAuthProvider,
  signInWithCredential
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { GoogleSignin, isSuccessResponse } from "@react-native-google-signin/google-signin";

const auth = getAuth();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
// Function to handle registration of new useer.
export const registerUser = async (
  email: string,
  password: string,
  username: string,
  profileImage: string
): Promise<{ success: boolean; msg?: string; data?: User }> => {
  try {
    // Opprett brukeren med e-post og passord
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Oppdater brukerprofilen med displayName og photoURL
    await updateProfile(response.user, {
      displayName: username,
      photoURL: profileImage,
    });

    // Lagre ekstra brukerinformasjon i Firestore under "users"-samlingen
    await setDoc(doc(db, "users", response.user.uid), {
      username,
      profileImage,
      userId: response.user.uid,
    });

    return { success: true, data: response.user };
  } catch (error: any) {
    console.log("Error registering user: ", error.message);

    // Brukervennlige feilmeldinger
    let msg = error.message;
    if (msg.includes("(auth/invalid-email)"))
      msg = "Invalid email, please try again";
    if (msg.includes("(auth/email-already-in-use)"))
      msg = "Email already in use, please provide another email";

    return { success: false, msg };
  }
};

// Function to handle user login
export const loginUser = async (
  email: string,
  password: string
): Promise<{ success: boolean; msg?: string; data?: User }> => {
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, data: response.user };
  } catch (error: any) {
    console.log("Error logging in user: ", error.message);
    // Handle user feedback from internal error. This helps user to understand what went wrong
    // Uses common console error from firebase auth to provide user feedback.
    // If error from firebase is includes eg. "(auth/invalid-email)" then provide user friendly feedback to the screen.
    let msg = error.message;
    if (msg.includes("(auth/invalid-email)")) msg = "User not found";
    if (msg.includes("(auth/invalid-credential)")) msg = "Invalid credentials";
    return { success: false, msg };
  }
};

export const googleSignIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    if (isSuccessResponse(response)) {
      const user = GoogleSignin.getCurrentUser();
      if (user) {
        const googleCredential = GoogleAuthProvider.credential(user.idToken);
        const userCredential = await signInWithCredential(auth, googleCredential);
        console.log("User signed in with Google: ", userCredential.user.email + " " + userCredential.user.displayName);
      }
    }
    
  } catch (error) {
    console.log("Error logging in user with google.", error);
  }
}