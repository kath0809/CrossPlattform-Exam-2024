import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import firebaseConfig from "./firebaseEnv";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { googleWebClient } from "./googleSignInEnv";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth =
  Platform.OS === "web"
    ? initializeAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage),
      });

GoogleSignin.configure({
  webClientId: { googleWebClient },
});

export const db = getFirestore(app);

const storage = getStorage(app);

export const getStorageRef = (path) => ref(storage, path);

export const getDownloadUrl = async (path) => {
  const url = await getDownloadURL(ref(storage, path));
  return url;
};

const userRef = collection(db, "users");
export default userRef;
