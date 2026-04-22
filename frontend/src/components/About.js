import React from "react";
import { Target, Leaf, Route, Users, BarChart3, ShieldCheck } from "lucide-react";

function About() {
  const highlights = [
    {
      icon: <Leaf size={26} className="text-success" />,
      title: "Sustainable Operations",
      desc: "Promoting cleaner cities with smarter and eco-friendly waste collection practices."
    },
    {
      icon: <Route size={26} className="text-primary" />,
      title: "Smart Routing",
      desc: "Optimized collection routes reduce fuel usage, travel time, and operational costs."
    },
    {
      icon: <BarChart3 size={26} className="text-warning" />,
      title: "Actionable Insights",
      desc: "Track performance, monitor efficiency, and improve decision-making with reports."
    },
    {
      icon: <ShieldCheck size={26} className="text-info" />,
      title: "Reliable Management",
      desc: "Built for consistent daily operations with transparent workflow management."
    }
  ];

  return (
    <section className="container py-5 my-5">
      <div className="row align-items-center g-5">
        {/* Left Content */}
        <div className="col-lg-6">
          <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill mb-3">
            About Our Platform
          </span>

          <h1 className="display-5 fw-bold text-dark mb-4">
            Smarter Waste Management for Modern Cities
          </h1>

          <p className="text-secondary lead mb-4">
            Our platform helps streamline waste collection through route
            optimization, live operational updates, and data-driven planning.
            Designed to improve efficiency while supporting cleaner and greener
            urban environments.
          </p>

          <div className="row g-3 mb-4">
            <div className="col-sm-6">
              <div className="p-3 rounded-4 bg-light h-100">
                <Target className="text-primary mb-2" size={24} />
                <h6 className="fw-bold mb-1">Mission Driven</h6>
                <small className="text-muted">
                  Efficient systems built for long-term city improvement.
                </small>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="p-3 rounded-4 bg-light h-100">
                <Users className="text-success mb-2" size={24} />
                <h6 className="fw-bold mb-1">Community Focused</h6>
                <small className="text-muted">
                  Better public services through smarter waste operations.
                </small>
              </div>
            </div>
          </div>

          <button className="btn btn-primary px-4 py-2 rounded-pill fw-semibold">
            Learn More
          </button>
        </div>

        {/* Right Cards */}
        <div className="col-lg-6">
          <div className="row g-4">
            {highlights.map((item, index) => (
              <div key={index} className="col-md-6">
                <div className="card border-0 shadow-sm rounded-4 p-4 h-100 hover-up transition-all">
                  <div className="mb-3">{item.icon}</div>
                  <h5 className="fw-bold mb-2">{item.title}</h5>
                  <p className="text-muted small mb-0">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
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

export default About;