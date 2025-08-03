import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SiteInfo from "./pages/SiteInfo";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import BloodRequest from "./pages/BloodRequest";
import DonorRegister from "./pages/DonorRegister";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<DonorRegister/>} />
          <Route path="/siteinfo" element={<SiteInfo />} />
          <Route path="*" element={<Home />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/blood-request" element={<BloodRequest />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
