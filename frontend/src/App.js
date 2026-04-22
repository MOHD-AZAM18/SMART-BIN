import React, { useEffect, useState, useCallback } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Layout & Global Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import HomePage from "./components/home/HomePage";
import NotFound from "./components/NotFound";
import Dashboard from "./components/Dashboard";
import BinsLocation from "./components/BinsLocation";
import AuthPage from "./components/AuthPage";
import About from "./components/About";

// Complaint System Components
import ManualReport from "./components/ManualReport";
import AllComplaints from "./components/AllComplaints";
import ComplaintMap from "./components/ComplaintMap";
import History from "./components/History";

// --- UPDATED: ML Intelligence Component ---
import PredictiveIntelligence from "./components/PredictiveIntelligence"; 

// API
import { getBins, getOptimizedRoute } from "./api";

import "./App.css";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const [bins, setBins] = useState([]);
  const [routeData, setRouteData] = useState({
    route: [],
    distance: 0,
    duration: { formatted: "0m" }
  });

  const [selectedBin, setSelectedBin] = useState(null);
  const [isApiLoading, setIsApiLoading] = useState(false);

  const fetchBins = useCallback(async () => {
    const data = await getBins();
    setBins(data);
  }, []);

  const fetchRoute = useCallback(async () => {
    setIsApiLoading(true);

    try {
      const data = await getOptimizedRoute();

      if (data && data.route) {
        setRouteData(data);
      }
    } catch (err) {
      console.error("App.js Route Error:", err);
    } finally {
      setIsApiLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBins();

    const interval = setInterval(fetchBins, 5000);

    return () => clearInterval(interval);
  }, [fetchBins]);

  return (
    <div className="app-container d-flex flex-column min-vh-100">
      <ScrollToTop />

      <Navbar />

      <main className="flex-grow-1">
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />

          {/* Auth */}
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route path="/login" element={<AuthPage mode="login" />} />

          {/* Bin Management */}
          <Route
            path="/bins-location"
            element={<BinsLocation bins={bins} fetchBins={fetchBins} />}
          />

          {/* Complaint System */}
          <Route
            path="/manual-report"
            element={<ManualReport fetchBinsGlobal={fetchBins} />}
          />
          <Route path="/all-complaints" element={<AllComplaints />} />
          <Route path="/complaint-map" element={<ComplaintMap />} />
          <Route path="/history" element={<History />} />

          {/* --- UPDATED: ML Intelligence Route --- */}
          <Route path="/intelligence" element={<PredictiveIntelligence />} />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <Dashboard
                bins={bins}
                route={routeData.route}
                distance={routeData.distance}
                duration={routeData.duration}
                selectedBin={selectedBin}
                setSelectedBin={setSelectedBin}
                fetchBins={fetchBins}
                fetchRoute={fetchRoute}
                loading={isApiLoading}
              />
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />

      <style>{`
        .app-container {
          animation: fadeIn 0.5s ease-in;
        }

        main {
          padding-top: 20px;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}