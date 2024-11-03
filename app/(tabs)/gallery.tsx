import { useAuth } from "@/providers/authContext";
import { signOut } from "firebase/auth";
import { View, Text, Pressable } from "react-native";

export default function Gallery() {
  const { logout } = useAuth();
  const handleLogout = async () => {
    await logout();
  };

  return (
    <View>
      <Text>Home/1st page Gallery</Text>
      <Pressable onPress={handleLogout}>
        <Text>Sign out</Text>
      </Pressable>
    </View>
  );
}
