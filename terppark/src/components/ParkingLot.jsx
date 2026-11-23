import { Polygon, Popup, Tooltip } from "react-leaflet";
import "./ParkingLot.css";

//status colors
const statusStyles = {
    allowed: {
        color: "#22c55e",
        fillColor: "#22c55e",
        fillOpacity: 0.25,
        weight: 3,
        textColor: "#15803d",
    },
    restricted: {
        color: "#ef4444",
        fillColor: "#ef4444",
        fillOpacity: 0.25,
        weight: 3,
        textColor: "#b91c1c",
    },
    verify: {
        color: "#9ca3af",
        fillColor: "#9ca3af",
        fillOpacity: 0.25,
        weight: 3,
        textColor: "#4b5563",
    },
    unknown: {
        color: "#9ca3af",
        fillColor: "#9ca3af",
        fillOpacity: 0.25,
        weight: 3,
        textColor: "#4b5563",
    },
    paid: {
        color: "#3b82f6",
        fillColor: "#3b82f6",
        fillOpacity: 0.25,
        weight: 3,
        textColor: "#1d4ed8",
    },
    event: {
        color: "#f59e0b",
        fillColor: "#f59e0b",
        fillOpacity: 0.25,
        weight: 3,
        textColor: "#b45309",
    },
};

// labels
const statusLabels = {
    allowed: "Unrestricted",
    restricted: "Restricted",
    verify: "Verify Eligibility",
    unknown: "Unknown",
    paid: "Paid Parking",
    event: "Event Restrictions",
};

// permit category names
const permitLabels = {
    commuter: "Commuter",
    resident: "Resident",
    overnight: "Overnight Storage",
    faculty_staff: "Faculty / Staff",
    visitor: "Visitor",
    unknown: "Unverified",
};

// general enforcement hours
const restrictionLabels = {
    black_sign: "Mon–Fri, 7AM – 4PM",
    red_sign: "24 hours, 7 days a week",
    visitor_paid: "Daily, 7AM – 12AM",
};

function ParkingLot({
    lot,
    status = "unknown",
    reason = "",
    zoom = 16
}) {
  const style = statusStyles[status] || statusStyles.unknown;

    // gets the permit categories associated with the lot
    const permits = lot.permitCategory || [];

    // gets the normal enforcement hours for the lot
    const enforcementHours =
        restrictionLabels[lot.restrictionType] ||
        "See posted parking signs";

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
    {zoom >= 16 && (
       <Tooltip
          key={`${lot.id}-${status}`}
          permanent
          direction="center"
          className={`parking-lot-label parking-lot-label-${status}`}
          >
          {lot.code}
        </Tooltip>
        )}
            {/* parking information popup */}
            <Popup
                className="parking-popup"
                maxWidth={320}
                minWidth={260}
            >
                <div className="parking-card">

                    {/* header lot name and status */}
                    <div className="parking-card-header">
                        <div>
                            <h3>{lot.displayName}</h3>
                            <span className="parking-card-code">
                                Lot Code: {lot.code}
                            </span>
                        </div>

                        <span
                            className={`parking-status parking-status-${status}`}
                        >
                            {statusLabels[status] || "Unknown"}
                        </span>
                    </div>

                    {/* lot description */}
                    {lot.description && (
                        <p className="parking-card-description">
                            {lot.description}
                        </p>
                    )}

                    <div className="parking-card-divider" />

                    {/* parking permit categories */}
                    <div className="parking-card-section">
                        <span className="parking-card-section-title">
                            PARKING CATEGORIES
                        </span>

                        <div className="parking-permits">
                            {permits.map((permit) => (
                                <span
                                    className="parking-permit-tag"
                                    key={permit}
                                >
                                    {permitLabels[permit] || permit}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* normal enforcement hours */}
                    <div className="parking-card-section">
                        <span className="parking-card-section-title">
                            NORMAL ENFORCEMENT
                        </span>

                        <p className="parking-card-value">
                            {enforcementHours}
                        </p>
                    </div>

                    {/*parking eligibility explanation */}
                    <div className="parking-card-result">
                        <strong>Your Parking Status</strong>
                        <p>
                            {reason ||
                                "Parking eligibility has not been verified."}
                        </p>
                    </div>

                    {/* Parking disclaimer */}
                    <p className="parking-card-disclaimer">
                        TerpPark can be wrong. Always follow
                        posted UMD DOTS signage and event restrictions.
                    </p>
                </div>
            </Popup>
        </Polygon>
    );
}

export default ParkingLot;