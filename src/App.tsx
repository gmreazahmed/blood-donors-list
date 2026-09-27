import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import BloodRequest from "./pages/BloodRequest";
import DonorRegister from "./pages/DonorRegister";
import DonorsList from "./pages/DonorsList";
import Home from "./pages/Home";
import SiteInfo from "./pages/SiteInfo";

/**
 * Scroll to the top whenever the route changes.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      {/* Accessibility: skip directly to main content */}
      <a
        href="#main-content"
        className="
          sr-only
          focus:not-sr-only
          focus:fixed
          focus:left-4
          focus:top-4
          focus:z-[9999]
          focus:rounded-xl
          focus:bg-red-600
          focus:px-4
          focus:py-3
          focus:text-sm
          focus:font-bold
          focus:text-white
          focus:shadow-xl
          focus:outline-none
          focus:ring-4
          focus:ring-red-200
        "
      >
        মূল কনটেন্টে যান
      </a>

      <ScrollToTop />

      <Navbar />

      <main id="main-content" className="flex-grow">
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Home />} />

          <Route path="/donors" element={<DonorsList />} />

          <Route path="/register" element={<DonorRegister />} />

          <Route path="/blood-request" element={<BloodRequest />} />

          <Route path="/siteinfo" element={<SiteInfo />} />

          {/* Admin pages */}
          <Route path="/admin-login" element={<AdminLogin />} />

          <Route path="/admin" element={<AdminPanel />} />

          {/* Unknown route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;