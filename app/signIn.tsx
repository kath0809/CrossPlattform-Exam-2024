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
import { Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import LoadingComponent from "@/components/LoadingComponent";
import { useAuth } from "@/providers/authContext";
import { auth } from "@/firebaseConfig";
import InputComponent from "@/components/InputComponent";
import * as authApi from "@/api/authApi";

export default function SignIn() {
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const { anonymousSignIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");


  const handleLogin = async () => {
    if (!email || !password) {
      // If user tries to sign in with blank fields
      Alert.alert("Could not sign in", "Email and password are required");
      return;
    }
    setLoading(true);
    const response = await login(email, password);
    setLoading(false);
    if (!response.success) {
      // if user tries to sign in with invalid credentials
      // convert firebase internal error code to readable message.
      Alert.alert("Could not sign in", response.msg);
    } else {
      console.log(
        "Login successfully with user: ",
        auth.currentUser?.displayName + " with email: ",
        auth.currentUser?.email
      );
    }
  };

  // An anonymous user is still authenticated by Firebase, without leaving email or password.
  // So inside the authprovider an anonymous user is given credentials like a signed in user.
  const handleAnonymousSignIn = async () => {
    await anonymousSignIn();
  }

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
      {/* Image is downloaded from freepik 6.11.2024
      https://www.freepik.com/free-photo/tattooed-young-man-with-pierced-ear-nose-holding-flower-bouquet-front-his-face_4371175.htm
      */}
      <Image
        source={require("../assets/images/signInBack.png")}
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
            <InputComponent
              value={email}
              placeholder="Enter your email"
              onChangeText={setEmail}
              icon={<Octicons name="mail" size={hp(3)} color="#f5a442" />}
              accessibilityLabel="Enter username"
            />
            <InputComponent
              value={password}
              placeholder="Enter password"
              onChangeText={setPassword}
              icon={<Octicons name="lock" size={hp(3)} color="#f5a442" />}
              secureTextEntry={true}
              accessibilityLabel="Enter password"
            />
          </View>
          <View>
            <TouchableOpacity
              onPress={handleLogin}
              style={{ height: hp(6.5) }}
              className="bg-custom-orange rounded-xl justify-center items-center"
            >
              <Text
                style={{ fontSize: hp(2.7) }}
                className="text-neutral-800 font-bold tracking-widest"
                accessibilityLabel="Sign in button"
                accessibilityHint="Sign in"
              >
                Sign In
              </Text>
            </TouchableOpacity>
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
                accessibilityLabel="Go to sign up page"
                accessibilityHint="Press to sign up"
                accessibilityRole="button"
              >
                Sign Up
              </Text>
            </Pressable>
          </View>
          <View className="flex-row justify-center">
            <Text
              style={{ fontSize: hp(2) }}
              className="font-medium text-neutral-200"
            >
              Don't want to sign in?{" "}
            </Text>
            <Pressable onPress={handleAnonymousSignIn}>
              <Text
                style={{ fontSize: hp(2) }}
                className="font-bold text-custom-orange"
                accessibilityLabel="Sign in anonymously"
                accessibilityHint="Press to sign in anonymously"
                accessibilityRole="button"
              >
                Sign in anonymously
              </Text>
            </Pressable>
          </View>

          <View className="flex-row justify-center">
            <Text
              style={{ fontSize: hp(2) }}
              className="font-medium text-neutral-200"
            >
              Sign in with your{" "}
            </Text>
            <Pressable onPress={async () => {
              await authApi.googleSignIn();
            }}>
              <Text
                style={{ fontSize: hp(2) }}
                className="font-bold text-custom-orange"
                accessibilityLabel="Sign in anonymously"
                accessibilityHint="Press to sign in anonymously"
                accessibilityRole="button"
              >
                Google Account
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
