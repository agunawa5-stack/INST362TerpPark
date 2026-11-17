
import { useEffect } from "react";
import { useMap } from "react-leaflet";

function MapResize() {
  const map = useMap();

  useEffect(() => {
    // Tell Leaflet to recalculate its container size
    map.invalidateSize();
  }, [map]);

  return null;
}

export default MapResize;
