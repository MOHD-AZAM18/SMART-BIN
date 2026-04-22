import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";

const createCustomIcon = (fillLevel) => {
  const color = fillLevel > 80 ? "#ef4444" : "#22c55e"; 
  return L.divIcon({
    className: "custom-bin-marker",
    html: `<div style="background-color: ${color}; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.2); transition: all 0.3s ease;"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
};

const MapController = ({ route, bins }) => {
  const map = useMap();
  useEffect(() => {
    if (route && route.length > 0) {
      const bounds = L.latLngBounds(route.map(b => [b.location.lat, b.location.lng]));
      map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
    } else if (bins && bins.length > 0) {
        const bounds = L.latLngBounds(bins.map(b => [b.location.lat, b.location.lng]));
        map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [route, bins, map]);
  return null;
};

const RoutingPath = ({ route, itineraryRef, onRouteSync }) => {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!map || !route || route.length < 2) return;
    if (routingControlRef.current) map.removeControl(routingControlRef.current);

    const waypoints = route.map(bin => L.latLng(bin.location.lat, bin.location.lng));
    
    try {
      routingControlRef.current = L.Routing.control({
        waypoints: waypoints,
        lineOptions: {
          styles: [
            { color: "#4f46e5", weight: 8, opacity: 0.15 }, 
            { color: "#6366f1", weight: 4, opacity: 0.8 }
          ],
          extendToWaypoints: true,
        },
        show: true,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: false,
        createMarker: () => null,
      }).addTo(map);

      // ✅ Sync real-world road data back to the Dashboard
      routingControlRef.current.on('routesfound', (e) => {
        const summary = e.routes[0].summary;
        // Convert meters to km and seconds to minutes
        const realDist = (summary.totalDistance / 1000).toFixed(2);
        const realTime = Math.round(summary.totalTime / 60);
        
        if (onRouteSync) {
          onRouteSync(realDist, realTime);
        }
      });

      const routingContainer = routingControlRef.current.getContainer();
      if (itineraryRef.current && routingContainer) {
        itineraryRef.current.innerHTML = '';
        itineraryRef.current.appendChild(routingContainer);
      }
    } catch (err) { console.error(err); }

    return () => { if (routingControlRef.current && map) map.removeControl(routingControlRef.current); };
  }, [route, map, itineraryRef, onRouteSync]);

  return null;
};

export default function MapView({ bins = [], routeData = {}, itineraryRef, onRouteSync }) {
  const { route = [], distance = 0, duration = null } = routeData;

  return (
    <div className="map-wrapper shadow-sm rounded-4 overflow-hidden border h-100 position-relative">
      {/* Visual Overlay using Dashboard-synced data */}
      {route.length > 0 && duration && (
        <div className="position-absolute top-0 end-0 m-3 p-3 bg-white rounded-3 shadow-sm border" style={{ zIndex: 1000 }}>
          <div className="small text-muted fw-bold mb-1" style={{ fontSize: '0.7rem' }}>LIVE ROUTE INFO</div>
          <div className="fw-bold d-flex align-items-center mb-1">
            <span className="me-2">⏱️</span>{duration.formatted}
          </div>
          <div className="text-secondary small d-flex align-items-center">
            <span className="me-2">📏</span>{distance} km
          </div>
        </div>
      )}

      <MapContainer center={[28.3670, 79.4304]} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        <MapController route={route} bins={bins} />
        {bins.map((bin) => (
          <Marker key={bin._id || bin.binId} position={[bin.location.lat, bin.location.lng]} icon={createCustomIcon(bin.fillLevel)}>
            <Popup>
              <div className="p-1">
                <div className="fw-bold border-bottom mb-1">Bin {bin.binId}</div>
                <div className="small text-muted">{bin.fillLevel}% Full</div>
              </div>
            </Popup>
          </Marker>
        ))}
        {route && route.length > 0 && (
          <RoutingPath route={route} itineraryRef={itineraryRef} onRouteSync={onRouteSync} />
        )}
      </MapContainer>
    </div>
  );
}