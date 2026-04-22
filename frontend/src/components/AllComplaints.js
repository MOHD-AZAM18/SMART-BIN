import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Clock, 
  Zap, 
  Map as MapIcon, 
  ChevronRight, 
  Trash2, 
  Search, 
  RefreshCw, 
  CalendarDays,
  CheckCircle2
} from "lucide-react";

export default function AllComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const navigate = useNavigate();

  /**
   * ✅ FETCH LOGIC: Filtered for the present date only
   * This ensures that as soon as the date changes, the list resets automatically.
   */
  const fetchComplaints = useCallback(async () => {
    setIsSyncing(true);
    try {
      const res = await axios.get("http://127.0.0.1:4000/api/complaints");
      
      // Get today's date in local format (e.g., "19/4/2026")
      const today = new Date().toLocaleDateString();

      // Filter: Only include complaints created today
      const todaysData = res.data.filter(complaint => {
        const complaintDate = new Date(complaint.createdAt).toLocaleDateString();
        return complaintDate === today;
      });

      setComplaints(todaysData);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    } finally {
      // Small delay for smooth UI feel
      setTimeout(() => setIsSyncing(false), 600);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
    // Auto-sync every 60 seconds to catch new reports throughout the day
    const interval = setInterval(fetchComplaints, 60000);
    return () => clearInterval(interval);
  }, [fetchComplaints]);

  // Handle single log deletion
  const handleDelete = async (id) => {
    if (window.confirm("Permanent Action: Are you sure you want to remove this report from the logs?")) {
      try {
        await axios.delete(`http://127.0.0.1:4000/api/complaints/${id}`);
        setComplaints(complaints.filter(c => c._id !== id));
      } catch (err) {
        alert("Server error: Could not delete log. Check backend connection.");
      }
    }
  };

  // Filter logic based on search input
  const filteredComplaints = complaints.filter(c => 
    c.binId.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.position && c.position.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const isListEmpty = filteredComplaints.length === 0;

  return (
    <div className="container py-5 mt-5">
      {/* --- HEADER SECTION --- */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-0 text-dark tracking-tight">Daily Complaint Logs</h2>
          <div className="d-flex align-items-center gap-2 mt-1">
            <CalendarDays size={14} className="text-primary" />
            <p className="text-primary small fw-bold mb-0">
              Active Session: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="d-flex align-items-center gap-3">
          {/* --- REFRESH BUTTON --- */}
          <button 
            onClick={fetchComplaints} 
            className={`btn btn-white shadow-sm border rounded-circle d-flex align-items-center justify-content-center p-2 hover-lift ${isSyncing ? 'rotate-sync bg-light' : ''}`}
            style={{ width: "42px", height: "42px", transition: "all 0.2s ease" }}
            title="Sync Today's Data"
            disabled={isSyncing}
          >
            <RefreshCw size={18} className={isSyncing ? "text-primary" : "text-muted"} />
          </button>

          {/* --- TACTICAL ROUTE BUTTON --- */}
          <button 
            onClick={() => navigate("/complaint-map")}
            disabled={complaints.length === 0}
            className="btn btn-tactical d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-lg fw-bold border-0 position-relative overflow-hidden"
          >
            <div className="tactical-shimmer"></div>
            <Zap size={18} className="fill-white" />
            <span className="position-relative z-1">Generate route ({complaints.length})</span>
            <ChevronRight size={16} className="position-relative z-1" />
          </button>
        </div>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="mb-4 position-relative">
        <div className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
          <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Filter today's reports by ID or Street..." 
          className="form-control border-0 shadow-sm ps-5 py-3 rounded-4"
          style={{ fontSize: "1rem" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light border-bottom">
              <tr className="small fw-bold text-muted">
                <th className="ps-4 py-3">REPORT TIME</th>
                <th className="py-3">BIN ID</th>
                <th className="py-3">STREET LOCATION</th>
                <th className="py-3">FILL LEVEL</th>
                <th className="py-3 text-center">STATUS</th>
                <th className="py-3 text-end pe-4">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((c) => (
                <tr key={c._id} className="animate-fade-in">
                  <td className="ps-4">
                    <div className="d-flex align-items-center gap-2 small text-secondary">
                      <Clock size={14} /> 
                      {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-dark-subtle text-dark rounded-2 px-2 py-1 fw-bold">
                      {c.binId}
                    </span>
                  </td>
                  <td className="small text-muted text-truncate" style={{ maxWidth: "250px" }}>
                    {c.position || "Unknown Location"}
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="progress flex-grow-1" style={{ height: "6px", maxWidth: "80px", backgroundColor: "#f1f5f9" }}>
                        <div 
                          className={`progress-bar ${c.reportedFillLevel >= 90 ? 'bg-danger' : 'bg-warning'}`} 
                          style={{ width: `${c.reportedFillLevel}%`, borderRadius: "10px" }}
                        ></div>
                      </div>
                      <span className="small fw-bold">{c.reportedFillLevel}%</span>
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="d-flex align-items-center justify-content-center gap-1 text-success">
                      <CheckCircle2 size={14} />
                      <span className="small fw-bold">Live</span>
                    </div>
                  </td>
                  <td className="text-end pe-4">
                    <button 
                      onClick={() => handleDelete(c._id)}
                      className="btn btn-outline-danger btn-sm border-0 rounded-circle p-2 hover-delete"
                      title="Remove from Today's Log"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              
              {isListEmpty && (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <div className="py-4">
                      <CalendarDays size={48} className="text-muted opacity-25 mb-3" />
                      <h5 className="fw-bold text-muted">Clear for {new Date().toLocaleDateString()}</h5>
                      <p className="text-muted small">No emergency reports have been submitted yet today.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .tracking-tight { letter-spacing: -0.025em; }

        .hover-lift:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
          background-color: #fff !important;
        }

        .btn-tactical {
          background: #0f172a;
          color: #fff;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-tactical:hover:not(:disabled) {
          background: #ef4444; 
          transform: translateY(-1px);
          box-shadow: 0 10px 20px -5px rgba(239, 68, 68, 0.4);
        }

        .tactical-shimmer {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.15), transparent);
          transition: all 0.6s;
        }

        .btn-tactical:hover .tactical-shimmer { left: 100%; }

        .hover-delete:hover {
          background-color: #fff1f2 !important;
          color: #e11d48 !important;
        }

        .rotate-sync { animation: spin 1s infinite linear; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}