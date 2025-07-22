import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-red-600 text-white px-4 py-3 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-semibold">
        <h1 className="text-xl font-bold">Rokto Data</h1>
        </Link>

        {/* Logo */}

        {/* Mobile menu toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation links */}
        <ul className={`md:flex gap-6 ${open ? "block mt-4" : "hidden"} md:mt-0`}>
          <li><Link to="/" className="block py-1">Donor List</Link></li>
          <li><Link to="/register" className="block py-1">Register</Link></li>
          <li><Link to="/siteinfo" className="block py-1">Site Info</Link></li>
          <li><Link to="/admin" className="block py-1">Admin</Link></li>
        </ul>
      </div>
    </nav>
  );
}
