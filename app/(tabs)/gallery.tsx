import { PostData } from "@/utils/postData";
import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import * as postApi from "@/api/postApi";
import { auth } from "@/firebaseConfig";
import { User } from "@firebase/auth";
import { router } from "expo-router";


export default function Gallery() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleImageDetails = (post: PostData) => {
    if (user && !user.isAnonymous) {
      console.log(`User ${user.displayName} clicked on image ${post.title}`);
      router.push({
        pathname: "/postDetails",
        params: {
          postId: post.id
        },
      });
    } else {
      console.log("User is not signed in or is an anonymous user");
      Alert.alert("You need to be signed in to view image details");
    }
  };

  const getPostsFromBackend = async () => {
    const posts = await postApi.getAllPosts();
    // Sorter på tittel
    const sortedPosts = posts.sort((a, b) => a.title.localeCompare(b.title));
    setPosts(sortedPosts);
    /* Sorter på dato/tid */
    //const sortedPosts = posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    //setPosts(sortedPosts);
  };

  useEffect(() => {
    getPostsFromBackend();
  }, []);

  const renderItem = ({ item }: { item: PostData }) => (
      <View style={styles.postContainer}>
        <Text className="pb-1" style={styles.author}>
          by {item.author}
        </Text>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.carousel}
        >
          {item.imageURLs.map((image) => (
            <TouchableOpacity key={image} onPress={() => handleImageDetails(item)}>
            <Image key={image} source={{ uri: image }} style={styles.image} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.title}>{item.title}</Text>
      </View>
  );

  return (
    <ScrollView>
      {posts.map((post) => (
        <View key={post.id}>{renderItem({ item: post })}</View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  postContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  image: {
    width: 300, // Width of each image in the carousel
    height: 200,
    borderRadius: 10,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  author: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    marginTop: 8,
  },
  carousel: {
    height: 200,
  },
});