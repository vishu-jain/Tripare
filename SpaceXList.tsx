import React, { useEffect, useState, useCallback, memo } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import type { Launch, LaunchesQueryResponse } from "./types";

interface AppProps {
  navigation: any;
}

const LaunchRow = memo(
  ({
    item,
    onPress,
  }: {
    item: Launch;
    onPress: (launchpadId: string) => void;
  }) => (
    <TouchableOpacity onPress={() => onPress(item.launchpad)}>
      <View style={styles.item}>
        <Image
          source={{
            uri: item.links.patch.small || "https://via.placeholder.com/100",
          }}
          style={styles.image}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.date}>
            {new Date(item.date_utc).toLocaleDateString()}
          </Text>
          <Text style={styles.status}>
            Status:{" "}
            {item.success === null
              ? "Upcoming"
              : item.success
              ? "Success"
              : "Failure"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
);

export default function SpaceXList({ navigation }: AppProps) {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [filtered, setFiltered] = useState<Launch[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchLaunches = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.spacexdata.com/v5/launches/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          options: {
            limit: 1000,
          },
        }),
      });
      const data: LaunchesQueryResponse = await res.json();
      setLaunches(data.docs);
      setFiltered(data.docs);
    } catch (e) {
      console.error("Failed to fetch launches:", e);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchLaunches();
  }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(launches);
    } else {
      setFiltered(
        launches.filter((l) =>
          l.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, launches]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLaunches();
  };

  const handlePress = useCallback(
    (launchpadId: string) => {
      navigation.navigate("Details", { launchpadId });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: { item: Launch }) => (
      <LaunchRow item={item} onPress={handlePress} />
    ),
    [handlePress]
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>SpaceX Launches</Text>
      <TextInput
        style={styles.search}
        placeholder="Search by mission name..."
        value={search}
        onChangeText={setSearch}
      />
      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "center",
  },
  search: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderRadius: 8,
    marginBottom: 8,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  date: {
    color: "#555",
    marginTop: 2,
  },
  status: {
    marginTop: 4,
    fontWeight: "600",
  },
});
