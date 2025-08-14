import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
  Platform,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as Linking from "expo-linking";
import type { Launchpad } from "./types";

interface UserLocation {
  latitude: number;
  longitude: number;
}

export default function DetailsScreen({ route }: any) {
  const { launchpadId } = route.params;
  const [launchpad, setLaunchpad] = useState<Launchpad | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<string>("");

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    fetch(`https://api.spacexdata.com/v4/launchpads/${launchpadId}`)
      .then((res) => res.json())
      .then((data: Launchpad) => setLaunchpad(data))
      .finally(() => setLoading(false));
  }, [launchpadId]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
      if (status === "granted") {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (mapRef.current && launchpad && location) {
      mapRef.current.fitToCoordinates(
        [
          { latitude: launchpad.latitude, longitude: launchpad.longitude },
          { latitude: location.latitude, longitude: location.longitude },
        ],
        {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        }
      );
    }
  }, [location, launchpad]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  if (!launchpad)
    return (
      <View style={styles.center}>
        <Text>Launchpad not found.</Text>
      </View>
    );

  const openMaps = () => {
    if (!location) {
      Alert.alert(
        "Location Unavailable",
        "Please enable location to get directions."
      );
      return;
    }
    const lat = launchpad.latitude;
    const lon = launchpad.longitude;
    const label = encodeURIComponent(launchpad.name);
    const userLat = location.latitude;
    const userLon = location.longitude;
    let url = "";
    if (Platform.OS === "ios") {
      url = `http://maps.apple.com/?saddr=${userLat},${userLon}&daddr=${lat},${lon}&q=${label}`;
    } else {
      url = `google.navigation:q=${lat},${lon}&mode=d`;
    }
    Linking.openURL(url);
  };

  const openSettings = () => {
    Linking.openSettings();
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.info}>
        <Text style={styles.title}>{launchpad.name}</Text>
        <Text style={styles.detail}>
          {launchpad.locality}, {launchpad.region}
        </Text>
        <Text style={styles.detail}>{launchpad.details}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: launchpad.latitude,
            longitude: launchpad.longitude,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2,
          }}
        >
          <Marker
            coordinate={{
              latitude: launchpad.latitude,
              longitude: launchpad.longitude,
            }}
            title={launchpad.name}
            description={launchpad.locality}
          />
          {location && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              pinColor="blue"
              title="You"
            />
          )}
        </MapView>
        {permissionStatus !== "granted" && (
          <View style={styles.permission}>
            <Text
              style={{ color: "red", marginBottom: 8, textAlign: "center" }}
            >
              Location permission denied. To see your location on the map,
              please enable location access in your device settings.
            </Text>
            <Button title="Open Settings" onPress={openSettings} />
          </View>
        )}
        <View style={styles.buttonContainer}>
          <Button title="Open in Maps" onPress={openMaps} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  info: {
    padding: 16,
    backgroundColor: "#fafafa",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
  },
  detail: {
    fontSize: 16,
    marginBottom: 4,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  permission: {
    padding: 16,
    backgroundColor: "#fffbe6",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  map: {
    flex: 1,
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    overflow: "hidden",
  },
  buttonContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
});
