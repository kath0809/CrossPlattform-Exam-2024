import { PostData } from "@/utils/postData";
import React, { useEffect, useRef, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  Pressable,
  TextInput,
  Text,
  View,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { EvilIcons, MaterialIcons, Octicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as postApi from "@/api/postApi";
import { useAuth } from "@/providers/authContext";
import LoadingComponent from "@/components/LoadingComponent";
import { router } from "expo-router";
import SelectImageModal from "@/components/ImageComponent";

type PostFormProps = {
  closeModal: () => void;
};

export default function PostForm({ closeModal }: PostFormProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [titleText, setTitleText] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [categoryText, setcategoryText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const [statusText, setStatusText] = useState<string | null>(null);
  const [location, setLocation] =
    useState<Location.LocationGeocodedAddress | null>(null);

  const postCoordinatesData = useRef<Location.LocationObjectCoords | null>(
    null
  );

  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setStatusText("Permission to access location was denied");
        return;
      }
    })();
  }, []);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setStatusText("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync();
    postCoordinatesData.current = location.coords;
    const locationAddress = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    setLocation(locationAddress[0]);
  };

  let text = "";
  if (statusText) {
    text = statusText;
  } else if (location) {
    text = JSON.stringify(location);
  }


  return (
    <View
      style={{ paddingTop: hp(3), paddingHorizontal: wp(2) }}
      className="flex-1 justify-center bg-[#181717e5]"
    >
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
        <View className="w-full flex flex-col px-3 gap-6 ">
          <Modal visible={isCameraOpen} animationType="slide">
            <SelectImageModal
              closeModal={() => {
                setIsCameraOpen(false);
                getLocation();
              }}
              setImage={setImage}
            />
          </Modal>
          <Pressable
            onPress={() => setIsCameraOpen(true)}
            className="rounded-3xl overflow-hidden w-full h-80 justify-center items-center border-custom-orange border-2"
          >
            {image ? (
              <Image
                source={{ uri: image }}
                style={{ resizeMode: "cover", width: "100%", height: 300 }}
              />
            ) : (
              <EvilIcons name="image" size={80} color="gray" />
            )}
          </Pressable>
          <Text className=" text-neutral-100">
            Location:{" "}
            {location
              ? `${location?.street} ${location?.streetNumber} - ${location?.city}, ${location?.country}`
              : "No location available"}
          </Text>

          <View className="gap-4">
            <View
              style={{ height: hp(7) }}
              className="flex-row gap-4 px-4 bg-black/40 items-center rounded-xl"
            >
              <MaterialIcons name="title" size={hp(3)} color="#f5a442" />
              <TextInput
                onChangeText={setTitleText}
                value={titleText}
                placeholder="Title..."
                placeholderTextColor={"gray"}
                accessible={true}
                accessibilityLabel="Enter title"
                accessibilityHint="Write a title for post"
                style={{ color: "white", fontSize: hp(2) }}
              />
            </View>
            <View
              style={{ height: hp(7) }}
              className="flex-row gap-4 px-4 bg-black/40 items-center rounded-xl"
            >
              <Octicons name="pencil" size={hp(3)} color="#f5a442" />
              <TextInput
                onChangeText={setDescriptionText}
                value={descriptionText}
                placeholder="Write a description..."
                placeholderTextColor={"gray"}
                accessible={true}
                accessibilityLabel="Enter description"
                accessibilityHint="Write an description for post"
                multiline={true}
                numberOfLines={5}
                style={{ color: "white", fontSize: hp(2) }}
              />
            </View>
            <View
              style={{ height: hp(7) }}
              className="flex-row gap-4 px-4 bg-black/40 items-center rounded-xl"
            >
              <MaterialIcons name="category" size={hp(3)} color="#f5a442" />
              <TextInput
                onChangeText={setcategoryText}
                value={categoryText}
                placeholder="Category..."
                placeholderTextColor={"gray"}
                accessible={true}
                accessibilityLabel="Enter description"
                accessibilityHint="Write a description for post"
                style={{ color: "white", fontSize: hp(2) }}
              />
            </View>
            <View>
              {loading ? (
                <View className="flex-row justify-center">
                  <LoadingComponent size={wp(25)} />
                </View>
              ) : (
                <TouchableOpacity
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Upload post to gallery"
                  accessibilityHint="Press to add new post"
                  onPress={async () => {
                    const newPost: PostData = {
                      title: titleText,
                      description: descriptionText,
                      category: categoryText,
                      id: `postName-${titleText}`,
                      author: user?.username || "Aononymous",
                      isLiked: false,
                      imageURL: image || "",
                      postCoordinates: postCoordinatesData.current,
                      comments: [],
                      likes: [],
                      createdAt: new Date(),
                    };

                    await postApi.createPost(newPost);
                    setImage(null);
                    setLocation(null);
                    setTitleText("");
                    setDescriptionText("");
                    setcategoryText("");
                    router.push("/(tabs)/gallery");
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
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
