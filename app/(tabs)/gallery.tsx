import { auth } from "@/firebaseConfig";
import { signOut } from "firebase/auth";
import { View, Text, Pressable } from "react-native";

export default function Gallery() {





  return (
    <View>
      <Text>Home/1st page Gallery</Text>
      <Pressable
        onPress={() => {
          signOut(auth);
        }}
      >
        <Text>Sign out</Text>
      </Pressable>
    </View>
  );
}
