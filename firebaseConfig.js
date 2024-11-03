import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  browserLocalPersistence,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseConfig from "./firebaseEnv";
import { Platform } from "react-native";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let auth;
if (Platform.OS === "web") {
  auth = getAuth(app);
  auth.setPersistence(browserLocalPersistence);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);

const userRef = collection(db, "users");
export default userRef;
