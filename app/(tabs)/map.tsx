import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Pressable, Platform, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as posApi from "@/api/postApi";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { PostData } from "@/utils/postData";
import MapComponent from "@/components/MapComponent";

export default function Map() {
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(0.5);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

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
    const newZoomLevel = Math.max(zoomLevel / 1.5, 0.005);
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

  // Filter posts with category that matches selectedFilter.
  const filterPosts = selectedFilter
    ? posts.filter((post) =>
        post.category?.toLowerCase().includes(selectedFilter.toLowerCase())
      )
    : posts;

  return (
    <View className="flex-1">
      <MapComponent
        ref={mapRef}
        initialRegion={{
          latitude: 23.142545,
          longitude: -82.357438,
          latitudeDelta: 1.0,
          longitudeDelta: 1.0,
        }}
      >
        {filterPosts.map((post) =>
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
      <View className="absolute top-5 flex-row flex-wrap px-3">
        {[
          // Set the categories to filter by.
          "Sport Photography",
          "Sky Photography",
          "Abstract Art",
          "Digital Art",
        ].map((filter) => (
          <Pressable
            key={filter}
            onPress={() =>
              setSelectedFilter(filter === selectedFilter ? null : filter)
            }
            className={`p-2 rounded-lg m-1 ${
              selectedFilter === filter ? "bg-custom-orange" : "bg-neutral-100"
            }`}
          >
            <Text className={`font-bold text-black ${selectedFilter}`}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Zoom in/out/toggle location buttons */}
      {/* Since the map for web allready have buttons to handle zoom i decided to hide them if its not on ios or android. */}
      {Platform.OS === "ios" && (
        <View className="absolute top-5 right-1 items-end px-3 gap-2">
          <Pressable
            onPress={toggleLocation}
            accessibilityRole="button"
            accessibilityActions={[{ name: "toggleLocation" }]}
            accessibilityLabel="Toggle Location"
            accessibilityHint="Press to toggle location"
          >
            <MaterialIcons name="my-location" size={24} color="black" />
          </Pressable>
          <Pressable
            onPress={zoomIn}
            accessibilityRole="button"
            accessibilityActions={[{ name: "zoomIn" }]}
            accessibilityLabel="Zoom In"
            accessibilityHint="Press to zoom in"
          >
            <AntDesign name="pluscircleo" size={24} color="black" />
          </Pressable>
          <Pressable
            onPress={zoomOut}
            accessibilityRole="button"
            accessibilityActions={[{ name: "zoomOut" }]}
            accessibilityLabel="Zoom Out"
            accessibilityHint="Press to zoom out"
          >
            <AntDesign name="minuscircleo" size={24} color="black" />
          </Pressable>
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
