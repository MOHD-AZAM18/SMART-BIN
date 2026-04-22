import React from "react";
import {
  ArrowRight,
  Check,
  Zap,
  Landmark,
  Building2,
  Users,
} from "lucide-react";

function Pricing() {
  const plans = [
    {
      price: "Current Use",
      title: "Municipal Office",
      desc: "Designed for municipal offices, wards, and sanitation departments managing city operations.",
      features: [
        "Complaint Management",
        "Route Optimization",
        "Staff Reporting Dashboard",
        "Collection Monitoring",
        "Administrative Control"
      ]
    },
    {
      price: "Future Ready",
      title: "Public Expansion",
      desc: "Scalable for public waste collection, societies, campuses, and community services.",
      features: [
        "Citizen Reporting Portal",
        "Multi-Zone Operations",
        "Fleet Tracking",
        "Analytics & Insights",
        "Scalable Deployment"
      ]
    }
  ];

  return (
    <div className="container py-5 my-5">
      <div className="row align-items-center g-5">
        {/* Left Section */}
        <div className="col-lg-5 text-center text-lg-start">
          <h1 className="display-6 fw-bold text-dark mb-3">
            Built for Today, Ready for Tomorrow
          </h1>

          <p className="text-secondary lead mb-4">
            Currently developed for municipal office waste management operations,
            with future scalability for public waste collection systems and
            broader civic services.
          </p>

          <a
            href="#"
            className="btn btn-link text-primary fw-bold p-0 text-decoration-none d-inline-flex align-items-center gap-2 transition-all hover-gap"
          >
            View System Scope <ArrowRight size={20} />
          </a>
        </div>

        {/* Right Cards */}
        <div className="col-lg-7">
          <div className="row g-4">
            {plans.map((plan, index) => (
              <div key={index} className="col-md-6">
                <div
                  className={`card h-100 border-0 shadow-sm p-4 rounded-4 transition-all hover-up ${
                    index === 1 ? "border-primary-top" : ""
                  }`}
                >
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span
                        className={`badge rounded-pill px-3 py-2 ${
                          index === 1
                            ? "bg-primary text-white"
                            : "bg-light text-dark"
                        }`}
                      >
                        {plan.title}
                      </span>

                      {index === 1 ? (
                        <Users size={18} className="text-success" />
                      ) : (
                        <Building2 size={18} className="text-primary" />
                      )}
                    </div>

                    <h2 className="display-6 fw-bold mb-0">{plan.price}</h2>
                    <small className="text-muted">deployment model</small>
                  </div>

                  <p className="small text-muted mb-4">{plan.desc}</p>

                  <ul className="list-unstyled mb-0">
                    {plan.features.map((feature, i) => (
                      <li
                        key={i}
                        className="d-flex align-items-center gap-2 mb-2 small text-dark fw-medium"
                      >
                        <Check
                          size={16}
                          className="text-success"
                          strokeWidth={3}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-5 p-4 bg-dark rounded-4 text-white d-flex flex-column flex-md-row align-items-center justify-content-between shadow-lg">
        <div className="d-flex align-items-center gap-3 mb-3 mb-md-0">
          <div className="bg-white bg-opacity-10 p-3 rounded-circle">
            <Landmark size={24} className="text-primary" />
          </div>

          <div>
            <h5 className="mb-0 fw-bold">Future Expansion Ready</h5>
            <p className="mb-0 small opacity-75">
              Extendable for smart cities, public waste systems, and civic service platforms.
            </p>
          </div>
        </div>

        <button className="btn btn-primary px-4 py-2 rounded-pill fw-bold">
          Learn More
        </button>
      </div>

      <style>{`
        .hover-up:hover { transform: translateY(-10px); }
        .hover-gap:hover { gap: 12px !important; }
        .transition-all { transition: all 0.3s ease; }
        .border-primary-top { border-top: 5px solid #0d6efd !important; }

        .shadow-sm {
          box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075) !important;
        }
      `}</style>
    </div>
  );
}

export default Pricing;