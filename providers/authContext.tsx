import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { loginUser, registerUser } from "@/api/authApi";
import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

interface User {
  uid: string;
  email: string | null;
  username?: string;
  profileImage?: string;
}

const auth = getAuth();

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; msg?: string; data?: User }>;
  logout: () => Promise<{ success: boolean; msg?: string }>;
  register: (
    email: string,
    password: string,
    username: string,
    profileImage: string
  ) => Promise<{ success: boolean; msg?: string; data?: User }>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthContextProvider");
  return context;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          ...userData,
        } as User);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await loginUser(email, password);
    if (result.success && result.data) {
      setUser(result.data);
    }
    return result;
  };

  // Firebase logout function.
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      return { success: true, msg: "Logged out successfully" };
    } catch (error) {
      return { success: false, msg: "Logout failed" };
    }
  };

  const register = async (
    email: string,
    password: string,
    username: string,
    profileImage: string
  ) => {
    const result = await registerUser(email, password, username, profileImage);
    if (result.success && result.data) {
      setUser(result.data);
    }
    return result;
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/*interface User {
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      //console.log("Got user ", user?.email);
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
        const extendedUser: User = { ...user, ...userData };
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
*/
