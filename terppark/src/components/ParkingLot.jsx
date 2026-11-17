
import { Polygon, Popup } from "react-leaflet";

const statusColors = {
  allowed: "green",
  restricted: "red",
  unknown: "gray",
};

function ParkingLot({ lot, status }) {
  // changes color based on the parking status
  const lotColor = statusColors[status] ?? "gray";

  return (
    <Polygon
      positions={lot.coordinates}
      pathOptions={{
        color: lotColor,
        weight: 3,
        fillColor: lotColor,
        fillOpacity: 0.35,
      }}
    >
      <Popup>
        <h3>{lot.name}</h3>
        <p>{lot.description}</p>
        <p>Parking status: {status}</p>
      </Popup>
    </Polygon>
  );
}

export default ParkingLot;
