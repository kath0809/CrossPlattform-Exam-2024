import React, { forwardRef } from "react";
import { Platform } from "react-native";
import MapView, { Region } from "react-native-maps";
import WebMap from "@teovilla/react-native-web-maps";
import { googleMapsApiKey } from "@/googleApiKeyEnv";

interface MapComponentProps {
  children: React.ReactNode;
  initialRegion: Region | undefined;
}

const MapComponent = forwardRef<MapView, MapComponentProps>(
  ({ children, initialRegion }, ref) => {
    if (Platform.OS === "web") {
      return (
        //@ts-ignore
        <WebMap
          provider="google"
          initialRegion={initialRegion}
          googleMapsApiKey={googleMapsApiKey}
          style={{
            width: "80%",
            height: "80%",
          }}
        >
          {children}
        </WebMap>
      );
    } else {
      return (
        <MapView
          ref={ref}
          initialRegion={initialRegion}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          {children}
        </MapView>
      );
    }
  }
);

export default MapComponent;
