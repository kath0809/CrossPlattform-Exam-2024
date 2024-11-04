import { Tabs } from "expo-router";
import React from "react";
import { Fontisto, Octicons } from "@expo/vector-icons";
import Header from "@/components/Header";

export default function _layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="gallery"
        options={{
          header: () => <Header />,
          title: "Gallery",
          tabBarLabel: "",
          tabBarIcon: ({ size }) => (
            <Fontisto
              name="photograph"
              size={size}
              color={"teal"}
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
          tabBarIcon: ({ size }) => (
            <Octicons
              name="diff-added"
              size={size}
              color={"teal"}
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
          tabBarIcon: ({ size }) => (
            <Fontisto
              name="map"
              size={size}
              color={"teal"}
              accessibilityLabel="Map Tab"
              accessibilityHint="Navigate to the map view"
            />
          ),
        }}
      />
    </Tabs>
  );
}
