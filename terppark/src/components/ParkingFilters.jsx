/* filters for parking lot search */

import { useState } from "react";
import dropdownArrow from "../assets/dropdown-arrow.svg";

function ParkingFilters({
  parkingType,
  setParkingType,
  selectedPermit,
  setSelectedPermit,
  parkingTime,
  setParkingTime,
  selectedDateTime,
  setSelectedDateTime,
}) {

  const [isCollapsed, setIsCollapsed] = useState(false);

  // switches between visitor parking and permit parking
  function handleParkingTypeChange(event) {
    setParkingType(event.target.value);

    // clears the previous permit when switching modes
    setSelectedPermit("");
  }

 
return (
  <div className={`parking-filters ${isCollapsed ? "collapsed" : ""}`}>

        {/* Header with collapse button */}
        <div className="filter-header">
        <h2>Parking Filters</h2>

        <button
            type="button"
            className="collapse-button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand filters" : "Collapse filters"}
            aria-expanded={!isCollapsed}
        >
            <img
            src={dropdownArrow} alt=""
            className={`collapse-icon ${isCollapsed ? "rotated" : ""}`}
            />
        </button>
        </div>

        {/* Only show filter contents when expanded */}
        {!isCollapsed && (
        <div className="filter-content">

            {/* Parking access selection */}
            <div className="filter-section">
            <label htmlFor="parking-type">Parking Access</label>

            <select
                id="parking-type"
                value={parkingType}
                onChange={handleParkingTypeChange}
            >
                <option value="visitor">
                Visitor / No Permit
                </option>
                <option value="permit">
                I Have a UMD Parking Permit
                </option>
            </select>
            </div>

            {/* Only show permit selection for permit holders */}
            {parkingType === "permit" && (
            <div className="filter-section">
                <label htmlFor="permit-type">Permit Type</label>

                <select
                id="permit-type"
                value={selectedPermit}
                onChange={(event) =>
                    setSelectedPermit(event.target.value)
                }
                >
                <option value="">Select your permit</option>
                <option value="commuter">Student - Commuter</option>
                <option value="resident">Student - Resident</option>
                <option value="overnight">Student - Overnight Storage</option>
                <option value="staff">Faculty / Staff</option>
                <option value="special">Other / Special Permit</option>
                </select>
            </div>
            )}

            {/* Parking time selection */}
            <div className="filter-section">
            <label htmlFor="parking-time">When Are You Parking?</label>

            <select
                id="parking-time"
                value={parkingTime}
                onChange={(event) =>
                setParkingTime(event.target.value)
                }
            >
                <option value="now">Right Now</option>
                <option value="later">Choose Date & Time</option>
            </select>
            </div>

            {/* Show date/time input only when needed */}
            {parkingTime === "later" && (
            <div className="filter-section">
                <label htmlFor="parking-date">
                Parking Date & Time
                </label>

                <input
                id="parking-date"
                type="datetime-local"
                value={selectedDateTime}
                onChange={(event) =>
                    setSelectedDateTime(event.target.value)
                }
                />
            </div>
            )}

            {/* Information note */}
            <p className="filter-note">
            Parking eligibility depends on your assigned permit,
            posted lot signs, and applicable time restrictions.
            </p>

        </div>
        )}
    </div>
    );
}

export default ParkingFilters;
