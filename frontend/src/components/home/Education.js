import React from "react";
import {
  ClipboardCheck,
  Route,
  Truck,
  BarChart3,
  ArrowRight,
} from "lucide-react";

export default function ProjectFlow() {
  const steps = [
    {
      icon: <ClipboardCheck size={26} className="text-primary" />,
      title: "Report Collection",
      desc: "Waste issues and bin status are submitted manually through the reporting portal.",
    },
    {
      icon: <Route size={26} className="text-success" />,
      title: "Smart Route Planning",
      desc: "ACO optimization generates efficient collection routes for faster operations.",
    },
    {
      icon: <Truck size={26} className="text-warning" />,
      title: "Field Execution",
      desc: "Collection teams follow optimized routes and complete assigned tasks.",
    },
    {
      icon: <BarChart3 size={26} className="text-info" />,
      title: "Dashboard Monitoring",
      desc: "Admins track complaints, collection progress, and operational insights.",
    },
  ];

  return (
    <section className="container py-5 my-5">
      <div className="text-center mb-5">
        <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill mb-3">
          Project Workflow
        </span>

        <h2 className="display-6 fw-bold mb-3">
          How SmartSweep Works
        </h2>

        <p className="text-muted lead mx-auto" style={{ maxWidth: "700px" }}>
          A streamlined waste management solution designed for municipal offices
          to improve complaint handling, route planning, and collection
          efficiency.
        </p>
      </div>

      <div className="row g-4">
        {steps.map((step, index) => (
          <div key={index} className="col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100 text-center hover-up transition-all">
              <div className="mb-3">{step.icon}</div>

              <div className="small fw-bold text-primary mb-2">
                Step {index + 1}
              </div>

              <h5 className="fw-bold mb-3">{step.title}</h5>

              <p className="text-muted small mb-0">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-5">
        <button className="btn btn-primary px-4 py-2 rounded-pill fw-semibold d-inline-flex align-items-center gap-2">
          Explore Dashboard <ArrowRight size={18} />
        </button>
      </div>

      <style>{`
        .hover-up:hover {
          transform: translateY(-8px);
        }

        .transition-all {
          transition: all 0.3s ease;
        }

        .shadow-sm {
          box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075) !important;
        }
      `}</style>
    </section>
  );
}