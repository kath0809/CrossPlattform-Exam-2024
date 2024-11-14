// import React, { useEffect, useRef, useState } from "react";
// import { View, Text, StyleSheet, Pressable } from "react-native";
// import MapView, { Marker } from "react-native-maps";
// import * as Location from "expo-location";
// import { MaterialIcons } from "@expo/vector-icons";
// import { PostData } from "@/utils/postData";
// import * as posApi from "@/api/postApi";
// import MapComponent from "@/components/MapComponent";

// export default function Map() {
//   const mapRef = useRef<MapView>(null);
//   const [userLocation, setUserLocation] = useState<{
//     latitude: number;
//     longitude: number;
//   } | null>(null);
//   const [zoomLevel, setZoomLevel] = useState(0.1);
//   const [isZoomedIn, setIsZoomedIn] = useState(false);
//   const [posts, setPosts] = useState<PostData[]>([]);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       const allPosts = await posApi.getAllPosts();
//       setPosts(allPosts);
//     };
//     fetchPosts();
//   }, []);

//   const toggleLocation = async () => {
//     if (isZoomedIn) {
//       mapRef.current?.animateToRegion(
//         {
//           latitude: userLocation?.latitude || 0,
//           longitude: userLocation?.longitude || 0,
//           latitudeDelta: 0.1,
//           longitudeDelta: 0.1,
//         },
//         1000
//       );
//       setIsZoomedIn(false);
//     } else {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         console.log("Permission to access location was denied");
//         return;
//       }
//       const { coords } = await Location.getCurrentPositionAsync({});
//       const { latitude, longitude } = coords;

//       mapRef.current?.animateToRegion(
//         {
//           latitude,
//           longitude,
//           latitudeDelta: 0.005,
//           longitudeDelta: 0.005,
//         },
//         1000
//       );
//       setUserLocation({ latitude, longitude });
//       setIsZoomedIn(true);
//     }
//   };

//   const zoomIn = () => {
//     const newZoomLevel = Math.max(zoomLevel / 2, 0.005);
//     setZoomLevel(newZoomLevel);
//     mapRef.current?.animateToRegion(
//       {
//         latitude: userLocation?.latitude || 23.142545,
//         longitude: userLocation?.longitude || -82.357438,
//         latitudeDelta: newZoomLevel,
//         longitudeDelta: newZoomLevel,
//       },
//       500
//     );
//   };

//   const zoomOut = () => {
//     const newZoomLevel = Math.min(zoomLevel * 2, 50);
//     setZoomLevel(newZoomLevel);
//     mapRef.current?.animateToRegion(
//       {
//         latitude: userLocation?.latitude || 23.142545,
//         longitude: userLocation?.longitude || -82.357438,
//         latitudeDelta: newZoomLevel,
//         longitudeDelta: newZoomLevel,
//       },
//       500
//     );
//   };

//   return (
//     <View className="flex-1">
//       <MapView
//         ref={mapRef}
//         style={styles.map}
//         initialRegion={{
//           latitude: 23.142545,
//           longitude: -82.357438,
//           latitudeDelta: 0.1,
//           longitudeDelta: 0.1,
//         }}
//       >
//         {userLocation && (
//           <Marker coordinate={userLocation} title="My Location" />
//         )}

//         {posts.map((post) =>
//           post.postCoordinates ? (
//             <Marker
//               key={post.id}
//               coordinate={{
//                 latitude: post.postCoordinates.latitude,
//                 longitude: post.postCoordinates.longitude,
//               }}
//               title={post.title}
//               //onPress={() => router.push(`/postDetails?id=${post.id}`)}
//             />
//           ) : null
//         )}
//       </MapView>
//       <View className="absolute top-5 right-3 space-y-2 items-end">
//         <Pressable
//           onPress={toggleLocation}
//           className="bg-white p-2 rounded items-center justify-center h-20"
//           accessibilityRole="button"
//           accessibilityActions={[{ name: "toggleLocation" }]}
//           accessibilityLabel="Toggle Location"
//           accessibilityHint="Press to toggle location"
//         >
//           <MaterialIcons name="my-location" size={24} color="black" />
//           <Text className="font-bold text-black">
//             {isZoomedIn ? "Zoom Out" : "My Location"}
//           </Text>
//         </Pressable>
//         <View className="flex-col mt-3">
//           <Pressable
//             onPress={zoomIn}
//             className="bg-white p-2 rounded items-center justify-center w-10 h-10"
//             accessibilityRole="button"
//             accessibilityActions={[{ name: "zoomIn" }]}
//             accessibilityLabel="Zoom In"
//             accessibilityHint="Press to zoom in"
//           >
//             <Text className="text-lg font-bold text-black">+</Text>
//           </Pressable>
//           <Pressable
//             onPress={zoomOut}
//             className="bg-white p-2 rounded items-center justify-center w-10 h-10 mt-2"
//             accessibilityRole="button"
//             accessibilityActions={[{ name: "zoomOut" }]}
//             accessibilityLabel="Zoom Out"
//             accessibilityHint="Press to zoom out"
//           >
//             <Text className="text-lg font-bold text-black">-</Text>
//           </Pressable>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
// });

import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import { PostData } from "@/utils/postData";
import * as posApi from "@/api/postApi";
import MapComponent from "@/components/MapComponent";

export default function Map() {
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(0.1);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [posts, setPosts] = useState<PostData[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const allPosts = await posApi.getAllPosts();
      setPosts(allPosts);
    };
    fetchPosts();
  }, []);

  const toggleLocation = async () => {
    if (isZoomedIn) {
      mapRef.current?.animateToRegion(
        {
          latitude: userLocation?.latitude || 0,
          longitude: userLocation?.longitude || 0,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        },
        1000
      );
      setIsZoomedIn(false);
    } else {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission denied");
        return;
      }
      const { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;

      mapRef.current?.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000
      );
      setUserLocation({ latitude, longitude });
      setIsZoomedIn(true);
    }
  };

  const zoomIn = () => {
    const newZoomLevel = Math.max(zoomLevel / 2, 0.005);
    setZoomLevel(newZoomLevel);
    mapRef.current?.animateToRegion(
      {
        latitude: userLocation?.latitude || 23.142545,
        longitude: userLocation?.longitude || -82.357438,
        latitudeDelta: newZoomLevel,
        longitudeDelta: newZoomLevel,
      },
      500
    );
  };

  const zoomOut = () => {
    const newZoomLevel = Math.min(zoomLevel * 2, 50);
    setZoomLevel(newZoomLevel);
    mapRef.current?.animateToRegion(
      {
        latitude: userLocation?.latitude || 23.142545,
        longitude: userLocation?.longitude || -82.357438,
        latitudeDelta: newZoomLevel,
        longitudeDelta: newZoomLevel,
      },
      500
    );
  };

  return (
    <View className="flex-1">
      <MapComponent
        ref={mapRef}
        initialRegion={{
          latitude: 23.142545,
          longitude: -82.357438,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {userLocation && (
          <Marker coordinate={userLocation} title="My Location" />
        )}

        {posts.map((post) =>
          post.postCoordinates ? (
            <Marker
              key={post.id}
              coordinate={{
                latitude: post.postCoordinates.latitude,
                longitude: post.postCoordinates.longitude,
              }}
              title={post.title}
            />
          ) : null
        )}
      </MapComponent>

      {Platform.OS === "ios" && (
        <View className="absolute top-5 right-3 space-y-2 items-end">
          <Pressable
            onPress={toggleLocation}
            className="bg-white p-2 rounded items-center justify-center h-20"
            accessibilityRole="button"
            accessibilityActions={[{ name: "toggleLocation" }]}
            accessibilityLabel="Toggle Location"
            accessibilityHint="Press to toggle location"
          >
            <MaterialIcons name="my-location" size={24} color="black" />
            <Text className="font-bold text-black">
              {isZoomedIn ? "Zoom Out" : "My Location"}
            </Text>
          </Pressable>
          <View className="flex-col mt-3">
            <Pressable
              onPress={zoomIn}
              className="bg-white p-2 rounded items-center justify-center w-10 h-10"
              accessibilityRole="button"
              accessibilityActions={[{ name: "zoomIn" }]}
              accessibilityLabel="Zoom In"
              accessibilityHint="Press to zoom in"
            >
              <Text className="text-lg font-bold text-black">+</Text>
            </Pressable>
            <Pressable
              onPress={zoomOut}
              className="bg-white p-2 rounded items-center justify-center w-10 h-10 mt-2"
              accessibilityRole="button"
              accessibilityActions={[{ name: "zoomOut" }]}
              accessibilityLabel="Zoom Out"
              accessibilityHint="Press to zoom out"
            >
              <Text className="text-lg font-bold text-black">-</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
