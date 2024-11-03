import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { ReactNode } from "react";
import React from "react";

const ios = Platform.OS === "ios";
export default function KeyboardComponent({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <KeyboardAvoidingView
      // If the platform is iOS, the behavior will be padding, if Android, it will be height
      behavior={ios ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
