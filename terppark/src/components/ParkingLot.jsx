import { Polygon, Popup, Tooltip } from "react-leaflet";

const statusStyles = {
  allowed: {
    color: "#22c55e",
    fillColor: "#22c55e",
    fillOpacity: 0.25,
    textColor: "#15803d",
  },
  restricted: {
    color: "#ef4444",
    fillColor: "#ef4444",
    fillOpacity: 0.25,
    textColor: "#b91c1c",
  },
  verify: {
    color: "#f59e0b",
    fillColor: "#f59e0b",
    fillOpacity: 0.25,
    textColor: "#b45309",
  },
  unknown: {
    color: "#6b7280",
    fillColor: "#9ca3af",
    fillOpacity: 0.20,
    textColor: "#4b5563",
  },
};

function ParkingLot({ lot, status = "unknown", reason = "" }) {
  const style = statusStyles[status] || statusStyles.unknown;

  return (
    <Polygon
      positions={lot.coordinates}
      pathOptions={{
        color: style.color,
        weight: 3,
        fillColor: style.fillColor,
        fillOpacity: style.fillOpacity,
      }}
    >
      <Tooltip
        permanent
        direction="center"
        className={`parking-lot-label parking-lot-label-${status}`}
      >
        {lot.name}
      </Tooltip>

      <Popup>
        <h3>{lot.name}</h3>
        <p>{lot.description}</p>
        <p>
          <strong>Parking Status:</strong> {status}
        </p>
        <p>{reason}</p>
      </Popup>
    </Polygon>
  );
}

export default ParkingLot;