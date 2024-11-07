import React, { useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Octicons, Ionicons, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import KeyboardComponent from "@/components/KeyboardComponent";
import LoadingComponent from "@/components/LoadingComponent";
import { useAuth } from "@/providers/authContext";

export default function SignUp () {
  const emailRef = useRef<string>("");
  const passwordRef = useRef<string>("");
  const usernameRef = useRef<string>("");
  const profileRef = useRef<string>("");

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
    if (
      !emailRef.current ||
      !passwordRef.current ||
      !usernameRef.current ||
      !profileRef.current
    ) {
      Alert.alert(
        "Could not register",
        "Please fill in all fields to register"
      );
      return;
    }

    setLoading(true);

    // Call the register function
    const response = await register(
      emailRef.current,
      passwordRef.current,
      usernameRef.current,
      profileRef.current
    );

    setLoading(false);

    if (!response.success) {
      Alert.alert("Could not register", response.msg);
      return;
    }
    console.log("Registration successful. Attempting login...");

    // If registration is successful, automatically log the user in
    const loginResponse = await login(emailRef.current, passwordRef.current);

    if (loginResponse.success) {
      console.log("Login successful. Navigating to the home screen...");
      router.replace("/(tabs)/gallery");
    } else {
      Alert.alert("Login failed", loginResponse.msg);
    }
  };
/*
  const handlePickImage = async () => {
    const imageUri = await pickImage();
    if (imageUri) {
      setImage(imageUri);
      profileRef.current = imageUri; // Link image URI to the user profile ref
    }
  };
*/

  const pickImage = async () => {
    console.log("PickImage called");
    // First, ask for permission to access the user's gallery
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "To upload a profile picture, you need to grant access to your gallery"
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      profileRef.current = result.assets[0].uri;
    }
  };
  return (
    <View className="flex-1 bg-[#000000e5]">
      <StatusBar style="light" />
      <Image
        source={require("../assets/images/registerBack.png")}
        resizeMode="cover"
        className="absolute w-full h-full opacity-30"
        accessibilityLabel="Cover image"
      />
      <KeyboardComponent>
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
            <View
              style={{ height: hp(7) }}
              className="flex-row gap-4 px-4 bg-black/60 items-center rounded-xl"
            >
              <Ionicons name="person" size={hp(3)} color="#f5a442" />
              <TextInput
                onChangeText={(value) => (usernameRef.current = value)}
                style={{ fontSize: hp(2.5), color: "white" }}
                className="flex-1"
                placeholder="Enter your username"
                placeholderTextColor="gray"
                accessibilityLabel="Enter username"
              ></TextInput>
            </View>
            <View
              style={{ height: hp(7) }}
              className="flex-row gap-4 px-4 bg-black/60 items-center rounded-xl"
            >
              <Octicons name="mail" size={hp(3)} color="#f5a442" />
              <TextInput
                onChangeText={(value) => (emailRef.current = value)}
                style={{ fontSize: hp(2.5), color: "white" }}
                className="flex-1"
                placeholder="Enter your email"
                placeholderTextColor="gray"
                accessibilityLabel="Enter email"
              ></TextInput>
            </View>
            <View className="gap-3">
              <View
                style={{ height: hp(7) }}
                className="flex-row gap-4 px-4 bg-black/60 items-center rounded-xl"
              >
                <Octicons name="lock" size={hp(3)} color="#f5a442" />
                <TextInput
                  onChangeText={(value) => (passwordRef.current = value)}
                  style={{ fontSize: hp(2.5), color: "white" }}
                  className="flex-1"
                  placeholder="Enter password"
                  placeholderTextColor="gray"
                  secureTextEntry={true}
                  accessibilityLabel="Enter password"
                ></TextInput>
              </View>
            </View>
            <View className="gap-3">
              <TouchableOpacity
                onPress={pickImage}
                style={{ height: hp(7) }}
                className="flex-row gap-4 px-4 bg-black/60 items-center rounded-xl"
              >
                <Feather name="image" size={hp(3)} color="#f5a442" />
                <Text
                  style={{ fontSize: hp(2.5) }}
                  className="flex-1 text-neutral-400"
                >
                  {image ? "Image selected" : "Upload profile picture"}
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              {loading ? (
                <View className="flex-row justify-center">
                  <LoadingComponent size={wp(25)} />
                </View>
              ) : (
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
              )}
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
        </View>
      </KeyboardComponent>
    </View>
  );
};
