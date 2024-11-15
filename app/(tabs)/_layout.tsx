import { Tabs } from "expo-router";
import React from "react";
import { Fontisto, Octicons } from "@expo/vector-icons";
import ProfileHeader from "@/components/ProfileHeader";

export default function _layout() {
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
          header: () => <ProfileHeader />,
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
      />
    </Tabs>
  );
}
