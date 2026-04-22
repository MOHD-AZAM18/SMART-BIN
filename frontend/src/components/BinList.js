import React from "react";
import { Trash2, AlertCircle, CheckCircle2 } from "lucide-react";

const BinList = ({ bins = [] }) => {
  // Logic to determine color and icon based on fill level
  const getStatusMetrics = (level) => {
    if (level >= 80) return { color: "text-danger", bg: "bg-danger", icon: <AlertCircle size={16} /> };
    if (level >= 50) return { color: "text-warning", bg: "bg-warning", icon: <AlertCircle size={16} /> };
    return { color: "text-success", bg: "bg-success", icon: <CheckCircle2 size={16} /> };
  };

  return (
    <div className="bg-white">
      {/* Search/Filter can be added here in the future */}
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="bg-light sticky-top" style={{ zIndex: 1 }}>
            <tr>
              <th className="ps-4 py-3 small fw-bold text-uppercase text-muted">ID</th>
              <th className="py-3 small fw-bold text-uppercase text-muted">Status</th>
              <th className="py-3 small fw-bold text-uppercase text-muted">Location</th>
              <th className="text-end pe-4 py-3 small fw-bold text-uppercase text-muted">Fill Level</th>
            </tr>
          </thead>
          <tbody>
            {bins.length > 0 ? (
              bins.map((bin) => {
                const metrics = getStatusMetrics(bin.fillLevel);
                return (
                  <tr key={bin.binId || bin._id} className="transition-all">
                    <td className="ps-4 fw-bold text-dark">{bin.binId}</td>
                    <td>
                      <div className={`d-flex align-items-center gap-1 small fw-bold ${metrics.color}`}>
                        {metrics.icon}
                        {bin.fillLevel >= 80 ? "CRITICAL" : bin.fillLevel >= 50 ? "WARNING" : "OPTIMAL"}
                      </div>
                    </td>
                    <td className="text-muted small">
                      {bin.position || "Coordinates: " + bin.location.lat.toFixed(2)}
                    </td>
                    <td className="pe-4">
                      <div className="d-flex align-items-center justify-content-end gap-3">
                        <div className="progress flex-grow-1 d-none d-md-flex" style={{ height: "6px", minWidth: "80px", maxWidth: "120px" }}>
                          <div 
                            className={`progress-bar ${metrics.bg}`} 
                            style={{ width: `${bin.fillLevel}%` }}
                          ></div>
                        </div>
                        <span className="fw-bold small">{bin.fillLevel}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-5 text-muted">
                  <Trash2 size={40} className="mb-2 opacity-25" />
                  <p>No containers found in this sector.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .transition-all { transition: background 0.2s ease; }
        .progress { background-color: #f0f0f0; border-radius: 10px; }
        .table-hover tbody tr:hover { background-color: #f8f9ff !important; }
      `}</style>
    </div>
  );
};

export default BinList;