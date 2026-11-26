
import { useEffect } from "react";
import {
  useMapEvents,
  Marker,
  Polygon,
  Polyline,
} from "react-leaflet";
import L from "leaflet";

import {
  getCurvedPolygon,
  getEdgeMidpoint,
} from "../utils/polygonCurves";

// blue point icon
const cornerIcon = L.divIcon({
  className: "polygon-drag-handle",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// orange point icon
const curveIcon = L.divIcon({
  className: "polygon-curve-handle",
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function PolygonDrawer({
  enabled,
  points,
  setPoints,
  curveControls,
  setCurveControls,
  savedPolygons = [],
}) {
  
// add polygon corners when clicking the map
  useMapEvents({
    click(event) {
      if (!enabled) return;

      const { lat, lng } = event.latlng;

      setPoints((previous) => [
        ...previous,
        [
          Number(lat.toFixed(6)),
          Number(lng.toFixed(6)),
        ],
      ]);

      // new corners change the edge arrangement,
      // so reset any existing curves.
      setCurveControls({});
    },
  });

  // move a blue corner
  function moveCorner(index, latlng) {
    const newPoint = [
      Number(latlng.lat.toFixed(6)),
      Number(latlng.lng.toFixed(6)),
    ];

    setPoints((previous) =>
      previous.map((point, i) =>
        i === index ? newPoint : point
      )
    );
  }

  // move an orange curve handle
  function moveCurve(index, latlng) {
    const newControl = [
      Number(latlng.lat.toFixed(6)),
      Number(latlng.lng.toFixed(6)),
    ];

    setCurveControls((previous) => ({
      ...previous,
      [index]: newControl,
    }));
  }

  // double-click to straighten an edge
  function straightenEdge(index) {
    setCurveControls((previous) => {
      const updated = { ...previous };
      delete updated[index];
      return updated;
    });
  }

  // Ctrl + Z / Cmd + Z removes the last corner
  useEffect(() => {
    function handleKeyDown(event) {
      if (!enabled) return;

      const target = event.target;

      if (
        target instanceof HTMLElement &&
        (
          target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"]
            .includes(target.tagName)
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

        setPoints((previous) =>
          previous.slice(0, -1)
        );

        // prevent curves referencing removed edges
        setCurveControls({});
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    enabled,
    points.length,
    setPoints,
    setCurveControls,
  ]);

  // build the visible curved polygon
  const polygonCoordinates = getCurvedPolygon(
    points,
    curveControls
  );

  return (
    <>
      {/* display previously saved polygons */}
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

      {/* line before the polygon has 3 corners */}
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

      {/* current polygon, including curves */}
      {points.length >= 3 && (
        <Polygon
          positions={polygonCoordinates}
          interactive={false}
          pathOptions={{
            color: "#2563eb",
            weight: 3,
            fillColor: "#2563eb",
            fillOpacity: 0.3,
          }}
        />
      )}

      {/* orange curve handles */}
      {enabled &&
        points.length >= 3 &&
        points.map((start, index) => {
          const end =
            points[(index + 1) % points.length];

          const position =
            curveControls[index] ||
            getEdgeMidpoint(start, end);

          return (
            <Marker
              key={`curve-${index}`}
              position={position}
              icon={curveIcon}
              draggable
              bubblingMouseEvents={false}
              autoPan={false}
              eventHandlers={{
                drag(event) {
                  moveCurve(
                    index,
                    event.target.getLatLng()
                  );
                },

                dragend(event) {
                  moveCurve(
                    index,
                    event.target.getLatLng()
                  );
                },

                dblclick() {
                  straightenEdge(index);
                },
              }}
            />
          );
        })
      }

      {/* Blue draggable corners */}
      {points.map((point, index) => (
        <Marker
          key={`corner-${index}`}
          position={point}
          icon={cornerIcon}
          draggable={enabled}
          bubblingMouseEvents={false}
          autoPan={false}
          eventHandlers={{
            drag(event) {
              moveCorner(
                index,
                event.target.getLatLng()
              );
            },

            dragend(event) {
              moveCorner(
                index,
                event.target.getLatLng()
              );
            },
          }}
        />
      ))}
    </>
  );
}

export default PolygonDrawer;