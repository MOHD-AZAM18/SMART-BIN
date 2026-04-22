import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { MapPin, RefreshCw, Search, Plus, Trash2, X, Navigation, Crosshair, Eraser } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- Leaflet Icon Fix ---
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- Helper: Auto-recenter map ---
const RecenterMap = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 16, { animate: true });
  }, [coords, map]);
  return null;
};

// --- Click map to set Coordinates ---
const MapClickHandler = ({ onLocationSelect, active }) => {
  useMapEvents({
    click(e) {
      if (active) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
};

const BinsLocation = () => {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCoords, setActiveCoords] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBin, setNewBin] = useState({ binId: "", lat: "", lng: "", position: "" });

  // ✅ Clear Form Logic
  const clearForm = () => {
    setNewBin({ binId: "", lat: "", lng: "", position: "" });
  };

  const fetchBins = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:4000/api/bins");
      if (Array.isArray(response.data)) setBins(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBins(); }, [fetchBins]);

  const handleLocationSelect = (lat, lng) => {
    setNewBin(prev => ({ ...prev, lat: lat.toFixed(6), lng: lng.toFixed(6) }));
  };

  const handleAddBin = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        binId: newBin.binId,
        location: { lat: parseFloat(newBin.lat), lng: parseFloat(newBin.lng) },
        position: newBin.position,
        fillLevel: 0
      };
      await axios.post("http://localhost:4000/api/bins", payload);
      clearForm();
      setShowAddForm(false);
      fetchBins();
    } catch (error) {
      alert("Error adding bin.");
    }
  };

  const handleDeleteBin = async (id) => {
    if (window.confirm("Permanent delete this bin?")) {
      try {
        await axios.delete(`http://localhost:4000/api/bins/${id}`);
        fetchBins();
      } catch (error) {
        alert("Error deleting bin.");
      }
    }
  };

  const filteredBins = bins.filter(bin => 
    bin.binId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bin.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-wrapper py-5 bg-light min-vh-100 mt-5">
      <div className="container">
        
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h1 className="display-6 fw-bold text-dark mb-0">City Fleet</h1>
            <p className="text-secondary small text-uppercase fw-semibold tracking-wider">
              SmartSweep • Logistics Hub
            </p>
          </div>
          <div className="d-flex gap-2">
            <button 
              className={`btn ${showAddForm ? 'btn-danger shadow-danger-subtle' : 'btn-primary shadow-primary-subtle'} btn-action border-0 px-4`}
              onClick={() => {
                setShowAddForm(!showAddForm);
                if (showAddForm) clearForm();
              }}
              style={{ minWidth: "150px" }}
            >
              {showAddForm ? <X size={18} /> : <Plus size={18} />}
              <span className="ms-2 fw-bold">{showAddForm ? "Cancel" : "Add New Bin"}</span>
            </button>
            <button className="btn btn-white btn-action border shadow-sm" onClick={fetchBins} disabled={loading}>
              <RefreshCw size={18} className={loading ? 'spin' : ''} />
            </button>
          </div>
        </div>

        {/* Add Bin Form */}
        {showAddForm && (
          <div className="card border-0 shadow-lg mb-5 rounded-4 animate-in overflow-hidden">
            <div className="card-header bg-dark p-3 text-white small fw-bold tracking-widest text-uppercase d-flex justify-content-between align-items-center">
              <span>Registration Portal</span>
              <button 
                type="button" 
                className="btn btn-sm btn-link text-warning text-decoration-none fw-bold"
                onClick={clearForm}
              >
                <Eraser size={14} className="me-1" /> Clear Details
              </button>
            </div>
            <div className="card-body p-4 p-lg-5">
              <form onSubmit={handleAddBin} className="row g-3">
                <div className="col-md-2">
                  <label className="small fw-bold text-muted mb-1">BIN ID</label>
                  <input type="text" className="form-control custom-input" placeholder="e.g. B-102" required
                    value={newBin.binId} onChange={(e) => setNewBin({...newBin, binId: e.target.value})} />
                </div>
                <div className="col-md-2">
                  <label className="small fw-bold text-muted mb-1 text-primary"><Crosshair size={12}/> LATITUDE</label>
                  <input type="number" step="any" className="form-control custom-input" placeholder="28.XXX" required
                    value={newBin.lat} onChange={(e) => setNewBin({...newBin, lat: e.target.value})} />
                </div>
                <div className="col-md-2">
                  <label className="small fw-bold text-muted mb-1 text-primary"><Crosshair size={12}/> LONGITUDE</label>
                  <input type="number" step="any" className="form-control custom-input" placeholder="79.XXX" required
                    value={newBin.lng} onChange={(e) => setNewBin({...newBin, lng: e.target.value})} />
                </div>
                <div className="col-md-3">
                  <label className="small fw-bold text-muted mb-1">STREET ADDRESS</label>
                  <input type="text" className="form-control custom-input" placeholder="Locality Name" required
                    value={newBin.position} onChange={(e) => setNewBin({...newBin, position: e.target.value})} />
                </div>
                <div className="col-md-3 d-flex align-items-end gap-2">
                  <button type="button" className="btn btn-light border py-2 fw-bold text-muted flex-grow-1" onClick={clearForm}>
                    Reset
                  </button>
                  <button type="submit" className="btn btn-primary py-2 fw-bold shadow flex-grow-1">
                    Deploy Bin
                  </button>
                </div>
              </form>
              <div className="mt-3 text-center">
                <small className="text-muted"><Crosshair size={14} className="text-primary"/> <strong>Pro Tip:</strong> Click directly on the map to auto-fill GPS coordinates.</small>
              </div>
            </div>
          </div>
        )}

        <div className="row g-4">
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden bg-white">
              <div className="card-header bg-white p-4 border-0">
                <div className="input-group search-bar rounded-pill border px-3 py-1 bg-light">
                  <Search size={18} className="text-muted mt-2" />
                  <input type="text" className="form-control border-0 bg-transparent ps-2 shadow-none" placeholder="Search fleet..." onChange={(e) => setSearchTerm(e.target.value)}/>
                </div>
              </div>

              <div className="table-responsive" style={{ maxHeight: "600px" }}>
                <table className="table table-borderless align-middle mb-0">
                  <thead className="bg-light sticky-top" style={{ zIndex: 5 }}>
                    <tr>
                      <th className="ps-4 py-3 small text-muted text-uppercase fw-bold">Bin Details</th>
                      <th className="text-end pe-4 py-3 small text-muted text-uppercase fw-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBins.map((bin) => (
                      <tr key={bin._id} className="bin-row border-bottom transition-all" onClick={() => setActiveCoords([bin.location.lat, bin.location.lng])}>
                        <td className="ps-4 py-4">
                          <div className="d-flex align-items-center">
                            <div className="icon-badge me-3 shadow-sm">
                              <MapPin size={20} />
                            </div>
                            <div>
                              <div className="fw-bold text-dark fs-5">{bin.binId}</div>
                              <div className="text-secondary small">{bin.position || "Address Not Set"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-end pe-4">
                          <div className="d-flex justify-content-end gap-2">
                            <button className="btn btn-icon btn-light border" title="Focus Map">
                              <Navigation size={16} />
                            </button>
                            <button 
                              className="btn btn-icon btn-outline-danger" 
                              onClick={(e) => { e.stopPropagation(); handleDeleteBin(bin._id); }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card border-0 shadow-sm sticky-top rounded-4 overflow-hidden" style={{ top: '85px', zIndex: 10 }}>
              <div className="card-header bg-white p-3 fw-bold border-0 d-flex justify-content-between">
                Fleet View
                {showAddForm && <span className="text-primary small fw-normal animate-pulse">● Map Picking Active</span>}
              </div>
              <div className="card-body p-0">
                <div style={{ height: "550px", position: "relative" }}>
                  <MapContainer center={[28.3670, 79.4304]} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                    <RecenterMap coords={activeCoords} />
                    <MapClickHandler onLocationSelect={handleLocationSelect} active={showAddForm} />
                    {bins.map((bin) => (
                      <Marker key={bin.binId} position={[bin.location.lat, bin.location.lng]}>
                        <Popup className="custom-popup">
                          <div className="p-1">
                            <h6 className="fw-bold mb-1">{bin.binId}</h6>
                            <p className="small text-muted mb-0">{bin.position}</p>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .shadow-primary-subtle { box-shadow: 0 4px 14px 0 rgba(13, 110, 253, 0.3) !important; }
        .shadow-danger-subtle { box-shadow: 0 4px 14px 0 rgba(220, 53, 69, 0.3) !important; }
        
        .custom-input { 
          border: 1px solid #dee2e6; 
          border-radius: 10px; 
          padding: 0.6rem 1rem;
          transition: all 0.2s;
        }
        .custom-input:focus { border-color: #0d6efd; box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1); transform: translateY(-1px); }

        .bin-row:hover { background-color: #f8fafc !important; }
        .icon-badge { background: #eff6ff; color: #2563eb; padding: 12px; border-radius: 12px; }
        
        .btn-icon { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 8px; transition: 0.2s; }
        .btn-icon:hover { transform: scale(1.05); }

        .animate-pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }

        .spin { animation: rotate 1s linear infinite; }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .tracking-widest { letter-spacing: 0.15em; }
        .animate-in { animation: slideIn 0.4s ease-out; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default BinsLocation;