import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  getAuth,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { loginUser, logoutUser, registerUser } from "@/api/authApi";
import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

interface User extends FirebaseUser {
  username?: string;
  profileImage?: string;
}

const auth = getAuth();

// Define context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; msg?: string; data?: any }>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    username: string,
    profileImage: string
  ) => Promise<{ success: boolean; msg?: string; data?: any }>;
}

// Create AuthContext with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      //console.log("Got user ", user?.email);
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
        const extendedUser: User = { ...firebaseUser, ...userData };
        setUser(extendedUser);
        setIsAuthenticated(true);
        //console.log("Got user ",extendedUser.username, "with email",extendedUser.email);
        //setUserState(user);
      } else {
        setUserState(null);
        setIsAuthenticated(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const setUserState = (user: User | null) => {
    setUser(user);
    setIsAuthenticated(!!user);
  };

  const login = async (email: string, password: string) => {
    const result = await loginUser(email, password);
    if (result.success && result.data) {
      setUser(result.data);
      setIsAuthenticated(true);
    }
    return result;
  };

  const logout = async () => {
    await logoutUser();
    setUserState(null);
  };

  const register = async (
    email: string,
    password: string,
    username: string,
    profileImage: string
  ) => {
    const result = await registerUser(email, password, username, profileImage);
    if (result.success && result.data) {
      setUserState(result.data);
    }
    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
