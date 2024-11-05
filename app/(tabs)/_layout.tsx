import { Tabs } from "expo-router";
import React from "react";
import { Fontisto, Octicons } from "@expo/vector-icons";
import Header from "@/components/Header";

export default function _layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "rgba(30, 83, 120, 1)",
        tabBarInactiveTintColor: "rgba(0, 0, 0, 1)",
        tabBarStyle: {
          backgroundColor: "rgba(135, 215, 239, 0.69)",
          borderTopWidth: 0,
          //height: 90,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="gallery"
        options={{
          header: () => <Header />,
          title: "Gallery",
          tabBarLabel: "",
          tabBarIcon: ({ size, color }) => (
            <Fontisto
              name="photograph"
              size={size}
              color={color}
              accessibilityLabel="Gallery Tab"
              accessibilityHint="Navigate to the gallery view"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          header: () => <Header />,
          title: "New Post",
          tabBarLabel: "",
          tabBarIcon: ({ size, color }) => (
            <Octicons
              name="diff-added"
              size={size}
              color={color}
              accessibilityLabel="New Post Tab"
              accessibilityHint="Navigate to new post site"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          header: () => <Header />,
          title: "Map",
          tabBarLabel: "",
          tabBarIcon: ({ size, color }) => (
            <Fontisto
              name="map"
              size={size}
              color={color}
              accessibilityLabel="Map Tab"
              accessibilityHint="Navigate to the map view"
            />
          ),
        }}
      />
    </Tabs>
  );
}
