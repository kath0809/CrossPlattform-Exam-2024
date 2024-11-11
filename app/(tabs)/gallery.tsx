import { PostData } from "@/utils/postData";
import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, ScrollView } from "react-native";
import * as postApi from "@/api/postApi";

export default function Gallery() {
  const [posts, setPosts] = useState<PostData[]>([]);

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
          <Image key={image} source={{ uri: image }} style={styles.image} />
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