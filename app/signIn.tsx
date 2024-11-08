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
import { Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import LoadingComponent from "@/components/LoadingComponent";
import KeyboardComponent from "@/components/KeyboardComponent";
import { useAuth } from "@/providers/authContext";
import { auth } from "@/firebaseConfig";

export default function SignIn() {
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const router = useRouter();
  const emailRef = useRef<string>("");
  const passwordRef = useRef<string>("");

  const handleLogin = async () => {
    // First, check that email and/or password is not empty
    if (!emailRef.current || !passwordRef.current) {
      // Using react-native Alert to handle user feedbacks
      Alert.alert("Could not sign in", "Email and password are required");
      return;
    }
    // Then, if both fields are filled, call the login function
    setLoading(true);
    const response = await login(emailRef.current, passwordRef.current);
    setLoading(false);
    if (!response.success) {
      Alert.alert("Could not sign in", response.msg);
    } else {
      console.log(
        "Login successfully with user: ",
        auth.currentUser?.displayName + " with email: ",
        auth.currentUser?.email
      );
    }
  };

  return (
    <View className="flex-1 bg-[#000000e5]">
      <StatusBar style="light" />
      <Image
        source={require("../assets/images/signInBack.png")}
        resizeMode="cover"
        className="absolute w-full h-full opacity-30"
        accessibilityLabel="Cover image"
      />
      <KeyboardComponent>
        <View
          style={{ paddingTop: hp(30), paddingHorizontal: wp(5) }}
          className="flex-1 justify-center gap-6"
        >
          <Text
            style={{ fontSize: hp(6) }}
            className="text-center text-custom-orange"
          >
            SIGN IN
          </Text>
          <View className="gap-4">
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
                accessibilityLabel="Enter username"
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
            <View>
              {loading ? (
                <View className="flex-row justify-center">
                  <LoadingComponent size={wp(25)} />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleLogin}
                  style={{ height: hp(6.5) }}
                  className="bg-custom-orange rounded-xl justify-center items-center"
                >
                  <Text
                    style={{ fontSize: hp(2.7) }}
                    className="text-neutral-800 font-bold tracking-widest"
                  >
                    Sign In
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View className="flex-row justify-center">
              <Text
                style={{ fontSize: hp(2) }}
                className="font-medium text-neutral-200"
              >
                Don't have an account?{" "}
              </Text>
              <Pressable onPress={() => router.push("/signUp")}>
                <Text
                  style={{ fontSize: hp(2) }}
                  className="font-bold text-custom-orange"
                >
                  Sign Up
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardComponent>
    </View>
  );
}
