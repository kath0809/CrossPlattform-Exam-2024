import { PostData } from "@/utils/postData";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Alert,
  TextInput,
  Pressable,
  RefreshControl,
  useWindowDimensions,
} from "react-native";
import * as postApi from "@/api/postApi";
import { auth } from "@/firebaseConfig";
import { User } from "@firebase/auth";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/providers/authContext";

export default function Gallery() {
  const { width } = useWindowDimensions();
  // Adjust the carousel to the width of the screen. This is good for responsiveness. https://reactnative.dev/docs/usewindowdimensions
  const [posts, setPosts] = useState<PostData[]>([]);
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Control if the user is signed in with anonymous or not.
  // If the user is signed in with credentials, the user wil get to open the path to postDetails.
  // Promt an alert if the user is signed in as anonymous and deny access.
  const handleImageDetails = (post: PostData) => {
    if (user && !user.isAnonymous) {
      router.push({
        pathname: "/postDetails",
        params: {
          postId: post.id,
        },
      });
    } else {
      console.log("User is signed in as anonymous");
      Alert.alert("Access Denied", "You need to be signed in to view the post");
    }
  };

  // Get all posts from the backend and sort them by title.
  const getPostsFromBackend = async () => {
    setRefresh(true);
    const posts = await postApi.getAllPosts();
    // Sorter på tittel
    const sortedPosts = posts.sort((a, b) => a.title.localeCompare(b.title));
    setPosts(sortedPosts);
    setFilteredPosts(sortedPosts);
    /* Sorter på dato/tid */
    //const sortedPosts = posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    //setPosts(sortedPosts);
    setRefresh(false);
  };

  // When the page is loaded, get all posts from the api(postApi/getAllPosts) and set the state of posts.
  useEffect(() => {
    getPostsFromBackend();
  }, []);

  // Filter the posts by the search query.
  useEffect(() => {
    const filtered = posts.filter((post) =>
      post.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchQuery, posts]);

  const renderItem = ({ item }: { item: PostData }) => (
    <View className="flex-1 p-1">
      <View className="bg-slate-100 rounded-lg p-4 mb-4 border border-gray-200">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-bold">{item.title}</Text>
        </View>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          className="h-50"
        >
          {/* All images uploaded to firebase for the purpose of not delivering an empty app are downloaded
          from https://www.freepik.com in the period of 01.11 - 12.11 2024 */}
          {item.imageURLs.map((image) => (
            <Pressable key={image} onPress={() => handleImageDetails(item)}>
              <Image
                key={image}
                source={{ uri: image }}
                style={{
                  width: 300,
                  height: 200,
                  borderRadius: 10,
                  marginRight: 10,
                }}
              />
            </Pressable>
          ))}
        </ScrollView>
        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-sm text-gray-500">by {item.author}</Text>
          <Text className="text-sm text-gray-500 font-bold">
            {item.category}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={getPostsFromBackend} />
      }
    >
      <View className="p-4">
        <View className="flex-row items-center">
          <TextInput
            placeholder="Search after artist..."
            placeholderTextColor={"gray"}
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 p-2 border rounded-xl pr-10"
            accessibilityLabel="Search"
            accessibilityHint="Search for a category"
          />
          <Pressable className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2">
            <Ionicons name="search" size={24} color={"#f5a442"} />
          </Pressable>
        </View>
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={true}
        style={{ height: width * 2 }}
        accessibilityLabel="Posts carousel"
        accessibilityHint="Swipe left or right to view posts"
      >
        {filteredPosts.map((post) => (
          <View key={post.id}>{renderItem({ item: post })}</View>
        ))}
      </ScrollView>
    </ScrollView>
  );
}
