import {
  createContext,
  useEffect,
  useState,
  useContext,
  ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "@/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";

const auth = getAuth();

type AuthContextType = {
  login: (email: string, password: string) => Promise<{ success: boolean; msg?: string; data?: any }>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    username: string,
    profileImage: string
  ) => Promise<{ success: boolean; msg?: string; data?: any }>;
  user?: string | null;
  isAuthenticated?: boolean;
};

// Create AuthContext with default function placeholders
const AuthContext = createContext<AuthContextType>({
  login: async () => {
    throw new Error("login function must be used within AuthContextProvider");
  },
  logout: async () => {
    throw new Error("logout function must be used within AuthContextProvider");
  },
  register: async () => {
    throw new Error(
      "register function must be used within AuthContextProvider"
    );
  },
  user: null,
  isAuthenticated: undefined,
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    // Use onAuthStateChanged to check if the user is authenticated or not.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login: async (email: string, password: string) => {
          try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            return { success: true, data: response.user };
          } catch (error: any) {
            let msg = error.message;
            if (msg.includes("(auth/user-not-found)")) msg = "User not found";
            if (msg.includes("(auth/invalid-credential)")) msg = "Invalid credentials";
            return { success: false, msg };
          }
        },
        logout: async () => {
          await signOut(auth);
          // The onAuthStateChanged listener will handle updating user state
        },
        register: async (
          email: string,
          password: string,
          username: string,
          profileImage: string
        ) => {
          try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", response.user.uid), {
              username,
              profileImage,
              userId: response.user.uid,
            });
            return { success: true, data: response.user };
          } catch (error: any) {
            let msg = error.message;
            if (msg.includes("(auth/invalid-email)")) msg = "Invalid email";
            if (msg.includes("(auth/email-already-in-use)")) msg = "Email already in use";
            return { success: false, msg };
          }
        },
        user: user?.email,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

/* import { createContext, useEffect, useState, useContext } from "react";
import { ReactNode } from "react";
import { getAuth, User } from "firebase/auth";
import * as authAPI from "@/api/authApi";
import { onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

type AuthContextType = {
  login: (email: string, password: string) => void;
  logout: VoidFunction;
  register: (
    email: string,
    password: string,
    username: string,
    profileImage: string
  ) => void;
  user?: string | null;
  isAuthenticated?: boolean;
};

const AuthContext = createContext<AuthContextType>({
  login: (s: string, p: string) => null,
  logout: () => null,
  register: (s: string, p: string, u: string, i: string) => null,
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    // onAuthStateChanged. method used to check if the user is authenticated or not.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login: async (email: string, password: string) => {
          await authAPI.login(email, password);
        },
        logout: async () => {
          await authAPI.logout();
        },
        register: async (email: string, password: string, username: string) => {
          await authAPI.register(email, password, username);
        },
        user: user?.email,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used within a AuthContextProvider");
  }

  return value;
};
 */
