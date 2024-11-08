import React from "react";
import { Platform, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import WebMap from "@teovilla/react-native-web-maps";
import { googleMapsApiKey } from "@/googleApiKeyEnv";

interface MapComponentProps {
  children: React.ReactNode;
  initialRegion: Region | undefined;
}

export default function MapComponent({
  children,
  initialRegion,
}: MapComponentProps) {
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
        initialRegion={undefined}
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
