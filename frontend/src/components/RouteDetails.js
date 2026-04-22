import React from "react";

const RouteDetails = ({ data, loading }) => {
  // If we are loading or there is no route data, don't show the component
  if (loading || !data || !data.route || data.route.length === 0) return null;

  // ✅ SAFE CONVERSION: Ensure distance is treated as a number
  // This prevents the ".toFixed is not a function" error
  const numericDistance = typeof data.distance === "number" 
    ? data.distance 
    : parseFloat(data.distance || 0);

  return (
    <div className="card shadow-sm border-0 rounded-4 animate__animated animate__fadeInUp">
      <div className="card-body bg-white rounded-4 d-flex justify-content-between align-items-center py-3 px-4">
        <div className="d-flex align-items-center">
          <div className="me-3 py-1 px-3 bg-light border rounded-pill shadow-sm">
            <span className="text-success fw-bold" style={{ fontSize: "0.85rem" }}>
              ● ACO: Optimized
            </span>
          </div>
          <span className="text-muted small">
            Collecting <strong>{data.route.length - 1}</strong> bins
          </span>
        </div>

        <div className="d-flex gap-4 align-items-center">
          {/* ✅ Display Time if available */}
          {data.duration && (
            <div className="text-end">
              <div className="text-muted small text-uppercase fw-bold" style={{ fontSize: "0.65rem" }}>
                Est. Time
              </div>
              <h5 className="mb-0 fw-bold text-dark">
                {data.duration.formatted}
              </h5>
            </div>
          )}

          {/* ✅ Display Distance Safely */}
          <div className="text-end border-start ps-4">
            <div className="text-muted small text-uppercase fw-bold" style={{ fontSize: "0.65rem" }}>
              Total Distance
            </div>
            <h5 className="mb-0 fw-bold text-primary">
              {numericDistance.toFixed(2)} km
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteDetails;