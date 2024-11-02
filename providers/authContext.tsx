import { createContext, useEffect, useState, useContext } from "react";
import { ReactNode } from "react";

export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    // onAuthStateChanged. method used to check if the user is authenticated or not.
    setIsAuthenticated(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Implement login logic here
    } catch (error) {
      // Handle login error here
    }
  };

  const logout = async () => {
    try {
      // Implement logout logic here
    } catch (error) {
      // Handle logout error here
    }
  };

  const register = async (
    email: string,
    password: string,
    username: string
  ) => {
    try {
      // Implement register logic here
    } catch (error) {
      // Handle register error here
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, register }}
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
