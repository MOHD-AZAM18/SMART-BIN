import React, { useState, useEffect } from "react";
import axios from "axios";
import { Send, CheckCircle } from "lucide-react";

export default function ManualReport({ fetchBinsGlobal }) {
  const [bins, setBins] = useState([]);
  const [formData, setFormData] = useState({ binId: "", level: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:4000/api/bins").then(res => setBins(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:4000/api/complaints/register", {
        binId: formData.binId,
        reportedFillLevel: Number(formData.level)
      });
      
      if (fetchBinsGlobal) fetchBinsGlobal(); // Update global state
      
      // ✅ Show success alert
      alert("Report submitted successfully!");

      // ✅ Reset form so the sweeper can enter another report if needed
      setFormData({ binId: "", level: "" });

    } catch (err) {
      alert("Registration failed. Please check Bin ID.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card border-0 shadow-lg rounded-4 p-4 p-lg-5 bg-white">
            <div className="d-flex align-items-center gap-3 mb-4">
               <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary">
                  <CheckCircle size={24} />
               </div>
               <h3 className="fw-bold mb-0">Register Manual Report</h3>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="small fw-bold text-muted mb-2 text-uppercase">Select Bin</label>
                <select 
                  className="form-select form-select-lg border-0 bg-light shadow-none" 
                  value={formData.binId} 
                  onChange={(e)=>setFormData({...formData, binId: e.target.value})} 
                  required
                >
                  <option value="">Choose Bin ID...</option>
                  {bins.map(b => (
                    <option key={b.binId} value={b.binId}>
                      {b.binId} - {b.position}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="small fw-bold text-muted mb-2 text-uppercase">Observed Fill Level (%)</label>
                <input 
                  type="number" 
                  className="form-control form-control-lg border-0 bg-light shadow-none" 
                  placeholder="e.g. 85" 
                  min="0" 
                  max="100" 
                  value={formData.level} 
                  onChange={(e)=>setFormData({...formData, level: e.target.value})} 
                  required 
                />
              </div>

              <button 
                className="btn btn-primary btn-lg w-100 rounded-pill fw-bold shadow-sm py-3 mt-2" 
                disabled={loading}
              >
                {loading ? (
                  "Registering..."
                ) : (
                  <>
                    <Send size={18} className="me-2"/> Submit Report
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}