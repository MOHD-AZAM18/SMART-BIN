import React from "react";
import { Route, Truck, Clock, Recycle } from "lucide-react";

export default function Awards() {
  const features = [
    { icon: <Recycle className="text-success" />, title: "Green Routes", desc: "Eco-friendly disposal" },
    { icon: <Truck className="text-info" />, title: "Fleet Tracking", desc: "Live GPS tracking" },
    { icon: <Clock className="text-warning" />, title: "Live Updates", desc: "Real-time field status reports" },
    { icon: <Route className="text-danger" />, title: "Technical Optimization", desc: "AI-based route optimization" },
  ];

  return (
    <div className="container py-5">
      <div className="row align-items-center g-5">
        <div className="col-lg-6 text-center animate-fade-in">
          <img src="media/images/awards.jpg" className="img-fluid rounded-4 shadow-lg border" alt="Award" />
        </div>
        <div className="col-lg-6 ps-lg-5">
          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-bold mb-3">TRUSTED NATIONWIDE</span>
          <h2 className="display-5 fw-bold mb-4">Leading Smart Waste <br /><span className="text-primary">Solution in India</span></h2>
          <div className="row g-4">
            {features.map((f, i) => (
              <div key={i} className="col-sm-6">
                <div className="d-flex gap-3 align-items-start">
                  <div className="p-2 bg-light rounded-3 shadow-sm">{f.icon}</div>
                  <div>
                    <h6 className="fw-bold mb-1">{f.title}</h6>
                    <p className="small text-muted mb-0">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}