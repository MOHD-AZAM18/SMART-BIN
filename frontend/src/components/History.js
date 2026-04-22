import React, { useState } from "react";
import {
  Search,
  Calendar,
  FileText,
  AlertCircle,
  Loader2,
  ChevronRight,
  Clock,
  MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getHistory } from "../api";

const History = () => {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchHistory = async (e) => {
    e.preventDefault();

    if (!filters.startDate || !filters.endDate) {
      setError("Please select a valid date range.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getHistory(filters.startDate, filters.endDate);
      setComplaints(data);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Connection Refused: Ensure your backend server is running.";

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateValue) => {
    if (!dateValue) return { date: "N/A", time: "" };

    const date = new Date(dateValue);

    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  return (
    <div className="history-page min-vh-100 py-5 bg-light">
      <div className="container">
        <div className="mb-5 text-center text-md-start">
          <h2 className="fw-bold text-dark">Administrative History</h2>
          <p className="text-secondary">
            Filter and review all past service requests and complaint records.
          </p>
        </div>

        {/* Filters */}
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-5 glass-card">
          <form onSubmit={fetchHistory} className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label small fw-bold text-muted text-uppercase">
                From
              </label>

              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Calendar size={18} className="text-primary" />
                </span>

                <input
                  type="date"
                  name="startDate"
                  className="form-control border-start-0 shadow-none"
                  value={filters.startDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-bold text-muted text-uppercase">
                To
              </label>

              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Calendar size={18} className="text-primary" />
                </span>

                <input
                  type="date"
                  name="endDate"
                  className="form-control border-start-0 shadow-none"
                  value={filters.endDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="col-md-4">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100 py-2 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Search size={20} />
                )}

                {loading ? "Searching..." : "Fetch Records"}
              </button>
            </div>
          </form>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-danger small d-flex align-items-center gap-2"
            >
              <AlertCircle size={14} />
              {error}
            </motion.div>
          )}
        </div>

        {/* Table */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-white border-bottom">
                <tr>
                  <th className="ps-4 py-3 text-muted small fw-bold">ID</th>
                  <th className="py-3 text-muted small fw-bold">LOCATION</th>
                  <th className="py-3 text-muted small fw-bold">DATE & TIME</th>
                  <th className="py-3 text-muted small fw-bold">STATUS</th>
                  <th className="py-3 text-center text-muted small fw-bold">
                    ACTION
                  </th>
                </tr>
              </thead>

              <tbody>
                <AnimatePresence>
                  {complaints.length > 0 ? (
                    complaints.map((c, index) => {
                      const formatted = formatDateTime(c.createdAt);

                      return (
                        <motion.tr
                          key={c._id || index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="align-middle"
                        >
                          <td className="ps-4 py-3 fw-medium">
                            #{c.binId || index + 101}
                          </td>

                          <td>
                            <div className="d-flex align-items-center gap-1 text-secondary small">
                              <MapPin size={14} />
                              {c.position || "Bareilly"}
                            </div>
                          </td>

                          <td>
                            <div className="small">
                              <div className="d-flex align-items-center gap-1 text-dark fw-medium">
                                <Calendar size={14} />
                                {formatted.date}
                              </div>

                              <div className="d-flex align-items-center gap-1 text-muted mt-1">
                                <Clock size={13} />
                                {formatted.time}
                              </div>
                            </div>
                          </td>

                          <td>
                            <span
                              className={`status-tag ${
                                c.status?.toLowerCase() || "pending"
                              }`}
                            >
                              {c.status || "Pending"}
                            </span>
                          </td>

                          <td className="text-center">
                            <button className="btn btn-sm btn-light rounded-circle shadow-sm">
                              <ChevronRight size={16} />
                            </button>
                          </td>
                        </motion.tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-5">
                        <div className="py-4">
                          <FileText
                            size={48}
                            className="text-light mb-3"
                          />

                          <h6 className="text-muted">
                            No data available for this range.
                          </h6>

                          <p className="text-secondary small">
                            Try adjusting your filters above.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .glass-card {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0,0,0,0.05);
        }

        .status-tag {
          padding: 4px 12px;
          border-radius: 50px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .status-tag.resolved {
          background: #dcfce7;
          color: #166534;
        }

        .status-tag.pending {
          background: #fef9c3;
          color: #854d0e;
        }

        .status-tag.active {
          background: #dbeafe;
          color: #1e40af;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .table thead th {
          letter-spacing: 0.5px;
        }
      `}</style>
    </div>
  );
};

export default History;