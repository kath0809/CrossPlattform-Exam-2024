import { PostData } from "@/utils/postData";
import React, { useEffect, useRef, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  Pressable,
  StyleSheet,
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
import * as postApi from "@/api/newPostApi";
import { useAuth } from "@/providers/authContext";
import LoadingComponent from "@/components/LoadingComponent";
import { router } from "expo-router";
import SelectImageModal from "@/components/ImageModal";

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
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Select image to upload"
            accessibilityHint="Pick an image from gallery or take a picture"
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
                accessibilityLabel="Enter title"
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
                accessibilityLabel="Enter description"
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
                accessibilityLabel="Enter category"
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
                    };

                    await postApi.createPost(newPost);
                    setImage(null);
                    setLocation(null);
                    setTitleText("");
                    setDescriptionText("");
                    setcategoryText("");
                    router.push("/(tabs)/gallery");
                  }}
                  style={{ height: hp(6.5) }}
                  className="bg-custom-orange rounded-xl justify-center items-center"
                >
                  <Text
                    style={{ fontSize: hp(2.7) }}
                    className="text-neutral-800 font-bold tracking-widest"
                  >
                    Add new post
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <Pressable
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Cancel post creation and go to gallery"
            className="flex-row justify-center py-4 bg-custom-orange rounded-xl"
            onPress={() => router.push("/(tabs)/gallery")}
          >
            <Text
              style={{
                color: "#412E25",
              }}
            >
              Avbryt
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

/* NEW */
// import React, { useState, useEffect, useRef } from "react";
// import { PostData } from "@/utils/postData";
// import { useImagePicker } from "@/components/ImageModal";
// import { useAuth } from "@/providers/authContext";
// import * as Location from "expo-location";
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from "react-native-responsive-screen";
// import * as postApi from "@/api/newPostApi";
// import {
//   Text,
//   TouchableOpacity,
//   View,
//   ScrollView,
//   TextInput,
//   Image,
//   Pressable,
// } from "react-native";
// import { EvilIcons, MaterialIcons, Octicons } from "@expo/vector-icons";
// import LoadingComponent from "@/components/LoadingComponent";

// export default function PostForm() {
//   const [loading, setLoading] = useState<boolean>(false);
//   const [titleText, setTitleText] = useState("");
//   const [descriptionText, setDescriptionText] = useState("");
//   const [categoryText, setcategoryText] = useState("");
//   const [image, setImage] = useState<string | null>(null);
//   const [statusText, setStatusText] = useState<string | null>(null);
//   const [location, setLocation] =
//     useState<Location.LocationGeocodedAddress | null>(null);
//   const [showMenu, setShowMenu] = useState(false); // State to control the visibility of the menu
//   const postCoordinatesData = useRef<Location.LocationObjectCoords | null>(
//     null
//   );

//   const { user } = useAuth();
//   const { checkPermissions, captureImage, pickImage, setCameraRef } =
//     useImagePicker();

//   useEffect(() => {
//     (async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         setStatusText("Permission to access location was denied");
//         return;
//       }
//     })();
//   }, []);

//   const getLocation = async () => {
//     const { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== "granted") {
//       setStatusText("Permission to access location was denied");
//       return;
//     }

//     const currentLocation = await Location.getCurrentPositionAsync();
//     postCoordinatesData.current = currentLocation.coords;
//     const locationAddress = await Location.reverseGeocodeAsync({
//       latitude: currentLocation.coords.latitude,
//       longitude: currentLocation.coords.longitude,
//     });
//     setLocation(locationAddress[0]);
//   };

//   const handleOpenCamera = async () => {
//     const hasPermission = await checkPermissions();
//     if (hasPermission) {
//       await captureImage(setImage);
//       getLocation();
//     }
//   };

//   const handlePickImage = async () => {
//     await pickImage(setImage);
//     getLocation();
//   };

//   return (
//     <View
//       style={{ paddingTop: hp(3), paddingHorizontal: wp(2) }}
//       className="flex-1 justify-center bg-[#181717e5]"
//     >
//       <ScrollView
//         keyboardDismissMode="interactive"
//         automaticallyAdjustKeyboardInsets
//       >
//         <View className="w-full flex flex-col px-3 gap-6 ">
//           <Pressable
//             onPress={() => setShowMenu(!showMenu)} // Toggle menu visibility on press
//             className="rounded-3xl overflow-hidden w-full h-80 justify-center items-center border-custom-orange border-2"
//           >
//             {image ? (
//               <Image
//                 source={{ uri: image }}
//                 style={{ resizeMode: "cover", width: "100%", height: 300 }}
//               />
//             ) : (
//               <EvilIcons name="image" size={80} color="gray" />
//             )}
//           </Pressable>

//           {showMenu && (
//             <View
//               style={{
//                 position: "absolute",
//                 top: "50%", // Adjust position based on your layout
//                 left: "10%", // Adjust position based on your layout
//                 backgroundColor: "#333",
//                 padding: 10,
//                 borderRadius: 8,
//                 zIndex: 1,
//               }}
//             >
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowMenu(false);
//                   handleOpenCamera();
//                 }}
//                 style={{ padding: 10 }}
//               >
//                 <Text style={{ color: "white" }}>Take Picture</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowMenu(false);
//                   handlePickImage();
//                 }}
//                 style={{ padding: 10 }}
//               >
//                 <Text style={{ color: "white" }}>Select from Gallery</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => setShowMenu(false)}
//                 style={{ padding: 10 }}
//               >
//                 <Text style={{ color: "white" }}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           )}

//           <Text className="pt-2 text-neutral-100">
//             Location:{" "}
//             {location
//               ? `${location?.street} ${location?.streetNumber} - ${location?.city}, ${location?.country}`
//               : "No location available"}
//           </Text>

//           <View className="gap-4">
//             <View
//               style={{ height: hp(7) }}
//               className="flex-row gap-4 px-4 bg-black/40 items-center rounded-xl"
//             >
//               <MaterialIcons name="title" size={hp(3)} color="#f5a442" />
//               <TextInput
//                 onChangeText={setTitleText}
//                 value={titleText}
//                 placeholder="Title..."
//                 placeholderTextColor={"gray"}
//                 accessibilityLabel="Enter title"
//                 style={{ color: "white" }}
//               />
//             </View>
//             <View
//               style={{ height: hp(7) }}
//               className="flex-row gap-4 px-4 bg-black/40 items-center rounded-xl"
//             >
//               <Octicons name="pencil" size={hp(3)} color="#f5a442" />
//               <TextInput
//                 onChangeText={setDescriptionText}
//                 value={descriptionText}
//                 placeholder="Write a description..."
//                 placeholderTextColor={"gray"}
//                 accessibilityLabel="Enter description"
//                 style={{ color: "white" }}
//               />
//             </View>
//             <View
//               style={{ height: hp(7) }}
//               className="flex-row gap-4 px-4 bg-black/40 items-center rounded-xl"
//             >
//               <MaterialIcons name="category" size={hp(3)} color="#f5a442" />
//               <TextInput
//                 onChangeText={setcategoryText}
//                 value={categoryText}
//                 placeholder="Category..."
//                 placeholderTextColor={"gray"}
//                 accessibilityLabel="Enter category"
//                 style={{ color: "white" }}
//               />
//             </View>
//             <View>
//               {loading ? (
//                 <View className="flex-row justify-center">
//                   <LoadingComponent size={wp(25)} />
//                 </View>
//               ) : (
//                 <TouchableOpacity
//                   onPress={async () => {
//                     const newPost: PostData = {
//                       title: titleText,
//                       description: descriptionText,
//                       category: categoryText,
//                       id: `postName-${titleText}`,
//                       author: user?.username || "Anonymous",
//                       isLiked: false,
//                       imageURL: image || "",
//                       postCoordinates: postCoordinatesData.current,
//                       comments: [],
//                       likes: [],
//                     };

//                     await postApi.createPost(newPost);

//                     setTitleText("");
//                     setDescriptionText("");
//                     setcategoryText("");
//                   }}
//                   style={{ height: hp(6.5) }}
//                   className="bg-custom-orange rounded-xl justify-center items-center"
//                 >
//                   <Text
//                     style={{ fontSize: hp(2.7) }}
//                     className="text-neutral-800 font-bold tracking-widest"
//                   >
//                     Add new post
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }
