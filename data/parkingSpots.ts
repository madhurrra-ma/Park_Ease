type ParkingSpot = {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    price: number;
    slots: number;
    total_slots: number;
    type: "public" | "semi-private" | "private";
  };
  
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


  export default parkingSpots;