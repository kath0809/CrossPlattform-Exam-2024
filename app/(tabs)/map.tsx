import React, { useRef, useState } from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";

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
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={showLocation} // Show the user's location on the map if toggled
      >
        {location && <Marker coordinate={location} title="My Location" />}
      </MapView>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0", // Light background color for modern look
  },
  map: {
    width: "100%",
    height: "100%",
    overflow: "hidden", // Ensure the map respects the border radius
    shadowColor: "#000", // Shadow for modern look
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // Elevation for Android shadow
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  locationButton: {
    backgroundColor: "#f5a442",
    borderRadius: 50,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Elevation for Android shadow
    shadowColor: "#000", // Shadow for modern look
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    flexDirection: "row",
  },
  buttonText: {
    color: "black",
    marginLeft: 10,
  },
});

export default Map;
