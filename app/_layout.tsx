import { Stack, Slot } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack>
      <Slot />
    </Stack>
  );
}
