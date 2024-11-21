import { Tabs } from "expo-router";
import React from "react";
import { Fontisto, Octicons } from "@expo/vector-icons";
import ProfileHeader from "@/components/ProfileHeader";
import { useAuth } from "@/providers/authContext";
import { Alert } from "react-native";

export default function _layout() {
const { user } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#000000",
        tabBarStyle: {
          backgroundColor: "#f5a442",
          borderTopWidth: 0,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="gallery"
        options={{
          header: () => <ProfileHeader />, // Set the custom header for the gallery screen.
          title: "Gallery",
          tabBarLabel: "",
          tabBarIcon: ({ size, color }) => (
            <Fontisto
              name="photograph"
              size={size}
              color={color}
              accessibilityLabel="Gallery Tab"
              accessibilityHint="Navigate to the gallery view"
              accessibilityRole="tab"
            />
          ),
        }}
      />
      {/* Listeners makes it possible to protect the tab from being accessed by anonymous users.
       if the user is anonymous, the tab will not be accessible and a alert will be shown to the user. 
       Remeber that an anonymous user is authenticated in Firebase Auth. */}
      <Tabs.Screen
        name="newPost"
        options={{
          header: () => <ProfileHeader />,
          title: "New Post",
          tabBarLabel: "",
          tabBarIcon: ({ size, color }) => (
            <Octicons
              name="diff-added"
              size={size}
              color={color}
              accessibilityLabel="New Post Tab"
              accessibilityHint="Navigate to new post site"
              accessibilityRole="tab"
            />
          ),
        }}
        listeners={() => ({
          tabPress: (e) => {
            console.log("User", user);
            if (!user || user.isAnonymous) {
              console.log(
                "Preventing access to new post tab for anonymous user"
              );
              e.preventDefault();
              Alert.alert(
                "Access Denied",
                "Anonymous users cannot upload new art pieces. Please sign in to upload your art."
              );
            }
          },
        })}
      />
      <Tabs.Screen
        name="map"
        options={{
          header: () => <ProfileHeader />,
          title: "Map",
          tabBarLabel: "",
          tabBarIcon: ({ size, color }) => (
            <Fontisto
              name="map"
              size={size}
              color={color}
              accessibilityLabel="Map Tab"
              accessibilityHint="Navigate to the map view"
              accessibilityRole="tab"
            />
          ),
        }}
        listeners={() => ({
          tabPress: (e) => {
            console.log("User", user);
            if (!user || user.isAnonymous) {
              console.log("Preventing access to map tab for anonymous user");
              e.preventDefault();
              Alert.alert(
                "Access Denied",
                "Anonymous users dont have access to the map. Please sign in to view the map."
              );
            }
          },
        })}
      />
    </Tabs>
  );
}
