
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

import ParkingLot from "./components/ParkingLot";
import { parkingLots } from "./data/parkingLots";

function App() {
  return (
    <MapContainer
      center={[38.9869, -76.9426]}
      zoom={16}
      scrollWheelZoom={true}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Draw all parking lots on the map */}
      {parkingLots.map((lot) => (
        <ParkingLot 
          key={lot.id} 
          lot={lot} 
          status="unknown"
        />
      ))}
    </MapContainer>
    
  );
}


export default App;
