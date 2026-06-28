// map.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Text,
  Linking,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  Switch,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";

function MapScreen() {
  const [location, setLocation] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [showLayout, setShowLayout] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterPaid, setFilterPaid] = useState(true);
  const [filterUnpaid, setFilterUnpaid] = useState(true);
  const [filterReserved, setFilterReserved] = useState(true);
  const mapRef = useRef<MapView>(null);
  const navigation = useNavigation();
  const { selectedSpot: paramSpot, openInfoBox } = useLocalSearchParams();

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
      available_slots: ["A3", "B2", "C4", "D1", "D5", "E2", "B5", "D3", "A2"],
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
      available_slots: ["A3", "B2", "C4", "D1", "E4"],
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
      available_slots: ["A3", "B2", "C4", "D1", "B4", "D2", "B5"],
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
      available_slots: ["A3", "B2", "C4", "D1"],
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
      available_slots: ["A3", "B2", "C4", "D1", "A5"],
    },
  ];

  const filteredSpots = parkingSpots.filter((spot) => {
    if (spot.type === "Paid" && !filterPaid) return false;
    if (spot.type === "Unpaid" && !filterUnpaid) return false;
    if (spot.type === "Reserved" && !filterReserved) return false;
    return true;
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    })();
  }, []);

  useEffect(() => {
    if (paramSpot && openInfoBox === "true") {
      const parsed = JSON.parse(paramSpot);
      setSelectedSpot(parsed);
      mapRef.current?.animateToRegion({
        latitude: parsed.latitude,
        longitude: parsed.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  }, [paramSpot, openInfoBox]);

  const getMarkerColor = (type) => {
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

  const generateSlotLabels = (total) => {
    const slots = [];
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < total; i++) {
      const row = Math.floor(i / 5);
      const label = `${letters[row]}${(i % 5) + 1}`;
      slots.push(label);
    }
    return slots;
  };

  return (
    <View style={styles.container}>
      {location && (
        <>
          <View style={styles.searchContainer}>
            <Image source={require("../assets/images/search.png")} style={styles.searchIcon} />
            <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate("search")}>
              <TextInput
                placeholder="Search here"
                placeholderTextColor="gray"
                style={styles.searchInput}
                editable={false}
                pointerEvents="none"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
              <Image source={require("../assets/images/filter.png")} style={{ width: 25, height: 25 }} />
            </TouchableOpacity>
          </View>

          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={true}
            onPress={() => setSelectedSpot(null)}
          >
            {filteredSpots.map((spot) => (
              <Marker
                key={spot.id}
                coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
                pinColor={getMarkerColor(spot.type)}
                onPress={() => setSelectedSpot(spot)}
              />
            ))}
          </MapView>

          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image source={require("../assets/images/back.png")} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>

          {selectedSpot && (
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>{selectedSpot.name}</Text>
              <Text style={styles.infoText}>🏷 Type: {selectedSpot.type}</Text>
              <Text style={styles.infoText}>💰 Price: ₹{selectedSpot.price}</Text>
              <Text style={styles.infoText}>🚗 Available Slots: {selectedSpot.slots}</Text>

              <TouchableOpacity
                style={styles.locateButton}
                onPress={() =>
                  Linking.openURL(
                    `https://www.google.com/maps/dir/?api=1&destination=${selectedSpot.latitude},${selectedSpot.longitude}`
                  )
                }
              >
                <Text style={styles.locateButtonText}>📍 Locate Parking</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.locateButton, { marginTop: 10 }]}
                onPress={() => setShowLayout(true)}
              >
                <Text style={styles.locateButtonText}>🗺 Layout</Text>
              </TouchableOpacity>
            </View>
          )}

          <Modal visible={showLayout} transparent animationType="slide" onRequestClose={() => setShowLayout(false)}>
            <TouchableWithoutFeedback onPress={() => setShowLayout(false)}>
              <View style={styles.modalOverlay}>
                <Pressable style={styles.modalContent}>
                  <Text style={styles.modalTitle}> Layout for {selectedSpot?.name}</Text>
                  <ScrollView contentContainerStyle={styles.slotGrid}>
                    {selectedSpot &&
                      generateSlotLabels(selectedSpot.total_slots).map((slot, index) => (
                        <View
                          key={index}
                          style={[
                            styles.slotBox,
                            {
                              backgroundColor: selectedSpot.available_slots?.includes(slot)
                                ? "green"
                                : "gray",
                            },
                          ]}
                        >
                          <Text style={styles.slotLabel}>{slot}</Text>
                        </View>
                      ))}
                  </ScrollView>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          <Modal
  visible={filterModalVisible}
  animationType="fade"
  transparent={true}
  onRequestClose={() => setFilterModalVisible(false)}
>
  <TouchableWithoutFeedback onPress={() => setFilterModalVisible(false)}>
    <View style={styles.modalOverlay}>
      <Pressable style={styles.centeredModalContent}>
        <Text style={styles.modalTitle}>Filter by Parking Type</Text>

        <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}></Text>

        <View style={styles.toggleRow}>
          <Text style={{ fontSize: 17 , fontFamily: 'montserrat-bold'}}>Paid</Text>
          <Switch value={filterPaid} onValueChange={setFilterPaid} 
          trackColor={{ true: '#ff6347', false: 'ff6347' }} // Red when on, grey when off
          thumbColor={filterPaid ? '#ff6347' : '#ff6347'}
          />
        </View>

        <View style={styles.toggleRow}>
          <Text style={{ fontSize: 17 , fontFamily: 'montserrat-bold'}}>Unpaid</Text>
          <Switch value={filterUnpaid} onValueChange={setFilterUnpaid}
          trackColor={{ true: '#329633', false: '329633' }} // Red when on, grey when off
          thumbColor={filterUnpaid ? '#329633' : '#329633'} 
          />
        </View>

        <View style={styles.toggleRow}>
          <Text style={{ fontSize: 17 , fontFamily: 'montserrat-bold'}}>Reserved</Text>
          <Switch value={filterReserved} onValueChange={setFilterReserved}
          trackColor={{ true: '#dae330', false: 'dae330' }} // Red when on, grey when off
          thumbColor={filterReserved ? '#dae330' : '#dae330'} 
          />
        </View>

        <TouchableOpacity
          onPress={() => setFilterModalVisible(false)}
          style={styles.doneButton}
        >
          <Text style={{ color: "white", fontWeight: "bold" , fontSize: 17 , fontFamily: 'montserrat-bold'}}>Apply Filters</Text>
        </TouchableOpacity>
      </Pressable>
    </View>
  </TouchableWithoutFeedback>
</Modal>

        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f0f000", top: 50 },
  map: { flex: 1, backgroundColor: "white" },
  searchContainer: {
    backgroundColor : "#f1f1f1",
    position: "absolute",
    top: -45,
    right: 15,
    flexDirection: "row",
    alignSelf: "center",
    borderRadius: 25,
    paddingHorizontal: 15,
    elevation: 5,
    width: "85%",
    alignItems: "center",
    zIndex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    overflow: "hidden",
    
  },
  searchIcon: { width: 20, height: 20, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: "black" },
  filterButton: {
    marginLeft: 10,
    right: -10,
    backgroundColor: "#f1f1f1",
    padding: 6,
    borderRadius: 20,
    
  },
  backButton: {
    position: "absolute",
    top: -40,
    left: 5,
    backgroundColor: "#f1f1f1",
    borderRadius: 25,
    elevation: 5,
  },
  infoBox: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 10,
  },
  infoTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  infoText: { fontSize: 16, marginBottom: 4 },
  locateButton: {
    marginTop: 10,
    backgroundColor: "#000000",
    paddingVertical: 10,
    borderRadius: 8,
  },
  locateButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    height: "66%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  slotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 10,
  },
  slotBox: {
    width: 55,
    height: 55,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  slotLabel: {
    color: "white",
    fontWeight: "bold",
  },
  centeredModalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    width: "80%",
    alignSelf: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginTop: "auto",
    marginBottom: "auto",
  },
  
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  
  doneButton: {
    
    backgroundColor: "#000000",
    paddingVertical: 10,
    paddingHorizontal: 70,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 10,
  },
  
});

export default MapScreen;
