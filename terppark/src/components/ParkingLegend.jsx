
import "./ParkingLegend.css";

export default function ParkingLegend() {
    return (
        <div className="parking-legend">
            <h3>Parking Status</h3>

            <div className="legend-item">
                <span className="legend-color allowed"></span>
                <span>Normally Unrestricted</span>
            </div>

            <div className="legend-item">
                <span className="legend-color restricted"></span>
                <span>Restricted</span>
            </div>

            <div className="legend-item">
                <span className="legend-color unknown"></span>
                <span>Unknown / Verify</span>
            </div>

            <div className="legend-item">
                <span className="legend-color paid"></span>
                <span>Paid Parking</span>
            </div>

            <div className="legend-item">
                <span className="legend-color event"></span>
                <span>Event Restrictions</span>
            </div>
        </div>
    );
}
