
// figures out a parking lot's status based on user filters

const permitCategoryMap = {
    commuter: "commuter",
    resident: "resident",
    overnight: "overnight",
    staff: "faculty_staff",
};

// checks whether a lot serves the selected permit category
function matchesPermitCategory(lot, selectedPermit) {
    const category = permitCategoryMap[selectedPermit];

    if (!category) {
        return false;
    }

    return lot.permitCategory?.includes(category) ?? false;
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

    // Check if we're outside normal permit enforcement hours
    const outsidePermitHours = !duringPermitHours;

    // paid visitor parking from 7 AM - midnight, daily
    const duringPaidHours = minutes >= 7 * 60;

    // check whether this lot is designated for commuter parking
    const isCommuterLot =
        lot.permitCategory?.includes("commuter") ?? false;

    const isCommuter =
        parkingType === "permit" &&
        selectedPermit === "commuter";

    // checks commuter overnight restriction
    const commuterOvernightRestriction =
        isCommuter &&
        isCommuterLot &&
        isWeekday &&
        minutes >= 3 * 60 &&
        minutes < 5 * 60;

    // rule 1: overnight restriction for commuter lots
    if (commuterOvernightRestriction) {
        return {
            status: "restricted",
            reason:
                "Commuter registrations cannot park in commuter " +
                "lots between 3 AM and 5 AM, Monday through Friday.",
        };
    }

    // rule 2: paid visitor parking
    if (lot.restrictionType === "visitor_paid") {
        if (duringPaidHours) {
            return {
                status: "paid",
                reason:
                    "Paid visitor parking. Payment is generally " +
                    "required from 7 AM to midnight, daily.",
            };
        }

        return {
            status: "verify",
            reason:
                "Outside normal payment enforcement hours. " +
                "Verify overnight access and posted restrictions.",
        };
    }

    // rule 3: black sign parking
    if (lot.restrictionType === "black_sign") {
        if (outsidePermitHours) {
            return {
                status: "allowed",
                reason:
                    "Normal permit enforcement is not active. " +
                    "Check posted signs and event restrictions.",
            };
        }
        // during enforcement, evaluate permit category
        if (
            parkingType === "permit" &&
            matchesPermitCategory(lot, selectedPermit)
        ) {
            return {
                status: "verify",
                reason:
                    "This lot serves your permit category, " +
                    "but your specific parking assignment " +
                    "must authorize this area.",
            };
        }
        return {
            status: "restricted",
            reason:
                "Permit restrictions are currently enforced " +
                "from 7 AM to 4 PM on weekdays.",
        };
    }

    // rule 4: red sign parking
    if (lot.restrictionType === "red_sign") {
        if (
            parkingType === "permit" &&
            matchesPermitCategory(lot, selectedPermit)
        ) {
            return {
                status: "verify",
                reason:
                    "This lot is restricted 24 hours a day. " +
                    "Your permit category may be eligible, but " +
                    "you must have authorization for this specific lot.",
            };
        }

        return {
            status: "restricted",
            reason:
                "This lot is restricted 24 hours a day. " +
                "Your permit category is not eligible for this area.",
        };
    }

    // rule 5: special permit parking
    if (
        parkingType === "permit" &&
        selectedPermit === "special"
    ) {
        return {
            status: "verify",
            reason:
                "Special permit privileges depend on the " +
                "specific permit issued by UMD DOTS. " +
                "Check your permit conditions.",
        };
    }

    // default status for unimplemented rules
    return {
        status: "unknown",
        reason: "Unknown parking status. " +
            "Parking eligibility has not been evaluated for " +
            "this permit and lot combination.",
    };
}


