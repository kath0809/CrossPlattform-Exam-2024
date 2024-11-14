import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import { PostData } from "@/utils/postData";
import * as posApi from "@/api/postApi";

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
      // Zoom out to a broader view when hiding location
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
      // Request permission to access location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
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
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 23.142545,
          longitude: -82.357438,
          latitudeDelta: zoomLevel,
          longitudeDelta: zoomLevel,
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
      </MapView>
      <View style={styles.buttonContainer}>
        <Pressable onPress={zoomIn} style={styles.zoomButton}>
          <Text style={styles.buttonText}>+</Text>
        </Pressable>
        <Pressable onPress={zoomOut} style={styles.zoomButton}>
          <Text style={styles.buttonText}>-</Text>
        </Pressable>
        <Pressable onPress={toggleLocation} style={styles.locationButton}>
          <MaterialIcons name="my-location" size={24} color="black" />
          <Text style={styles.buttonText}>
            {isZoomedIn ? "Zoom Out" : "Zoom In to My Location"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    elevation: 4,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "black",
  },
  zoomButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
