import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
} from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { loginUser, logoutUser, registerUser } from "@/api/authApi";

const auth = getAuth();

// Define types for the authentication context
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "AUTH_STATE_CHANGED"; payload: User | null };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

// Reducer function to manage authentication state
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload, isAuthenticated: true };
    case "LOGOUT":
      return { user: null, isAuthenticated: false };
    case "AUTH_STATE_CHANGED":
      return { user: action.payload, isAuthenticated: !!action.payload };
    default:
      return state;
  }
};

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
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch({ type: "AUTH_STATE_CHANGED", payload: user });
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await loginUser(email, password);
    if (result.success && result.data) {
      dispatch({ type: "LOGIN", payload: result.data });
    }
    return result;
  };

  const logout = async () => {
    await logoutUser();
    dispatch({ type: "LOGOUT" });
  };

  const register = async (
    email: string,
    password: string,
    username: string,
    profileImage: string
  ) => {
    const result = await registerUser(email, password, username, profileImage);
    if (result.success && result.data) {
      dispatch({ type: "LOGIN", payload: result.data });
    }
    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
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
