import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Octicons, Ionicons, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import LoadingComponent from "@/components/LoadingComponent";
import { useAuth } from "@/providers/authContext";
import InputComponent from "@/components/InputComponent";

export default function SignUp() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const { register, login } = useAuth();

  /*   const handleRegister = async () => {
    if (
      !emailRef.current ||
      !passwordRef.current ||
      !usernameRef.current ||
      !profileRef.current
    ) {
      Alert.alert(
        "Could not register",
        "Please choose a username, email and password"
      );
      return;
    }
    // Then, if both fields are filled, call the register function
    setLoading(true);
    let response = await register(
      emailRef.current,
      passwordRef.current,
      usernameRef.current,
      profileRef.current
    );
    setLoading(false);
    console.log("New user registred with: ", response);
    if (!response.success) {
      Alert.alert("Could not register", response.msg);
    }
  }; */

  const handleRegister = async () => {
    if (!email || !password || !username || !profileImage) {
      Alert.alert(
        "Could not register",
        "Please fill in all fields to register"
      );
      return;
    }

    setLoading(true);

    // Call the register function
    const response = await register(email, password, username, profileImage);

    setLoading(false);

    if (!response.success) {
      Alert.alert("Could not register", response.msg);
      return;
    }
    console.log("Registration successful. Attempting login...");

    // If registration is successful, automatically log the user in
    const loginResponse = await login(email, password);

    if (loginResponse.success) {
      console.log("Login successful. Navigating to the home screen...");
      router.replace("/(tabs)/gallery");
    } else {
      Alert.alert("Login failed", loginResponse.msg);
    }
  };

  const pickImage = async () => {
    // First, ask for permission to access the user's gallery
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      // Print pop allert if permission is denied
      Alert.alert(
        "Permission denied",
        "To upload a profile picture, you need to grant access to your gallery"
      );
      return;
    }
    // If permission is granted, open the gallery
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <View className="flex-1 bg-[#000000e5]">
      <StatusBar style="light" />
      {loading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <LoadingComponent size={wp(25)} />
        </View>
      )}
      <Image
        source={require("../assets/images/registerBack.png")}
        resizeMode="cover"
        className="absolute w-full h-full opacity-30"
        accessibilityLabel="Cover image"
      />
      <ScrollView
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View
          style={{ paddingTop: hp(25), paddingHorizontal: wp(5) }}
          className="flex-1 justify-center gap-6"
        >
          <Text
            style={{ fontSize: hp(6) }}
            className="text-center text-custom-orange"
          >
            REGISTER
          </Text>
          <View className="gap-4">
            <InputComponent
              accessibilityLabel="Username"
              accessibilityHint="Enter your desired username"
              value={username}
              placeholder="Enter a username..."
              onChangeText={setUsername}
              icon={<Ionicons name="person" size={24} color="#f5a442" />}
            />
            <InputComponent
              accessibilityLabel="Email"
              accessibilityHint="Enter your email address"
              value={email}
              placeholder="Enter your email..."
              onChangeText={setEmail}
              icon={<Octicons name="mail" size={24} color="#f5a442" />}
            />
            <InputComponent
              accessibilityLabel="Password"
              accessibilityHint="Enter a password"
              value={password}
              placeholder="Select a password..."
              secureTextEntry={true}
              onChangeText={setPassword}
              icon={<Octicons name="lock" size={24} color="#f5a442" />}
            />
            <TouchableOpacity onPress={pickImage}>
              <InputComponent
                accessibilityLabel="Profile picture"
                accessibilityHint="Select a profile picture"
                value={image ? "Image selected" : "Upload profile picture"}
                placeholder="Upload profile picture..."
                icon={<Feather name="image" size={24} color="#f5a442" />}
              />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              onPress={handleRegister}
              style={{ height: hp(6.5) }}
              className="bg-custom-orange rounded-xl justify-center items-center"
            >
              <Text
                style={{ fontSize: hp(2.7) }}
                className="text-neutral-800 font-bold tracking-widest"
              >
                Register
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center">
            <Text
              style={{ fontSize: hp(2) }}
              className="font-medium text-neutral-200"
            >
              Already have an account?{" "}
            </Text>
            <Pressable onPress={() => router.push("/signIn")}>
              <Text
                style={{ fontSize: hp(2) }}
                className="font-bold text-custom-orange"
              >
                Sign In
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
