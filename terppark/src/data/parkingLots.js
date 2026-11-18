import Papa from "papaparse";
import csvData from "./parkingLots.csv?raw";

// converts csv into js objects
const parsedData = Papa.parse(csvData, {
  header: true,
  skipEmptyLines: true,
  transformHeader: (header) => header.trim(),
});

// convert csv rows into the structure used in the app
export const parkingLots = parsedData.data.map((row) => ({
  id: String(row.id).trim(),

  name: row.name.trim().toUpperCase(),

  description: row.notes || "Parking information coming soon",

  restrictionType: row.restrictionType?.trim() || "unknown",

  // allow multiple categories separated by |
  permitCategory: row.permitCategory
    ? row.permitCategory.split("|").map((category) => category.trim())
    : ["unknown"],

  // convert coordinate text into an actual array
  coordinates: JSON.parse(row.cords),
}));