import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import MapView from "./MapView"; 
import { 
  Zap, 
  Navigation, 
  MapPin, 
  Clock, 
  ArrowRight, 
  ClipboardList, 
  Droplets, 
  Smartphone, 
  Copy,
  X
} from "lucide-react";

export default function ComplaintMap() {
  // ✅ CONFIGURATION: Define IP at the top so it's accessible everywhere
  // Replace this with your laptop's actual IP address for mobile testing
  const localIP = "192.168.1.5"; 

  const [data, setData] = useState({ 
    route: [], 
    distance: 0, 
    duration: { formatted: "0m", totalMinutes: 0 },
    fuelNeeded: 0 
  });
  const [loading, setLoading] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const itineraryRef = useRef(null);

  const FUEL_EFFICIENCY = 3.0; // km per liter

  // ✅ Logic to generate the link
  const generateMobileLink = () => {
    return `http://${localIP}:3000/complaint-map`;
  };

  const fetchEmergencyRoute = async () => {
    setLoading(true);
    try {
      // Ensure backend target matches your current port (4000)
      const res = await axios.get("http://localhost:4000/api/route/complaint-optimization");
      setData(res.data);
    } catch (err) {
      console.error("No active critical complaints found.");
    } finally {
      setLoading(false);
    }
  };

  const handleRouteSync = useCallback((realDist, realMins) => {
    const distanceNum = Number(realDist);
    const fuel = distanceNum / FUEL_EFFICIENCY;

    setData(prev => ({
      ...prev,
      distance: distanceNum,
      fuelNeeded: fuel,
      duration: {
        totalMinutes: realMins,
        formatted: realMins > 60 
          ? `${Math.floor(realMins / 60)}h ${realMins % 60}m` 
          : `${realMins}m`
      }
    }));
  }, []);

  useEffect(() => { fetchEmergencyRoute(); }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateMobileLink());
    alert("Mobile link copied! Send this to the driver.");
  };

  return (
    <div className="container-fluid py-4 px-lg-5 mt-5 bg-light min-vh-100">
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-dark d-flex align-items-center gap-2">
            <div className="p-2 bg-danger rounded-3 shadow-sm">
              <Zap size={24} className="text-white" />
            </div>
            Emergency Dispatch
          </h2>
          <p className="text-muted ms-md-5 ps-md-2 small">Tactical routing for critical bin overflows</p>
        </div>
        
        <div className="d-flex gap-2">
          <button 
            className={`btn ${showShareMenu ? 'btn-primary' : 'btn-outline-primary'} rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2`}
            onClick={() => setShowShareMenu(!showShareMenu)}
          >
            <Smartphone size={18} />
            {showShareMenu ? "Close Share" : "Send to Driver"}
          </button>
          
          <button className="btn btn-dark rounded-pill px-4 fw-bold shadow-sm" onClick={fetchEmergencyRoute}>
            Recalculate Path
          </button>
        </div>
      </div>

      {/* Share Overlay: QR Code and Link */}
      {showShareMenu && (
        <div className="card border-0 shadow-lg rounded-4 p-4 mb-4 bg-white animate-fade-in border-start border-primary border-4">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h5 className="fw-bold mb-1">Mobile Access Interface</h5>
              <p className="text-muted small">Drivers can scan the QR code to load this live tactical map on their device.</p>
            </div>
            <button className="btn btn-light rounded-circle p-1" onClick={() => setShowShareMenu(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="d-flex flex-column flex-md-row align-items-center gap-4 mt-3">
            <div className="bg-white p-2 rounded border shadow-sm">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(generateMobileLink())}`} 
                alt="QR Code"
                style={{ width: '140px', height: '140px' }}
              />
            </div>
            <div className="flex-grow-1 w-100">
              <label className="small fw-bold text-muted mb-2 uppercase tracking-wider">Direct Access URL</label>
              <div className="input-group mb-3">
                <input type="text" className="form-control bg-light border-0 py-2" value={generateMobileLink()} readOnly />
                <button className="btn btn-primary px-3" onClick={copyToClipboard}>
                  <Copy size={18} />
                </button>
              </div>
              <div className="p-3 bg-warning bg-opacity-10 border border-warning border-opacity-25 rounded-3">
                <p className="small text-warning-emphasis mb-0">
                  <strong>Network Sync:</strong> Ensure the phone is connected to <strong>{localIP}</strong> (the same Wi-Fi network) to resolve the local server address.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row g-4">
        {/* Map Column */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden" style={{ height: "600px" }}>
            <MapView 
              bins={data.route} 
              routeData={data} 
              itineraryRef={itineraryRef} 
              onRouteSync={handleRouteSync}
            />
          </div>

          {/* Stats Bar */}
          <div className="row g-3 mt-1">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-3 d-flex flex-row align-items-center gap-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-3 text-primary"><Navigation size={24} /></div>
                <div>
                  <div className="text-muted small fw-bold text-uppercase">Distance</div>
                  <div className="fs-5 fw-bold">{typeof data.distance === 'number' ? data.distance.toFixed(2) : 0} KM</div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-3 d-flex flex-row align-items-center gap-3">
                <div className="bg-success bg-opacity-10 p-3 rounded-3 text-success"><Clock size={24} /></div>
                <div>
                  <div className="text-muted small fw-bold text-uppercase">Travel Time</div>
                  <div className="fs-5 fw-bold">{data.duration?.formatted || "0m"}</div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-3 d-flex flex-row align-items-center gap-3">
                <div className="bg-warning bg-opacity-10 p-3 rounded-3 text-warning"><Droplets size={24} /></div>
                <div>
                  <div className="text-muted small fw-bold text-uppercase">Est. Fuel</div>
                  <div className="fs-5 fw-bold">{data.fuelNeeded > 0 ? data.fuelNeeded.toFixed(1) : 0} L</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Itinerary Column */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-lg rounded-4 d-flex flex-column" style={{ height: "720px" }}>
            <div className="card-header bg-dark text-white p-4 border-0 rounded-top-4">
              <div className="d-flex align-items-center gap-2">
                <MapPin size={20} className="text-primary" />
                <span className="fw-bold fs-5">Live Itinerary</span>
              </div>
            </div>
            
            <div 
              ref={itineraryRef} 
              id="directions-panel"
              className="card-body overflow-auto custom-scrollbar bg-white p-0"
            >
              {!data.route.length && !loading && (
                <div className="h-100 d-flex flex-column align-items-center justify-content-center p-5 text-center text-muted">
                  <ClipboardList size={40} className="mb-2 opacity-20" />
                  <p className="small">No critical bins detected for optimization.</p>
                </div>
              )}
              {loading && (
                <div className="h-100 d-flex flex-column align-items-center justify-content-center p-5 text-center text-muted">
                  <div className="spinner-border text-primary mb-3" role="status"></div>
                  <p className="small">Calculating optimized path...</p>
                </div>
              )}
            </div>

            <div className="card-footer bg-light p-3 border-0 rounded-bottom-4">
              <button className="btn btn-outline-dark w-100 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2">
                Print Manifest <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
}