import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart2, ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <div className="container py-5">
      <div className="row align-items-center g-5">
        <div className="col-lg-6 text-center text-lg-start animate-slide-in">
          <div className="d-flex align-items-center gap-2 justify-content-center justify-content-lg-start mb-3">
            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-bold">vLIVE</span>
            <span className="text-muted small fw-medium">Next-Gen Urban Sanitation</span>
          </div>
          <h1 className="display-3 fw-bold mb-4">Smart Waste, <br /><span className="text-primary">Cleaner Cities.</span></h1>
          <p className="lead text-secondary mb-5 pe-lg-5">Monitor and optimize waste collection through real-time manual reports and intelligent routing algorithms.</p>
          <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
            <button className="btn btn-primary btn-lg px-5 py-3 rounded-3 d-flex align-items-center gap-2">Signup Now <ArrowRight size={20} /></button>
            <Link to="/dashboard" className="text-decoration-none">
  <button className="btn btn-outline-dark btn-lg px-5 py-3 rounded-3 shadow-sm hover-up">
    View Live Demo
  </button>
</Link>
          </div>
        </div>
        <div className="col-lg-6 animate-fade-in text-center">
          <img src="media/images/HomemainLogo.png" className="img-fluid rounded-4 shadow-lg" alt="Dashboard" />
        </div>
      </div>
    </div>
  );
}