
// figures out a parking lot's status based on user filters

// commuter lot designations listed by UMD
const commuterLots = ["1", "6", "9", "11", "SDG"];

// takes the main lot number from a name such as "1C" or "Lot 1F"
function getLotDesignation(name) {
  const cleanedName = name
    .trim()
    .toUpperCase()
    .replace(/^LOT\s*/, "");

  if (cleanedName === "SDG") {
    return "SDG";
  }
  // example: "1c" becomes "1"
  const match = cleanedName.match(/^(\d+)/);

  return match ? match[1] : cleanedName;
}

// returns the date/time that the user wants to park
export function getParkingDateTime(parkingTime, selectedDateTime) {
    if (parkingTime === "now") {
        return new Date();
    }

     if (!selectedDateTime) {
        return null;
     }

    const date = new Date(selectedDateTime);

    return Number.isNaN(date.getTime()) ? null : date;
}

// evaluates a lot using the current filter selections

export function getParkingStatus(lot, filters) {
    const {
        parkingType,
        selectedPermit,
        parkingTime,
        selectedDateTime,
    } = filters;

    const dateToCheck = getParkingDateTime(
        parkingTime,
        selectedDateTime
    );

    // make sure a valid date/time was selected
    if (!dateToCheck) {
        return {
            status: "unknown",
            reason: "Please select a valid parking date and time.",
        };
    }

    // calculate time in minutes since midnight
    const day = dateToCheck.getDay();
    const minutes =
        dateToCheck.getHours() * 60 +
        dateToCheck.getMinutes();

    const isWeekday = day >= 1 && day <= 5;

    // permit enforcement: 7 AM to 4 PM on weekdays
    const duringPermitHours =
        isWeekday &&
        minutes >= 7 * 60 &&
        minutes < 16 * 60;

    const outsidePermitHours = !duringPermitHours;

    // identify which lot we're evaluating
    const designation = getLotDesignation(lot.name);

    // checks commuter overnight restriction
    const commuterOvernightRestriction =
        parkingType === "permit" &&
        selectedPermit === "commuter" &&
        commuterLots.includes(designation) &&
        isWeekday &&
        minutes >= 3 * 60 &&
        minutes < 5 * 60;

    if (commuterOvernightRestriction) {
        return {
            status: "restricted",
            reason:
                "Commuter registrations cannot park in commuter " +
                "lots between 3 AM and 5 AM, Monday through Friday.",
        };
    }

    // check lots with a verified 7 AM–4 PM schedule
    if (lot.restrictionType === "black_sign") {
        if (outsidePermitHours) {
            return {
                status: "allowed",
                reason:
                    "Normal permit enforcement is not active. " +
                    "Check posted signs and event restrictions.",
            };
        }
    }
    // red signs require  permit registration 24 hours a day, 7 days a week
    if (lot.restrictionType === "red_sign") {
        return {
            status: "restricted",
            reason:
                "This lot requires an authorized parking permit" +
                "registration 24 hours a day.",
        };
    }

    // visitor rules
    if (parkingType === "visitor") {
        return {
            status: "unknown",
            reason: "Visitor parking rules have not been fully implemented.",
        };
    }

    // require the user to select a permit
    if (!selectedPermit) {
        return {
            status: "unknown",
            reason: "Please select your parking permit.",
        };
    }

    // commuter parking logic
    if (selectedPermit === "commuter") {
        if (commuterLots.includes(designation)) {
            return {
                status: designation === "SDG" ? "verify" : "allowed",
                reason:
                    "Designated commuter parking option. " +
                    "Check that your assigned registration permits " +
                    "this lot and review applicable restrictions.",
            };
        }
    }

    // default status for unimplemented rules
    return {
        status: "unknown",
        reason: "Unknown parking status. " +
            "Parking eligibility has not been evaluated for " +
            "this permit and lot combination.",
    };
}


