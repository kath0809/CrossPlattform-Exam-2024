import { PostData } from "@/utils/postData";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  Pressable,
  Text,
  View,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { EvilIcons, MaterialIcons, Octicons } from "@expo/vector-icons";
import * as postApi from "@/api/postApi";
import { useAuth } from "@/providers/authContext";
import LoadingComponent from "@/components/LoadingComponent";
import { router } from "expo-router";
import SelectImageModal from "@/components/ImageComponent";
import { uploadImagesToFirebase } from "@/api/imageApi";
import InputComponent from "@/components/InputComponent";
import useLocation from "@/components/LocationComponent";


export default function PostForm() {
  // I've got error trying to upload mutiple images the soulution was to set the image's local and the dowloaded url to a state that i can set it to null after the post is created.
  const [localImages, setLocalImages] = useState<string[]>([]);
  const [downloadURLs, setDownloadURLs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [titleText, setTitleText] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [categoryText, setcategoryText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const { coordinates, locationAddress, getLocation } = useLocation();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View
      style={{ paddingTop: hp(3), paddingHorizontal: wp(2) }}
      className="flex-1 justify-center bg-[#181717e5]"
    >
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
      <View className="flex-row justify-end pb-2">
        <EvilIcons
          name="close"
          size={40}
          color="orange"
          onPress={() => router.push("/(tabs)/gallery")}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Close screen"
          accessibilityHint="Close create new post screen"
        />
      </View>
      <ScrollView
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
      >
        <View className="w-full flex flex-col px-3 gap-4 ">
          <Modal visible={isCameraOpen} animationType="slide">
            <SelectImageModal
              closeModal={() => {
                setIsCameraOpen(false);
                getLocation();
              }}
              setImages={setImages}
            />
          </Modal>
          <Pressable
            onPress={() => setIsCameraOpen(true)}
            className="rounded-3xl overflow-hidden w-full h-80 justify-center items-center border-custom-orange border-2"
          >
            {images.length > 0 ? (
              images.map((imageUri, index) => (
                <Image
                  key={index}
                  source={{ uri: imageUri }}
                  style={{ resizeMode: "cover", width: "100%", height: 300 }}
                />
              ))
            ) : (
              <EvilIcons name="image" size={80} color="gray" />
            )}
          </Pressable>
          <Text className="text-neutral-100">
            Location:{" "}
            {locationAddress
              ? `${locationAddress?.city}, ${locationAddress?.country}`
              : "No location available"}
          </Text>

          <View className="gap-3">
            <InputComponent
              value={titleText}
              placeholder="Title..."
              onChangeText={setTitleText}
              icon={<MaterialIcons name="title" size={24} color="#f5a442" />}
            />
            <InputComponent
              value={descriptionText}
              placeholder="Write a description..."
              onChangeText={setDescriptionText}
              icon={<Octicons name="pencil" size={24} color="#f5a442" />}
              multiline={true}
              numberOfLines={5}
            />
            <InputComponent
              value={categoryText}
              placeholder="Category..."
              onChangeText={setcategoryText}
              icon={<MaterialIcons name="category" size={24} color="#f5a442" />}
            />

            <View className="mt-3">
              <TouchableOpacity
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Upload post to gallery"
                accessibilityHint="Press to add new post"
                onPress={async () => {
                  if (images.length > 0) {
                    try {
                      setLoading(true);
                      setError(null);

                      const uploadedImagePaths = await uploadImagesToFirebase(
                        images
                      );

                      if (uploadedImagePaths.length === 0) {
                        throw new Error("There was an error uploading images");
                      }
                      const newPost: PostData = {
                        postCoordinates: coordinates,
                        title: titleText,
                        description: descriptionText,
                        category: categoryText,
                        id: `postName-${titleText}`,
                        author: user?.username || "Aononymous",
                        authorId: user?.uid || "Anonymous",
                        isLiked: false,
                        imageURLs: uploadedImagePaths || [],
                        comments: [],
                        likes: [],
                        createdAt: new Date(),
                      };

                      await postApi.createPost(newPost);
                      setLocalImages([]); // Reset the local images state
                      setDownloadURLs([]); // Reset download URLs if stored separately
                      setImages([]);
                      getLocation();
                      setTitleText("");
                      setDescriptionText("");
                      setcategoryText("");
                      router.push("/(tabs)/gallery");
                    } catch (error) {
                      console.error("Error creating post", error);

                      const errorMessage =
                        error instanceof Error
                          ? error.message
                          : "Failed to create post";
                      Alert.alert("Error", errorMessage, [
                        {
                          text: "OK",
                          onPress: () =>
                            console.log("Error action, ok pressed"),
                        },
                      ]);
                    } finally {
                      setLoading(false);
                    }
                  } else {
                    Alert.alert(
                      "No Images Selected",
                      "Please select at least one image to create new post.",
                      [
                        {
                          text: "OK",
                          onPress: () => console.log("OK Pressed"),
                        },
                      ]
                    );
                  }
                }}
                style={{ height: hp(4.5), width: wp(40) }}
                className="bg-custom-orange rounded-xl justify-center items-center mx-auto"
              >
                <Text
                  style={{ fontSize: hp(2.5) }}
                  className="text-neutral-800 font-bold tracking-wider"
                >
                  Add new post
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
