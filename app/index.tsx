import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
  PanResponder,
  Modal,
  Switch,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, Region } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const { height } = Dimensions.get("window");

// Define parking spot type
type ParkingSpot = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  price: number;
  slots: number;
  total_slots: number;
  type: "Unpaid" | "Reserved" | "Paid";
};

// Hardcoded parking spots data
const parkingSpots = [
  {
    id: 1,
    name: "Sports Complex Parking",
    latitude: 23.2113519,
    longitude: 72.687124,
    price: 0,
    slots: 3,
    total_slots: 15,
    type: "Unpaid",
    available_slots: ["A3", "B2", "C4"],
  },
  {
    id: 2,
    name: "Solar Parking",
    latitude: 23.212594,
    longitude: 72.683631,
    price: 50,
    slots: 9,
    total_slots: 23,
    type: "Paid",
    available_slots: ["A3", "B2", "C4", "D1", "E4", "F2", "G1", "D3", "A2"],
  },
  {
    id: 3,
    name: "U corridor Parking",
    latitude: 23.215463,
    longitude: 72.6854815,
    price: 0,
    slots: 5,
    total_slots: 25,
    type: "Unpaid",
    available_slots: ["A3", "B2", "C4","D1","E4"]
  },
  {
    id: 4,
    name: "AB 13 Open Parking",
    latitude: 23.213625,
    longitude: 72.6883877,
    price: 0,
    slots: 7,
    total_slots: 20,
    type: "Unpaid",
    available_slots: ["A3", "B2", "C4","D1","E4","D2","E2"]
  },
  {
    id: 5,
    name: "IIT Gandhinagar Housing Parking",
    latitude: 23.2106346,
    longitude: 72.6897861,
    price: 0,
    slots: 4,
    total_slots: 27,
    type: "Reserved",
    available_slots: ["A3", "B2", "C4","D1"]
  },
  {
    id: 6,
    name: "Academic Block Parking",
    latitude: 23.2132165,
    longitude: 72.6853471,
    price: 30,
    slots: 5,
    total_slots: 20,
    type: "Paid",
    available_slots: ["A3", "B2", "C4","D1","E4"]
  },
];

export default function Index() {
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false);
  const [showPublic, setShowPublic] = useState(true);
  const [showSemiPrivate, setShowSemiPrivate] = useState(true);
  const [showPrivate, setShowPrivate] = useState(true);
  const navigation = useNavigation();

  const getMarkerColor = (type: string) => {
    switch (type) {
      case "Unpaid":
        return "green";
      case "Reserved":
        return "yellow";
      case "Paid":
        return "red";
      default:
        return "gray";
    }
  };

  // Splash screen delay
  useEffect(() => {
    const showSplash = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLoading(false);
    };
    showSplash();
  }, []);

  // Get user's current location
  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    };
    getLocation();
  }, []);

  // Pan gesture to navigate to full map
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => navigation.navigate("map"),
      onPanResponderMove: () => {},
      onPanResponderRelease: () => {},
    })
  ).current;

  if (loading) {
    return (
      <View style={styles.splashContainer}>
        <Image source={require("../assets/images/logo.png")} style={styles.splashLogo} />
        <Text style={styles.splashText}>ParkEase</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔍 Search bar and filter button */}
      <TouchableOpacity
        style={styles.searchContainer}
        onPress={() => navigation.navigate("search")}
      >
        <Ionicons name="search" size={20} color="gray" style={styles.icon} />
        <Text style={styles.searchInput}>Search parking...</Text>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(true)}>
          <Image source={require("../assets/images/filter.png")} style={styles.filterIcon} />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* 🗺️ MapView */}
      {region && (
        <View {...panResponder.panHandlers}>
          <MapView
            style={styles.map}
            region={region}
            showsUserLocation={true}
            pointerEvents="none"
          >
            {parkingSpots
              .filter((spot) =>
                (showPublic && spot.type === "Unpaid") ||
                (showSemiPrivate && spot.type === "Reserved") ||
                (showPrivate && spot.type === "Paid")
              )
              .map((spot) => (
                <Marker
                  key={spot.id}
                  coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
                  pinColor={getMarkerColor(spot.type)}
                />
              ))}
          </MapView>
        </View>
      )}

      {/* 🔻 Branding */}
      <Image source={require("../assets/images/logo.png")} style={styles.logo} />
      <Text style={styles.fancyText}>Worried about parking? We've got you.</Text>

      {/* ⚙️ Filter Modal */}
      <Modal visible={filterVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter by Parking Type</Text>
            <View style={styles.switchRow}>
              <Text>Paid</Text>
              <Switch value={showPrivate} onValueChange={setShowPrivate} />
            </View>
            <View style={styles.switchRow}>
              <Text>Unpaid</Text>
              <Switch value={showPublic} onValueChange={setShowPublic} />
            </View>
            <View style={styles.switchRow}>
              <Text>Reserved</Text>
              <Switch value={showSemiPrivate} onValueChange={setShowSemiPrivate} />
            </View>
            
            <TouchableOpacity style={styles.closeButton} onPress={() => setFilterVisible(false)}>
              <Text style={styles.closeButtonText}>Apply Filters!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// 🎨 Styles
const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  splashLogo: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  splashText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 25,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 5,
    height: 50,
    marginTop: -25,
  },
  icon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#555",
  },
  filterButton: {
    padding: 6,
    marginLeft: 10,
  },
  filterIcon: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
  map: {
    height: height * 0.5,
    marginTop: 15,
    marginHorizontal: 5,
    borderRadius: 15,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginTop: 15,
  },
  fancyText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});