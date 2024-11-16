import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  Image,
  Alert,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  View,
  Text,
  Dimensions,
  StatusBar,
} from "react-native";
import { CommentObject, PostData } from "@/utils/postData";
import * as postApi from "@/api/postApi";
import * as commentApi from "@/api/commentApi";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/providers/authContext";
import { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import LoadingComponent from "@/components/LoadingComponent";
import MapComponent from "@/components/MapComponent";

const { width } = Dimensions.get("window");

export default function PostDetail() {
  const { postId, id } = useLocalSearchParams();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [loadingAddComment] = useState(false);
  const [postComments, setPostComments] = useState<CommentObject[]>([]);
  const [commentText, setCommentText] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [numLikes, setNumLikes] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (postId) {
          const fetchedPost = await postApi.getPostById(
            Array.isArray(postId) ? postId[0] : postId
          );
          setPost(fetchedPost);
          const comments = await commentApi.getCommentsByIds(
            fetchedPost.comments
          );
          if (comments) {
            setPostComments(comments);
          }
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    // If user is anonymous, return error message. Should have added a function to let the user register or sign in an save the pro
    // But i found that to be too difficult.
    if (!isAuthenticated || user?.isAnonymous) {
      Alert.alert(
        "Access Denied",
        "You need to be signed in to view this post."
      );
    } else {
      fetchPost();
    }
  }, [postId, isAuthenticated, user]);

  useEffect(() => {
    if (post) {
      setIsLiked(post.likes?.includes(user?.uid ?? "") ?? false);
      setNumLikes(post.likes?.length ?? 0);
    }
  }, [post, user]);

  const handleLikePress = async () => {
    if (post) {
      if (isLiked) {
        setNumLikes(numLikes - 1);
        setIsLiked(false);
      } else {
        setNumLikes(numLikes + 1);
        setIsLiked(true);
      }
      await postApi.toggleLike(post.id, user?.uid ?? "");
    }
  };

  const handleNewComment = async () => {
    if (!commentText.trim()) return;

    setLoading(true);
    try {
      const commentData = {
        authorId: user?.uid ?? "",
        authorName: user?.username ?? "",
        comment: commentText.trim(),
      };
      const commentId = await commentApi.addComment(
        post?.id ?? "",
        commentData
      );
      setPostComments([
        ...postComments,
        { id: commentId ?? "", comment: commentData },
      ]);
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment", console.error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorProfile = () => {
    router.push({
      pathname: "/userProfile",
      params: {
        userId: post?.authorId,
      },
    });
  };

  const handleDeleteComment = async (commentId: string) => {
    Alert.alert(
      "Delete comment",
      "Are you sure you want to delete this comment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            await commentApi.deleteComment(commentId, post?.id ?? "");
            setPostComments(postComments.filter((c) => c.id !== commentId));
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View className="flex-1">
      <StatusBar barStyle="dark-content" />
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

      <ScrollView
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View
          style={{ paddingTop: hp(8) }}
          className="flex-1 justify-center gap-6"
        >
          <View style={{ position: "relative" }}>
            <Pressable
              onPress={() => router.push("/(tabs)/gallery")}
              style={{ left: 16, zIndex: 10, paddingBottom: 8 }}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </Pressable>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.carousel}
            >
              {post?.imageURLs.map((imageURL, index) => (
                <Image
                  key={index}
                  source={{ uri: imageURL }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
            <View className="flex-row items-center px-2">
              <View className="flex-1 flex-row justify-center">
                {/* The "dots" under the carousel, shos one dot for 1image, two dots for 2 images... */}
                {post?.imageURLs && post.imageURLs.length > 1 && (
                  <View className="flex-row justify-center py-2">
                    {post.imageURLs.map((_, index) => (
                      <View
                        key={index}
                        className="w-2 h-2 rounded-full bg-gray-400 mx-1"
                      />
                    ))}
                  </View>
                )}
              </View>
              {/* If user hasnt liked the post, its an outline icon, if its liked by the user - its a filled orange heart */}
              <View className="flex-row items-center justify-end">
                <Pressable
                  onPress={handleLikePress}
                  className="flex-row items-center"
                >
                  {isLiked ? (
                    <Ionicons
                      name="heart"
                      size={30}
                      color={isLiked ? "#f5a442" : "black"}
                    />
                  ) : (
                    <Ionicons
                      name="heart-outline"
                      size={30}
                      color={isLiked ? "#f5a442" : "black"}
                    />
                  )}
                  <Text className="text-lg text-gray-600 px-1">{numLikes}</Text>
                </Pressable>
              </View>
            </View>
          </View>
          <View className="px-4">
            <Pressable
              onPress={() =>
                router.push(`/userProfile?authorId=${post?.authorId}`)
              }
            >
              <Text
                className="text-sky-800 font-bold pb-2"
                style={{ fontSize: 18 }}
              >
                {post?.author}
              </Text>
            </Pressable>
            <Text className="text-2xl font-bold mb-2">{post?.title}</Text>
            <Text className="text-base text-gray-700 mb-2">
              {post?.description}
            </Text>
            <Text className="text-lg font-bold mb-2">Comments</Text>
            <View className="flex-row items-center mt-3 p-2 rounded-md bg-gray-50 shadow-inner">
              <TextInput
                value={commentText}
                onChangeText={setCommentText}
                placeholder="Add a comment..."
                className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm"
              />
              <Pressable
                onPress={handleNewComment}
                className="ml-2 bg-custom-orange rounded-md px-4 py-2"
              >
                {loadingAddComment ? (
                  <LoadingComponent size={30} />
                ) : (
                  <Text className="text-black font-bold">Post</Text>
                )}
              </Pressable>
            </View>
            {loading ? (
              <LoadingComponent size={30} />
            ) : (
              postComments.map((comment) => (
                <View
                  key={comment.id}
                  className="flex-row justify-between items-center mb-2 p-3 rounded-lg bg-gray-100 shadow-sm"
                >
                  <View className="flex-row flex-wrap">
                    <Text className="text-gray-700 font-semibold mr-1">
                      {comment.comment.authorName} :
                    </Text>
                    <Text className="text-gray-600">
                      {comment.comment.comment}
                    </Text>
                  </View>
                  {comment.comment.authorId === user?.uid && (
                    <Pressable
                      onPress={() => handleDeleteComment(comment.id)}
                      className="ml-2"
                    >
                      <Ionicons name="trash-outline" color={"red"} size={20} />
                    </Pressable>
                  )}
                </View>
              ))
            )}
            {post && (
              <View style={{ width: "100%", height: 200, paddingBottom: 45}}>
                <MapComponent
                  initialRegion={{
                    latitude: post?.postCoordinates?.latitude ?? 0,
                    longitude: post?.postCoordinates?.longitude ?? 0,
                    latitudeDelta: 0.0082,
                    longitudeDelta: 0.0081,
                  }}
                  
                >
                  <Marker
                    coordinate={{
                      latitude: post?.postCoordinates?.latitude ?? 0,
                      longitude: post?.postCoordinates?.longitude ?? 0,
                    }}
                    title={post?.title}
                    onPress={() => router.push("/(tabs)/map")}
                  />
                </MapComponent>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  carousel: {
    width: width,
    height: width * 0.6,
  },
  image: {
    width: width,
    height: width * 0.6,
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#bbb",
    marginHorizontal: 4,
  },
});
