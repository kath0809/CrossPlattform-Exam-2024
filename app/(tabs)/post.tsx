import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from "react-native";
import { Octicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Post() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.backgroundContainer}>
        {/* Overlay Image */}
        <Image
          source={require("../../assets/images/test-design.png")}
          style={styles.backgroundImage}
          resizeMode="cover"
        />

        <View style={styles.contentContainer}>
          <Text style={styles.headerText}>Log In</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Octicons name="mail" size={24} color="white" />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#E0E0E0"
              style={styles.input}
              keyboardType="email-address"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Octicons name="lock" size={24} color="white" />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#E0E0E0"
              style={styles.input}
              secureTextEntry
            />
          </View>

          {/* Forgot Password Link */}
          <Text style={styles.forgotPassword}>Forgot password?</Text>

          {/* Login Button */}
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>

          {/* Or Separator */}
          <Text style={styles.orText}>Or</Text>

          {/* Google Login Button */}
          <TouchableOpacity style={styles.googleButton}>
            <Image
              source={require("../../assets/images/google.png")}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <Pressable onPress={() => router.push("/signUp")}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

// Styles for the login screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#264653", // Fallback background color
  },
  backgroundContainer: {
    flex: 1,
    justifyContent: "center",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.3, // Adjust opacity for a subtle background effect
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 32,
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    color: "white",
    padding: 10,
  },
  forgotPassword: {
    color: "#E0E0E0",
    textAlign: "right",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#E76F51",
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  orText: {
    color: "#E0E0E0",
    textAlign: "center",
    marginBottom: 20,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 50,
    paddingVertical: 15,
    marginBottom: 20,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color: "#264653",
    fontSize: 18,
    fontWeight: "500",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signUpText: {
    color: "#E0E0E0",
  },
  signUpLink: {
    color: "#E76F51",
    fontWeight: "bold",
  },
});
