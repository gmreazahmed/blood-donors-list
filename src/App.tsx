import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import SiteInfo from "./pages/SiteInfo";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/siteinfo" element={<SiteInfo />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
