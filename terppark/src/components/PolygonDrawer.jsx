
import {
  useMapEvents,
  CircleMarker,
  Polygon,
  Polyline,
} from "react-leaflet";

function PolygonDrawer({ enabled, points, setPoints }) {
  // Listen for clicks anywhere on the map
  useMapEvents({
    click(event) {
      // Only add coordinates when drawing is enabled
      if (!enabled) return;

      const { lat, lng } = event.latlng;

      // Save the coordinates of each click
      setPoints((previousPoints) => [
        ...previousPoints,
        [
          Number(lat.toFixed(6)),
          Number(lng.toFixed(6)),
        ],
      ]);
    },
  });

  return (
    <>
      {/* Show a small circle at each clicked point */}
      {points.map((point, index) => (
        <CircleMarker
          key={index}
          center={point}
          radius={5}
          interactive={false}
          pathOptions={{
            color: "#ffffff",
            fillColor: "#2563eb",
            fillOpacity: 1,
          }}
        />
      ))}

      {/* Show a line after clicking two points */}
      {points.length === 2 && (
        <Polyline
          positions={points}
          interactive={false}
          pathOptions={{ color: "#2563eb" }}
        />
      )}

      {/* Show a filled polygon after clicking three points */}
      {points.length >= 3 && (
        <Polygon
          positions={points}
          interactive={false}
          pathOptions={{
            color: "#2563eb",
            weight: 3,
            fillColor: "#2563eb",
            fillOpacity: 0.3,
          }}
        />
      )}
    </>
  );
}

export default PolygonDrawer;
