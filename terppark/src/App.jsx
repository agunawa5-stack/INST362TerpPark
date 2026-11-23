
import { useState } from "react";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

import MapResize from "./components/MapResize";
import ParkingLot from "./components/ParkingLot";
import ParkingFilters from "./components/ParkingFilters";
import PolygonDrawer from "./components/PolygonDrawer";
import { parkingLots } from "./data/parkingLots";
import { getParkingStatus } from "./utils/parkingRules";
import ParkingLegend from "./components/ParkingLegend";
import { useMapEvents } from "react-leaflet";

// Campus boundaries to restrict map panning
const campusBounds = [
  [38.974, -76.960],
  [39.005, -76.925],
];

function ZoomTracker({ setZoom }) {
    useMapEvents({
        zoomend(event) {
            setZoom(event.target.getZoom());
        },
    });

    return null;
}

function App() {
  const [parkingType, setParkingType] = useState("visitor");
  const [selectedPermit, setSelectedPermit] = useState("");
  const [parkingTime, setParkingTime] = useState("now");
  const [selectedDateTime, setSelectedDateTime] = useState("");
  const [zoom, setZoom] = useState(16);
  
  // Controls whether map clicks add polygon points
  const [drawingEnabled, setDrawingEnabled] = useState(false);

  // Coordinates collected by clicking the map
  const [points, setPoints] = useState([]);

  // Remove the most recently added coordinate
  function undoPoint() {
    setPoints((previousPoints) => previousPoints.slice(0, -1));
  }

  // Copy coordinates for use in parkingLots.js
  async function copyCoordinates() {
    if (points.length < 3) {
      alert("Please draw at least 3 points first.");
      return;
    }

    try {
      await navigator.clipboard.writeText(
        JSON.stringify(points, null, 2)
      );

      alert("Coordinates copied!");
    } catch (error) {
      console.error("Could not copy coordinates:", error);
      alert("Could not copy coordinates.");
    }
  }

  console.log("App is running!");
  console.log(
    "CARTO key loaded:",
    Boolean(import.meta.env.VITE_CARTO_KEY)
  );

const filters = {
  parkingType,
  selectedPermit,
  parkingTime,
  selectedDateTime,
};

  return (
    <div className="map-wrapper">
      {/* Developer-only drawing toolbar */}
      <div className="drawing-controls">
        <button
          onClick={() => setDrawingEnabled(!drawingEnabled)}
        >
          {drawingEnabled ? "Stop Drawing" : "Start Drawing"}
        </button>

        <button
          onClick={undoPoint}
          disabled={points.length === 0}
        >
          Undo Point
        </button>

        <button
          onClick={() => setPoints([])}
          disabled={points.length === 0}
        >
          Clear
        </button>

        <button
          onClick={copyCoordinates}
          disabled={points.length < 3}
        >
          Copy Coordinates
        </button>
      </div>

      <MapContainer
        center={[38.9869, -76.9426]}
        zoom={16}
        minZoom={14}
        maxZoom={18}
        maxBounds={campusBounds}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
      >

        <MapResize />
        <ZoomTracker setZoom={setZoom} />
        <ZoomControl position="topright" />

        {/* User-facing parking filters */}
        <ParkingFilters
          parkingType={parkingType}
          setParkingType={setParkingType}
          selectedPermit={selectedPermit}
          setSelectedPermit={setSelectedPermit}
          parkingTime={parkingTime}
          setParkingTime={setParkingTime}
          selectedDateTime={selectedDateTime}
          setSelectedDateTime={setSelectedDateTime}
        />

        <TileLayer
          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
          url={`https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${import.meta.env.VITE_CARTO_KEY}`}
          maxNativeZoom={18}
          maxZoom={20}
        />

        {/* Display parking lots based on selected filters */}
        {parkingLots.map((lot) => {
          const result = getParkingStatus(lot, filters);
          return (
            <ParkingLot
              key={lot.id}
              lot={lot}
              status={result.status}
              reason={result.reason}
              zoom={zoom}
            />
          );
        })}

        {/* Developer drawing layer */}
        <PolygonDrawer
          enabled={drawingEnabled}
          points={points}
          setPoints={setPoints}
        />
      </MapContainer>

      <ParkingLegend />

    </div>
  );
}

export default App;
