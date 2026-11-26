import Papa from "papaparse";
import csvData from "./parkingLots.csv?raw";

// converts csv into js objects
const parsedData = Papa.parse(csvData, {
  header: true,
  skipEmptyLines: true,
  transformHeader: (header) => header.trim(),
});

// convert csv rows into the structure used in the app
export const parkingLots = parsedData.data
    .filter((row) => row.code?.trim() && row.cords?.trim())
    .map((row) => ({
      id: row.id.trim(),
      code: row.code.trim().toUpperCase(),
      displayName: row.displayName.trim(),
      restrictionType: row.restrictionType?.trim() || "unknown",
      // allow multiple categories separated by |
      permitCategory: row.permitCategory
        ? row.permitCategory.split("|").map((value) => value.trim())
        : ["unknown"],
      description: row.notes || "Parking information coming soon",
      // convert coordinate text into an actual array
      coordinates: JSON.parse(row.cords),
}));