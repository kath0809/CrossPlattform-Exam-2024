// import React from "react";
// import { useAuth } from "@/providers/authContext";
// import { CommentObject, PostData } from "@/utils/postData";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { useEffect, useRef, useState } from "react";
// import * as commentApi from "@/api/commentApi";
// import * as postApi from "@/api/postApi";
// import * as Location from "expo-location";
// import {
//   View,
//   Pressable,
//   ActivityIndicator,
//   TextInput,
//   Text,
//   Image,
//   StyleSheet,
//   ScrollView,
//   Dimensions,
// } from "react-native";
// import MapView, { Marker } from "react-native-maps";

// const { width } = Dimensions.get("window");

// export default function PostDetails() {
//   const { id } = useLocalSearchParams();
//   const [loading, setLoading] = useState(false);
//   const [loadingAddComment, setLoadingAddComment] = useState(false);
//   const [post, setPost] = useState<PostData | null>(null);
//   const [postComments, setPostComments] = useState<CommentObject[]>([]);
//   const [postLocation, setPostLocation] = useState<string | null>(null);
//   const [newComment, setNewComment] = useState("");
//   const visibleCommentIds = useRef<string[]>([]);
//   const param = useLocalSearchParams();
//   const { user } = useAuth();
//   const router = useRouter();

//   const getComments = async (commentsIds: string[]) => {
//     const comments = await commentApi.getComment(commentsIds);
//     if (comments) {
//       setPostComments(comments);
//     }
//     setLoading(false);
//   };

//   const getPostFromFirebase = async () => {
//     const firebasePost = await postApi.getPostById(param.id as string);
//     if (firebasePost) {
//       setPost(firebasePost);
//       getComments(firebasePost.comments);
//       visibleCommentIds.current = firebasePost.comments;
//       const location = await Location.reverseGeocodeAsync({
//         latitude: firebasePost.postCoordinates?.latitude ?? 0,
//         longitude: firebasePost.postCoordinates?.longitude ?? 0,
//       });
//       const loc = location[0];
//       setPostLocation(loc ? `${loc.city}, ${loc.country}` : "Unknown Location");
//     }
//   };

//   useEffect(() => {
//     getPostFromFirebase();
//   }, []);
//   //<Image style={styles.imageStyle} source={{ uri: post?.imageURLs?.[0] }} />
//   return (
//     <ScrollView className="pb-4 bg-white">
//       {/* Image Carousel */}
//       <ScrollView
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         style={styles.carousel}
//       >
//         {post?.imageURLs.map((imageURLs, index) => (
//           <Image
//             key={index}
//             source={{ uri: imageURLs }}
//             style={styles.image}
//             resizeMode="contain"
//           />
//         ))}
//       </ScrollView>

//       <View className="p-4">
//         {/* Close Button */}
//         <Pressable
//           onPress={() => router.push("/(tabs)/gallery")}
//           className="mb-4"
//         >
//           <Text className="text-blue-500 font-bold">Go back</Text>
//         </Pressable>

//         <Text className="text-2xl font-bold mb-2">{post?.title}</Text>
//         <Text className="text-base text-gray-700 mb-2">
//           {post?.description}
//         </Text>
//         <Text className="text-sm text-gray-500 mb-4">
//           📍 {postLocation || "Location not available"}
//         </Text>
//         <Text className="text-sm text-red-500 mb-4">
//           ❤️ {post?.likes || 0} likes
//         </Text>

//         {/* Comments Section */}
//         <View className="mt-4">
//           <Text className="text-lg font-bold mb-2">Comments</Text>
//           {loading ? (
//             <ActivityIndicator />
//           ) : (
//             postComments.map((comment) => (
//               <View
//                 key={comment.id}
//                 className="flex-row justify-between items-center mb-2"
//               >
//                 <View className="flex-row gap-1">
//                   <Text className="text-gray-700 font-semibold">
//                     {comment.comment.authorName}:
//                   </Text>
//                   <Text className="text-gray-600">
//                     {comment.comment.comment}
//                   </Text>
//                 </View>
//                 {comment.comment.authorId === user?.uid && (
//                   <Pressable
//                     onPress={() => {
//                       commentApi.deleteComment(comment.id, post?.id ?? "");
//                       setPostComments(
//                         postComments.filter((c) => c.id !== comment.id)
//                       );
//                       visibleCommentIds.current =
//                         visibleCommentIds.current.filter(
//                           (id) => id !== comment.id
//                         );
//                     }}
//                   >
//                     <Text className="text-red-500">Delete</Text>
//                   </Pressable>
//                 )}
//               </View>
//             ))
//           )}

//           {/* Add Comment Section */}
//           <View className="flex-row items-center mt-2">
//             <TextInput
//               value={newComment}
//               onChangeText={setNewComment}
//               placeholder="Add a comment..."
//               className="flex-1 border border-gray-300 rounded-md px-2 py-1"
//             />
//             <Pressable
//               className="ml-2 bg-blue-500 rounded-md px-4 py-2"
//               onPress={async () => {
//                 if (post && newComment !== "") {
//                   setLoadingAddComment(true);
//                   const addedComment = await commentApi.addComment(post.id, {
//                     authorId: user?.uid ?? "",
//                     authorName: user?.username ?? "",
//                     comment: newComment,
//                     createdAt: new Date(),
//                   });
//                   if (addedComment) {
//                     visibleCommentIds.current.push(addedComment);
//                     await getComments(visibleCommentIds.current);
//                     setNewComment("");
//                     setLoadingAddComment(false);
//                   }
//                 }
//               }}
//             >
//               {loadingAddComment ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <Text className="text-white font-bold">Post</Text>
//               )}
//             </Pressable>
//           </View>
//         </View>

//         {/* Map View */}
//         {post && (
//           <View className="mt-8 rounded-lg overflow-hidden">
//             <MapView
//               initialRegion={{
//                 latitude: post?.postCoordinates?.latitude ?? 0,
//                 longitude: post?.postCoordinates?.longitude ?? 0,
//                 latitudeDelta: 0.0082,
//                 longitudeDelta: 0.0081,
//               }}
//               style={{ width: "100%", height: 200 }} // Explicit dimensions for MapView
//             >
//               <Marker
//                 coordinate={{
//                   latitude: post?.postCoordinates?.latitude ?? 0,
//                   longitude: post?.postCoordinates?.longitude ?? 0,
//                 }}
//                 title={post?.title}
//               />
//             </MapView>
//           </View>
//         )}
//       </View>
//     </ScrollView>
//   );
// }
// const styles = StyleSheet.create({
//   carousel: {
//     width: width,
//     height: width,
//   },
//   image: {
//     width: width,
//     height: width, // Assuming you want a square aspect ratio
//   },
// });

import React, { useEffect, useRef, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  View,
  Text,
  Dimensions,
} from "react-native";
import { CommentObject, PostData } from "@/utils/postData";
import * as postApi from "@/api/postApi";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/providers/authContext";
import MapView, { Marker } from "react-native-maps";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import LoadingComponent from "@/components/LoadingComponent";

type PostProps = {
  postData: PostData;
  toggleLike: (id: string) => void;
};

const { width } = Dimensions.get("window");

export default function PostDetail() {
  const { postId } = useLocalSearchParams();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [loadingAddComment] = useState(false);
  const [postComments, setPostComments] = useState<CommentObject[]>([]);
  const [newComment, setNewComment] = useState("");

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
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!isAuthenticated || user?.isAnonymous) {
      Alert.alert(
        "Access Denied",
        "You need to be signed in to view this post."
      );
      router.push("/signIn");
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
      await postApi.toggleLikePost(post.id, user?.uid ?? "");
    }
  };

  return (
    <View style={{ paddingTop: hp(8) }} className="flex-1 justify-center gap-6">
      <ScrollView
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{ flexGrow: 1 }}
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
          <Text className="text-2xl font-bold mb-2">{post?.title}</Text>
          <Text className="text-base text-gray-700 mb-2">
            {post?.description}
          </Text>
          <View className="mt-1">
            <Text className="text-lg font-bold mb-2">Comments</Text>
            {loading ? (
              <LoadingComponent size={30} />
            ) : (
              postComments.map((comment) => (
                <View
                  key={comment.id}
                  className="flex-row justify-between items-center mb-2"
                >
                  <View className="flex-row gap-1">
                    <Text className="text-gray-700 font-semibold">
                      {comment.comment.authorName}:
                    </Text>
                    <Text className="text-gray-600">
                      {comment.comment.comment}
                    </Text>
                  </View>
                  {comment.comment.authorId === user?.uid && (
                    <Pressable
                      onPress={() => {
                        setPostComments(
                          postComments.filter((c) => c.id !== comment.id)
                        );
                      }}
                    >
                      <Text className="text-red-500">Delete</Text>
                    </Pressable>
                  )}
                </View>
              ))
            )}

            
            <View className="flex-row items-center mt-2">
              <TextInput
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Add a comment..."
                className="flex-1 border border-gray-300 rounded-md px-2 py-1"
              />
              <Pressable className="ml-2 bg-custom-orange rounded-md px-4 py-2">
                {loadingAddComment ? (
                  <LoadingComponent size={wp(25)} />
                ) : (
                  <Text className="text-black font-bold">Post</Text>
                )}
              </Pressable>
            </View>
          </View>
          {/* Map View */}
          {post && (
            <Pressable onPress={() => router.push("/(tabs)/map")}
            className="mt-8 rounded-lg overflow-hidden">
              <MapView
                initialRegion={{
                  latitude: post?.postCoordinates?.latitude ?? 0,
                  longitude: post?.postCoordinates?.longitude ?? 0,
                  latitudeDelta: 0.0082,
                  longitudeDelta: 0.0081,
                }}
                style={{ width: "100%", height: 200 }}
              >
                <Marker
                  coordinate={{
                    latitude: post?.postCoordinates?.latitude ?? 0,
                    longitude: post?.postCoordinates?.longitude ?? 0,
                  }}
                  title={post?.title}
                />
              </MapView>
             </Pressable>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  carousel: {
    width: width,
    height: width * 0.6, // Reduce the height of the carousel
  },
  image: {
    width: width,
    height: width * 0.6, // Matches the reduced height of the carousel
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
