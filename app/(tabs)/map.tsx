import React, { useRef, useState } from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import MapComponent from "@/components/MapComponent";

const Map = () => {
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isCentered, setIsCentered] = useState(false);
  const [showLocation, setShowLocation] = useState(false);

  const toggleLocation = async () => {
    if (showLocation) {
      // Hide the location and zoom out to a broader view
      mapRef.current?.animateToRegion({
        latitude: location?.latitude || 0,
        longitude: location?.longitude || 0,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
      setLocation(null);
      setShowLocation(false);
      setIsCentered(false);
    } else {
      // Request permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      // Get the current location
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Center the map on the current location
      mapRef.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      // Update the state with the current location
      setLocation({ latitude, longitude });
      setShowLocation(true);
      setIsCentered(true);
    }
  };

  return (
    <View style={styles.container}>
      <MapComponent
        initialRegion={
          location
            ? {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
            : undefined
        }
      >
        {location && <Marker coordinate={location} title="My Location" />}
      </MapComponent>
      <View style={styles.buttonContainer}>
        <Pressable onPress={toggleLocation} style={styles.locationButton}>
          <MaterialIcons name="my-location" size={24} color="black" />
          <Text style={styles.buttonText}>
            {showLocation ? "Hide My Location" : "Show My Location"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    elevation: 2,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default Map;
