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

const SignUp = () => {
  const emailRef = useRef<string>("");
  const passwordRef = useRef<string>("");
  const usernameRef = useRef<string>("");
  const profileRef = useRef<string>("");

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const { register } = useAuth();

  const handleRegister = async () => {
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
    console.log("got result", response);
    if (!response.success) {
      Alert.alert("Could not register", response.msg);
    }
  };

  const pickImage = async () => {
    // TODO: Remove before delivery
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
    // KeyboardComponent is a custom component to let user scroll if the keyboard is open
    <KeyboardComponent>
      <StatusBar style="dark" />
      <View
        style={{ paddingTop: hp(7), paddingHorizontal: wp(5) }}
        className="flex-1 gap-12"
      >
        <View className="items-center">
          <Image
            style={{ height: hp(20) }}
            resizeMode="contain"
            source={require("../assets/images/signUp.png")}
            accessibilityLabel="Login Ilustration"
          />
        </View>
        <View className="gap-10">
          <Text
            style={{ fontSize: hp(4) }}
            className="font-semibold tracking-widest text-center text-neutral-800"
          >
            Sign Up
          </Text>

          <View className="gap-4">
            <View
              style={{ height: hp(7) }}
              className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl"
            >
              <Ionicons name="person" size={hp(3)} color="teal" />
              <TextInput
                onChangeText={(value) => (usernameRef.current = value)}
                style={{ fontSize: hp(2.5) }}
                className="flex-1"
                placeholder="Enter your username"
                accessibilityLabel="Enter username"
              ></TextInput>
            </View>
            <View className="gap-3">
              <View
                style={{ height: hp(7) }}
                className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl"
              >
                <Octicons name="mail" size={hp(3)} color="teal" />
                <TextInput
                  onChangeText={(value) => (emailRef.current = value)}
                  style={{ fontSize: hp(2.5) }}
                  className="flex-1"
                  placeholder="Enter email address"
                ></TextInput>
              </View>
            </View>
            <View className="gap-3">
              <View
                style={{ height: hp(7) }}
                className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl"
              >
                <Octicons name="lock" size={hp(3)} color="teal" />
                <TextInput
                  onChangeText={(value) => (passwordRef.current = value)}
                  style={{ fontSize: hp(2.5) }}
                  className="flex-1"
                  placeholder="Enter password"
                  secureTextEntry={true}
                  accessibilityLabel="Enter password"
                ></TextInput>
              </View>
            </View>

            {/* Image Upload */}
            <View className="gap-3">
              <TouchableOpacity
                onPress={pickImage}
                style={{ height: hp(7) }}
                className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl"
              >
                <Feather name="image" size={hp(3)} color="teal" />
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
                  className="bg-teal-600 rounded-xl justify-center items-center"
                >
                  <Text
                    style={{ fontSize: hp(2.7) }}
                    className="text-white font-bold tracking-widest"
                  >
                    Register
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View className="flex-row justify-center">
              <Text
                style={{ fontSize: hp(2) }}
                className="font-medium text-teal-600"
              >
                Already have an account?{" "}
              </Text>
              <Pressable onPress={() => router.push("/signIn")}>
                <Text
                  style={{ fontSize: hp(2) }}
                  className="font-bold text-neutral-500"
                >
                  Sign in
                </Text>
              </Pressable>
            </View>
            <View className="flex-row justify-center">
              <Text
                style={{ fontSize: hp(2) }}
                className="font-medium text-neutral-500"
              >
                Don't want to sign in?{" "}
              </Text>
              {/* //! Make sure to add function so that the user can only see, and not interact */}
              <Pressable onPress={() => router.push("/gallery")}>
                <Text
                  style={{ fontSize: hp(2) }}
                  className="font-bold text-teal-600"
                >
                  Look around as guest
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </KeyboardComponent>
  );
};

export default SignUp;
