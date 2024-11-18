import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, Pressable } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { getUserPosts, getAuthorById } from "@/api/postApi";
import { router, useLocalSearchParams } from "expo-router";
import { PostData, Author } from "@/utils/postData";
import { Ionicons } from "@expo/vector-icons";
import LoadingComponent from "./LoadingComponent";

// This component displays the diffrent artists profile and their uploaded artworks.

export default function UserProfileComponent() {
  const [author, setAuthor] = useState<Author | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { authorId } = useLocalSearchParams();

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        // Fetch the author profile by authorId(Artist)
        const authorProfile = await getAuthorById(authorId as string);
        setAuthor(authorProfile);
        // Then fetch the posts by authorId, to display the artworks
        const userPosts = await getUserPosts(authorId as string);
        setPosts(userPosts);
      } catch (error) {
        console.error("Failed to fetch author data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthorData();
  }, [authorId]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-black/90">
        <LoadingComponent size={wp(25)} />
      </View>
    );
  }

  if (!author) {
    return (
      <View className="flex-1 justify-center items-center bg-black/90">
        <Text className="text-white">
          Artist profile is not available.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black/90">
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
      <View className="h-2/6 justify-center items-center relative">
        <Image
          source={require("@/assets/images/profileBack.png")}
          className="w-full h-full absolute"
          style={{ resizeMode: "cover" }}
        />
        <View className="inset-0" />
        <Pressable
          onPress={() => router.back()}
          className="absolute top-10 left-4 pt-4"
        >
          <Ionicons name="arrow-back" size={30} color="black" />
        </Pressable>
        <View className="items-center">
          <Image
            source={{ uri: author.profileImage }}
            className="w-40 h-40 rounded-full border-2 border-custom-orange mb-3"
          />
        </View>
      </View>
      <View className="flex-row justify-center items-center pt-4">
        <Text className="text-custom-orange text-3xl font-bold">
          {author.authorName}
        </Text>
      </View>
      <ScrollView>
        <View className="flex flex-row flex-wrap justify-between pt-2">
          {posts.map((post) =>
            post.imageURLs.map((imageURL, index) => (
              <View key={`${post.id}-${index}`} className="w-1/3 p-1">
                <Image
                  source={{ uri: imageURL }}
                  className="w-full h-32 rounded-lg"
                />
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
