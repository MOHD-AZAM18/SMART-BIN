import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { Navigation, ClipboardList, Zap, Info } from "lucide-react";
import MapView from "./MapView";
import BinList from "./BinList";
import RouteDetails from "./RouteDetails";

export default function Dashboard() {
  const [bins, setBins] = useState([]);
  const [routeData, setRouteData] = useState({ 
    route: [], 
    distance: 0, 
    duration: { formatted: "0m", totalMinutes: 0 } 
  });
  const [loading, setLoading] = useState(false);
  const itineraryRef = useRef(null);

  const fetchAllData = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/bins");
      if (Array.isArray(res.data)) setBins(res.data);
    } catch (err) { console.error("Sync Error:", err); }
  }, []);

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  // ✅ SYNC FUNCTION: Updates Dashboard state with Map's real road data
  const handleRouteSync = useCallback((realDist, realMins) => {
    setRouteData(prev => ({
      ...prev,
      distance: realDist,
      duration: {
        totalMinutes: realMins,
        formatted: realMins > 60 
          ? `${Math.floor(realMins / 60)}h ${realMins % 60}m` 
          : `${realMins}m`
      }
    }));
  }, []);

  const handleGenerateRoute = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/api/route");
      if (res.data) setRouteData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-bg py-4 px-3 px-lg-5 min-vh-100 bg-light">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-dark">Command Center</h2>
          <div className="d-flex gap-3">
             <button className="btn btn-white btn-sm border shadow-sm rounded-pill px-3" onClick={fetchAllData}>Sync Data</button>
             <div className="badge bg-white text-dark border shadow-sm p-2 px-3 d-flex align-items-center rounded-pill">
                <div className="pulse-green me-2"></div>System Online
             </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4" style={{ height: "450px" }}>
               {/* Passed onRouteSync to keep time/distance identical */}
               <MapView 
                  bins={bins} 
                  routeData={routeData} 
                  itineraryRef={itineraryRef} 
                  onRouteSync={handleRouteSync} 
                />
            </div>
            
            <div className="row g-3 mb-4">
              <div className="col-md-7"><RouteDetails data={routeData} loading={loading} /></div>
              <div className="col-md-5">
                <button className="btn btn-primary w-100 h-100 rounded-4 shadow py-4" onClick={handleGenerateRoute} disabled={loading}>
                  <Zap size={24} className="mb-2" />
                  <div className="fw-bold fs-5">{loading ? "Optimizing..." : "Compute Route"}</div>
                </button>
              </div>
            </div>

            <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
              <div className="card-header bg-white py-3 border-0 d-flex align-items-center gap-2">
                <ClipboardList size={18} className="text-primary" />
                <span className="fw-bold">Asset Inventory</span>
              </div>
              <div className="card-body p-0 overflow-auto custom-scrollbar" style={{ height: "300px" }}>
                <BinList bins={bins} />
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm border-0 rounded-4 d-flex flex-column sticky-top" style={{ height: "calc(100vh - 120px)", top: "20px" }}>
              <div className="card-header bg-dark text-white p-4 border-0 rounded-top-4 d-flex align-items-center gap-2">
                <Navigation size={20} /> <span className="fw-bold">Smart Itinerary</span>
              </div>
              <div ref={itineraryRef} className="card-body overflow-auto bg-white p-0 custom-scrollbar flex-grow-1" id="directions-panel">
                {!routeData.route.length && (
                  <div className="h-100 d-flex flex-column align-items-center justify-content-center p-5 text-center text-muted">
                    <Info size={40} className="mb-3 opacity-50" />
                    <p className="small">Generate route to see instructions.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .pulse-green { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); } }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
        #directions-panel .leaflet-routing-container { width: 100% !important; border: none !important; padding: 1rem !important; margin: 0 !important; }
      `}</style>
    </div>
  );
}