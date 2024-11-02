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
import { Octicons, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import LoadingComponent from "@/components/LoadingComponent";

export default function SignIn() {
  const [loading, setLoading] = useState<boolean>(false);
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
    // Then, if bouth feilds are filled, call the login function
  };

  return (
    <View className="flex-1">
      <StatusBar style="dark" />
      <View
        style={{ paddingTop: hp(8), paddingHorizontal: wp(5) }}
        className="flex-1 gap-12"
      >
        <View className="items-center">
          <Image
            style={{ height: hp(25) }}
            resizeMode="contain"
            source={require("../assets/images/logIn.png")}
            accessibilityLabel="Login Ilustration"
          />
        </View>
        <View className="gap-10">
          <Text
            style={{ fontSize: hp(4) }}
            className="font-semibold tracking-widest text-center text-neutral-800"
          >
            Sign In
          </Text>

          {/* Sign in inputs */}
          <View className="gap-4">
            <View
              style={{ height: hp(7) }}
              className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl"
            >
              <Octicons name="mail" size={hp(3)} color="teal" />
              <TextInput
                onChangeText={(value) => (emailRef.current = value)}
                style={{ fontSize: hp(2.5) }}
                className="flex-1"
                placeholder="Enter email adress"
                accessibilityLabel="Enter email address"
              ></TextInput>
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

              {/* //TODO remove if not in use */}
              <Text
                style={{ fontSize: hp(1.8) }}
                className="font-medium text-right text-neutral-500"
              >
                Forgot password?
              </Text>
            </View>

            {/* Sign-In Button with LoadingComponent. When loading is true, show the LoadingComponent */}
            <View>
              {loading ? (
                <View className="flex-row justify-center">
                  <LoadingComponent size={wp(25)} />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleLogin}
                  style={{ height: hp(6.5) }}
                  className="bg-teal-600 rounded-xl justify-center items-center"
                >
                  <Text
                    style={{ fontSize: hp(2.7) }}
                    className="text-white font-bold tracking-widest"
                  >
                    Sign In
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <Text
              style={{ fontSize: hp(2) }}
              className="font-medium text-neutral-500 text-center"
            >
              Or
            </Text>

            {/* //TODO add function */}
            {/* Google Sign-In Button */}
            <TouchableOpacity
              style={{
                height: hp(6.5),
              }}
              className="rounded-xl flex-row items-center justify-center border border-neutral-500"
            >
              <Image
                source={require("../assets/images/google.png")}
                style={{ width: 24, height: 24 }}
                accessibilityLabel="Google Logo"
              />
              <Text
                style={{ fontSize: hp(2.5), marginLeft: 10 }}
                className="font-medium text-neutral-700"
              >
                Sign in with Google
              </Text>
            </TouchableOpacity>

            {/* Send to Sign-Up */}
            <View className="flex-row justify-center">
              <Text
                style={{ fontSize: hp(2) }}
                className="font-medium text-neutral-500"
              >
                Don't have an account?{" "}
              </Text>
              <Pressable onPress={() => router.push("/signUp")}>
                <Text
                  style={{ fontSize: hp(2) }}
                  className="font-bold text-teal-600"
                >
                  Sign Up
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
