import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import "../global.css";
import { AuthContextProvider, useAuth } from "@/providers/authContext";

const MainLayout = () => {
  const { isAuthenticated } = useAuth() as { isAuthenticated: boolean };
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (typeof isAuthenticated === "undefined") return;
    const inTabs = segments[0] === "(tabs)";
    if (isAuthenticated && !inTabs) {
      // Redirect to
      router.replace("/gallery");
    } else if (isAuthenticated == false) {
      // If the user is not authenticated, redirect to the sign in page
      router.replace("/signIn");
    }
  }, [isAuthenticated]);

  return <Slot />;
};

export default function RootLayout() {
  return (
    // Wrap the AuthContextProvider around the MainLayout component to ensure that the AuthContextProvider is available to all child components.
    
    <AuthContextProvider>
      <MainLayout />
    </AuthContextProvider>
  );
}
