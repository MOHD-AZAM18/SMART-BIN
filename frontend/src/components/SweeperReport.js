import React, { useState, useEffect } from "react";
import axios from "axios";
import { ClipboardCheck, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function SweeperReport({ onReportSuccess }) {
  const [bins, setBins] = useState([]);
  const [formData, setFormData] = useState({ binId: "", level: "" });
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', msg: '' }
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Fetch valid Bin IDs for the dropdown
    axios.get("http://localhost:4000/api/bins")
      .then(res => setBins(res.data))
      .catch(err => console.error("Error loading bins", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const res = await axios.post("http://localhost:4000/api/complaints/register", {
        binId: formData.binId,
        reportedFillLevel: Number(formData.level)
      });
      
      setStatus({ type: 'success', msg: res.data.message });
      setFormData({ binId: "", level: "" });
      
      // Trigger a data refresh in the main Dashboard
      if (onReportSuccess) onReportSuccess();
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.message || "Submission failed" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4 animate-in">
      <div className="d-flex align-items-center gap-2 mb-3">
        <ClipboardCheck className="text-primary" size={20} />
        <h5 className="fw-bold mb-0">Manual Status Override</h5>
      </div>

      {status && (
        <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'} d-flex align-items-center gap-2 border-0 small`}>
          {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="row g-3 align-items-end">
        <div className="col-md-5">
          <label className="small fw-bold text-muted mb-1">SELECT BIN (PERMANENT ID)</label>
          <select 
            className="form-select border-light-subtle bg-light shadow-none"
            value={formData.binId}
            onChange={(e) => setFormData({...formData, binId: e.target.value})}
            required
          >
            <option value="">Choose a bin...</option>
            {bins.map(bin => (
              <option key={bin.binId} value={bin.binId}>{bin.binId} — {bin.position}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label className="small fw-bold text-muted mb-1">OBSERVED FILL LEVEL (%)</label>
          <input 
            type="number" min="0" max="100" 
            className="form-control border-light-subtle bg-light shadow-none"
            placeholder="e.g. 85"
            value={formData.level}
            onChange={(e) => setFormData({...formData, level: e.target.value})}
            required
          />
        </div>
        <div className="col-md-3">
          <button type="submit" className="btn btn-dark w-100 fw-bold py-2 rounded-3" disabled={submitting}>
            {submitting ? <Loader2 className="spin" size={18} /> : "Update Level"}
          </button>
        </div>
      </form>
    </div>
  );
}