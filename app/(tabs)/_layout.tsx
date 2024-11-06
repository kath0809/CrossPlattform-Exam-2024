import { Tabs } from "expo-router";
import React from "react";
import { Fontisto, Octicons } from "@expo/vector-icons";
import Header from "@/components/Header";

export default function _layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#000000",
        tabBarStyle: {
          backgroundColor: "#f5a442",
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
