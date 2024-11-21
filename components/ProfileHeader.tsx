import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Platform,
  Modal,
  Alert,
  ScrollView,
  Pressable,
} from "react-native";
import {
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { blurhash } from "@/utils/common";
import { useAuth } from "@/providers/authContext";
import { AntDesign, Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as postApi from "@/api/postApi";
import { PostData } from "@/utils/postData";

// This is a boolean that checks if the platform is iOS or not. It is used to determine the top padding.
const ios = Platform.OS === "ios";

export default function ProfileHeader() {
  const { top } = useSafeAreaInsets(); // This is the top padding for iSO devices.
  const { user, logout } = useAuth(); // This is the user object from the AuthContext.
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userPosts, setUserPosts] = useState<PostData[]>([]);

  // Give user feedback with options in case logout was not intended.
  const handleLogout = async () => {
    Alert.alert(
      "Log out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            await logout();
            setIsModalVisible(false);
            console.log("User", user?.username + " logged out");
          },
        },
      ],
      { cancelable: false }
    );
  };

  // FEtch the user's posts from postApi to show the user's artwork in the profile.
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (user && user.uid) {
        try {
          const posts = await postApi.getUserPosts(user.uid);
          setUserPosts(posts);
        } catch (error) {
          console.log("Error fetching user posts", error);
        }
      }
    };
    fetchUserPosts();
  }, [user]);

  return (
    // Shows the users username and profile image if authenticated, nothing and blurhash if not signed in anonymously.
    // Increase padding by +10 for Android screens.
    <View
      style={{ paddingTop: ios ? top : top + 10 }}
      className="flex-row-reverse justify-between px-5 bg-custom-orange shadow pb-3 rounded-br-l"
    >
      <Pressable onPress={() => setIsModalVisible(true)}>
        {/* Use expo image so that the image only gets loaded once */}
        <Image
          style={{ height: hp(4.5), aspectRatio: 1, borderRadius: 100 }}
          source={user?.profileImage}
          placeholder={{ blurhash }}
          transition={200}
        />
      </Pressable>
      <Text className="text-neutral-800 text-lg font-bold mt-3">
        Hi, {user?.username}
      </Text>

      {/* When clicking the profile image, open this modal */}
      <Modal
        animationType="slide"
        transparent={true} // Set to true so the user can see the page they opened the modal from.
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(false);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: "#000000e5",
            paddingTop: Platform.OS === "ios" ? 50 : 20,
          }}
        >
          <View className="flex-row justify-between w-full px-4 py-3">
            <Pressable
              className="p-2"
              onPress={() => {
                setIsModalVisible(false);
                router.push("/newPost");
              }}
            >
              <Octicons name="diff-added" size={24} color="#f5a442" />
            </Pressable>
            <Pressable
              className="p-2"
              onPress={() => {
                setIsModalVisible(false);
              }}
            >
              <AntDesign name="close" size={24} color="#f5a442" />
            </Pressable>
            <Pressable onPress={handleLogout} className="p-2">
              <Octicons name="sign-out" size={24} color="#f5a442" />
            </Pressable>
          </View>
          <View
            style={{
              width: "100%",
              padding: 20,
              alignItems: "center",
            }}
          >
            {user?.username ? (
              <Text
                className="font-bold color-custom-orange mb-2"
                style={{ fontSize: 24 }}
              >
                {user.username}
              </Text>
            ) : (
              <Text
                className="font-bold color-custom-orange mb-2"
                style={{ fontSize: 24 }}
              >
                Signed in as Anonymous
              </Text>
            )}
            {user && !user.isAnonymous && (
              <View>
                <Image
                  style={{
                    height: hp(20),
                    aspectRatio: 1,
                    borderRadius: 10,
                    borderColor: "#f5a442",
                    borderWidth: 2,
                  }}
                  source={user?.profileImage}
                  placeholder={{ blurhash }}
                  transition={500}
                />
              </View>
            )}
            <ScrollView>
              <View className="flex flex-row flex-wrap justify-center pt-10">
                {userPosts.map((post) => (
                  <View key={post.id}>
                    {post.imageURLs.map((imageURL, index) => (
                      <Image
                        key={index}
                        source={{ uri: imageURL }}
                        style={{
                          width: 100,
                          height: 100,
                          margin: 5,
                          borderRadius: 15,
                        }}
                      />
                    ))}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

