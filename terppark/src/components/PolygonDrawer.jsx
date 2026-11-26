
import { useEffect } from "react";
import {
  useMapEvents,
  Marker,
  Polygon,
  Polyline,
} from "react-leaflet";
import L from "leaflet";

// Custom draggable point icon
const pointIcon = L.divIcon({
  className: "polygon-drag-handle",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function PolygonDrawer({ enabled, points, setPoints, savedPolygons }) {

  // Update a point's coordinates when it is dragged
  function movePoint(index, latlng) {
    const updatedPoint = [
      Number(latlng.lat.toFixed(6)),
      Number(latlng.lng.toFixed(6)),
    ];

    setPoints((previousPoints) =>
      previousPoints.map((point, i) =>
        i === index ? updatedPoint : point
      )
    );
  }

  // Listen for clicks anywhere on the map
  useMapEvents({
    click(event) {
      if (!enabled) return;

      const { lat, lng } = event.latlng;

      setPoints((previousPoints) => [
        ...previousPoints,
        [
          Number(lat.toFixed(6)),
          Number(lng.toFixed(6)),
        ],
      ]);
    },
  });

  // Ctrl + Z / Cmd + Z to undo the most recent point
  useEffect(() => {
    function handleKeyDown(event) {
      if (!enabled) return;

      // Don't interfere with typing in text fields
      const target = event.target;

      if (
        target instanceof HTMLElement &&
        (
          target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
        )
      ) {
        return;
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "z" &&
        !event.shiftKey &&
        !event.altKey &&
        points.length > 0
      ) {
        event.preventDefault();

        setPoints((previousPoints) =>
          previousPoints.slice(0, -1)
        );
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, points.length, setPoints]);

  return (
    <>
      {/* Draw a line while creating the polygon */}
      {points.length === 2 && (
        <Polyline
          positions={points}
          interactive={false}
          pathOptions={{
            color: "#2563eb",
            weight: 3,
          }}
        />
      )}

      {/* Draw the polygon once 3+ points exist */}
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

      {/* Draggable editing handles */}
      {points.map((point, index) => (
        <Marker
          key={index}
          position={point}
          icon={pointIcon}
          draggable={enabled}
          bubblingMouseEvents={false}
          autoPan={false}
          eventHandlers={{
            // Update the polygon while dragging
            drag(event) {
              movePoint(
                index,
                event.target.getLatLng()
              );
            },

            // Save the final coordinates after dragging
            dragend(event) {
              movePoint(
                index,
                event.target.getLatLng()
              );
            },
          }}
        />
      ))}
      
      {/* Previously saved polygons */}
      {savedPolygons.map((polygon) => (
        <Polygon
          key={polygon.id}
          positions={polygon.coordinates}
          interactive={false}
          pathOptions={{
            color: "#16a34a",
            weight: 3,
            fillColor: "#16a34a",
            fillOpacity: 0.2,
            dashArray: "5, 5",
          }}
        />
      ))}
    </>
  );
}

export default PolygonDrawer;
