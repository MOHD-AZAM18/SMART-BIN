import React from "react";
import { Link } from "react-router-dom";
import { Twitter, Linkedin, Github, Mail, MapPin, Phone } from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-section bg-white border-top pt-5 pb-4">
      <div className="container">
        <div className="row g-4 mb-5">
          {/* Brand & Mission */}
          <div className="col-lg-4 col-md-6">
            <Link to="/" className="d-block mb-3">
              <img src="media/images/mainlogo1.png" alt="SmartSweep Logo" style={{ width: "130px" }} />
            </Link>
            <p className="text-secondary small pe-lg-5 mb-4">
              Pioneering intelligent waste management solutions for a cleaner, 
              more sustainable India. Optimize routes, monitor bins, and 
              reduce carbon footprints in real-time.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="social-link"><Twitter size={18} /></a>
              <a href="#" className="social-link"><Linkedin size={18} /></a>
              <a href="#" className="social-link"><Github size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-dark mb-4">Platform</h6>
            <ul className="list-unstyled footer-links">
              <li><Link to="/dashboard">Optimized Route</Link></li>
              <li><Link to="/bins-location">Fleet Manager</Link></li>
              <li><Link to="/pricing">Pricing Plans</Link></li>
              <li><Link to="/signup">Get Started</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-dark mb-4">Company</h6>
            <ul className="list-unstyled footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/press">Press Kit</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="col-lg-4 col-md-6">
            <h6 className="fw-bold text-dark mb-4">Contact Us</h6>
            <ul className="list-unstyled text-secondary small">
              <li className="d-flex align-items-center gap-3 mb-3">
                <MapPin size={18} className="text-primary" />
                <span>Bareilly IT Park, Uttar Pradesh, India</span>
              </li>
              <li className="d-flex align-items-center gap-3 mb-3">
                <Phone size={18} className="text-primary" />
                <span>+91 123 456 7890</span>
              </li>
              <li className="d-flex align-items-center gap-3 mb-3">
                <Mail size={18} className="text-primary" />
                <span>support@smartsweep.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-top pt-4">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <p className="text-muted small mb-0">
                &copy; {currentYear} ASA Technologies. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
              <span className="text-muted small">
                Developed for Sustainable Urban Development
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .footer-section {
          background-image: radial-gradient(circle at top right, rgba(13, 110, 253, 0.02) 0%, rgba(255, 255, 255, 0) 25%);
        }
        
        .footer-links li {
          margin-bottom: 12px;
        }

        .footer-links a {
          color: #6c757d;
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .footer-links a:hover {
          color: #0d6efd;
          padding-left: 5px;
        }

        .social-link {
          color: #adb5bd;
          transition: color 0.2s ease;
        }

        .social-link:hover {
          color: #0d6efd;
        }

        .fw-bold { font-weight: 700 !important; }
      `}</style>
    </footer>
  );
}

export default Footer;