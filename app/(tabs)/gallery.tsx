import { PostData } from "@/utils/postData";
import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import * as postApi from "@/api/postApi";

export default function Gallery() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpsertUserModalOpen, setIsUpsertUserModalOpen] = useState(false);

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
      <Text className="pb-1" style={styles.author}>by {item.author}</Text>
      <Image source={{ uri: item.imageURL }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
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
    width: "100%",
    height: 200,
    borderRadius: 8,
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
});