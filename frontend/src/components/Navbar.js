import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  List,
  User,
  LayoutDashboard,
  Home,
  AlertCircle,
  ClipboardList,
  Menu,
  X,
  ChevronDown,
  History,
  Info,
  BrainCircuit, // <--- Added for ML Intelligence
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);

  const navItems = [
    { path: "/", icon: <Home size={18} />, label: "Home" },
    {
      path: "/dashboard",
      icon: <LayoutDashboard size={18} />,
      label: "Optimized Route",
    },
    {
      path: "/manual-report",
      icon: <AlertCircle size={18} />,
      label: "Manual Report",
    },
    {
      path: "/about",
      icon: <Info size={18} />,
      label: "About",
    },
  ];

  const adminSubItems = [
    { path: "/bins-location", icon: <List size={16} />, label: "Bin Manager" },
    {
      path: "/all-complaints",
      icon: <ClipboardList size={16} />,
      label: "All Complaints",
    },
    { 
      path: "/intelligence", // <--- NEW: ML Route path
      icon: <BrainCircuit size={16} />, // <--- NEW: ML Icon
      label: "ML Intelligence Hub" // <--- NEW: Label
    },
    { path: "/history", icon: <History size={16} />, label: "History" },
  ];

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;

    return `nav-link px-3 py-2 rounded-pill d-flex align-items-center gap-2 ${
      isActive ? "active-link" : "inactive-link"
    }`;
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="navbar glass-navbar fixed-top py-3"
      >
        <div className="container px-4 d-flex align-items-center justify-content-between">
          {/* Logo */}
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src="media/images/mainlogo1.png"
              style={{ width: "120px", height: "auto" }}
              alt="SmartSweep Logo"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="d-none d-lg-flex align-items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                className={getLinkClass(item.path)}
                to={item.path}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}

            {/* Admin Dropdown */}
            <div
              className="position-relative"
              onMouseEnter={() => setAdminDropdownOpen(true)}
              onMouseLeave={() => setAdminDropdownOpen(false)}
            >
              <button className="nav-link px-3 py-2 rounded-pill d-flex align-items-center gap-2 border-0 bg-transparent">
                <User size={18} />
                <span>Admin</span>

                <ChevronDown
                  size={14}
                  className={`transition-transform ${
                    adminDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {adminDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="dropdown-container"
                  >
                    {adminSubItems.map((sub) => (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        className="dropdown-item d-flex align-items-center gap-2"
                      >
                        {sub.icon}
                        <span>{sub.label}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="nav-divider mx-2"></div>

            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
              <Link
                className="btn btn-auth rounded-pill px-4 py-2 d-flex align-items-center gap-2"
                to="/signup"
              >
                <User size={16} />
                <span>Sign In</span>
              </Link>
            </motion.div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="mobile-btn d-lg-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mobile-menu d-lg-none"
            >
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={getLinkClass(item.path)}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}

              <div className="px-3 py-2 fw-bold text-muted small text-uppercase">
                Admin Portal
              </div>

              {adminSubItems.map((sub) => (
                <Link
                  key={sub.path}
                  to={sub.path}
                  className={getLinkClass(sub.path)}
                  onClick={() => setMenuOpen(false)}
                >
                  {sub.icon}
                  <span>{sub.label}</span>
                </Link>
              ))}

              <Link
                to="/signup"
                className="btn btn-auth rounded-pill mt-3 py-2 d-flex align-items-center justify-content-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <User size={16} />
                <span>Sign In</span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Existing Styles... */}
      <style>{`
        body { padding-top: 90px; }
        .glass-navbar {
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .nav-link {
          font-size: 0.9rem;
          color: #64748b;
          text-decoration: none;
          transition: 0.2s;
        }
        .nav-link:hover {
          color: #0f172a;
          background: #f1f5f9;
        }
        .active-link {
          color: #0f172a !important;
          background: #f1f5f9;
          font-weight: 600;
        }
        .dropdown-container {
          position: absolute;
          top: 100%;
          left: 0;
          width: 220px;
          background: white;
          border-radius: 12px;
          padding: 8px;
          margin-top: 8px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          border: 1px solid rgba(0,0,0,0.05);
          z-index: 1000;
        }
        .dropdown-item {
          padding: 10px 12px;
          border-radius: 8px;
          color: #64748b;
          text-decoration: none;
          font-size: 0.85rem;
          transition: 0.2s;
        }
        .dropdown-item:hover {
          background: #f8fafc;
          color: #0f172a;
        }
        .rotate-180 {
          transform: rotate(180deg);
        }
        .transition-transform {
          transition: transform 0.2s ease;
        }
        .nav-divider {
          width: 1px;
          height: 20px;
          background: #e2e8f0;
        }
        .btn-auth {
          background: #0f172a;
          color: white;
          border: none;
          font-size: 0.85rem;
        }
        .mobile-btn {
          border: none;
          background: transparent;
        }
        .mobile-menu {
          position: absolute;
          top: 80px;
          left: 15px;
          right: 15px;
          background: white;
          padding: 20px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
      `}</style>
    </>
  );
}

export default Navbar;