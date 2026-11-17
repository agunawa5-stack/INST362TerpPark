
import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

import MapResize from "./components/MapResize";
import ParkingLot from "./components/ParkingLot";
import PolygonDrawer from "./components/PolygonDrawer";
import { parkingLots } from "./data/parkingLots";


// Campus boundaries to restrict map panning
const campusBounds = [
  [38.974, -76.960],
  [39.005, -76.925],
];

function App() {
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
        style={{ height: "100%", width: "100%" }}
      >
        <MapResize />
        <TileLayer
          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
          url={`https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${import.meta.env.VITE_CARTO_KEY}`}
          maxNativeZoom={18}
          maxZoom={20}
        />

        {/* Existing parking lot overlays */}
        {parkingLots.map((lot) => (
          <ParkingLot
            key={lot.id}
            lot={lot}
            status="unknown"
          />
        ))}

        {/* Developer drawing layer */}
        <PolygonDrawer
          enabled={drawingEnabled}
          points={points}
          setPoints={setPoints}
        />
      </MapContainer>
    </div>
  );
}

export default App;
