import React from "react";
import { View, TextInput } from "react-native";

type FormInputProps = {
  value: string;
  placeholder: string;
  onChangeText?: (text: string) => void;
  icon: React.ReactNode;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
};

export default function InputComponent({
  value,
  placeholder,
  onChangeText,
  icon,
  multiline = false,
  numberOfLines = 1,
  secureTextEntry = false,
  accessibilityLabel,
  accessibilityHint,
}: FormInputProps) {
  return (
    <View
      style={{ height: multiline ? 50 : 50 }}
      className="flex-row gap-4 px-4 bg-black/40 items-center rounded-xl"
    >
      {icon}
      <TextInput
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={"gray"}
        style={{ color: "white", fontSize: 18 }}
        multiline={multiline}
        numberOfLines={numberOfLines}
        secureTextEntry={secureTextEntry}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
      />
    </View>
  );
}
