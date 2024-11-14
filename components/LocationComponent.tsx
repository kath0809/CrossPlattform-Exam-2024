import { useState, useEffect } from "react";
import * as Location from "expo-location";

type UseLocationHookReturn = {
  coordinates: Location.LocationObjectCoords | null;
  locationAddress: Location.LocationGeocodedAddress | null;
  statusText: string | null;
  getLocation: () => Promise<void>;
};

export default function useLocation(): UseLocationHookReturn {
  const [coordinates, setCoordinates] =
    useState<Location.LocationObjectCoords | null>(null);
  const [locationAddress, setLocationAddress] =
    useState<Location.LocationGeocodedAddress | null>(null);
  const [statusText, setStatusText] = useState<string | null>(null);

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

    try {
      // Get the current location
      let currentLocation = await Location.getCurrentPositionAsync();
      setCoordinates(currentLocation.coords); 
      const address = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (address.length > 0) {
        setLocationAddress(address[0]);
      }
    } catch (error) {
      setStatusText("Error getting location. Please try again.");
      console.error("Error getting location:", error);
    }
  };

  return { coordinates, locationAddress, statusText, getLocation };
}
