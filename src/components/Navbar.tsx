import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-red-600 to-red-900  text-white shadow-lg fixed w-full z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="bg-gradient-to-r from-white  to-gray-300 bg-clip-text text-transparent text-2xl font-bold tracking-wide hover:scale-105 transition-transform"
        >
          Rokto Data
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded cursor-pointer"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-sm font-semibold">
          <NavItem to="/">Donor List</NavItem>
          <NavItem to="/register">Register Donor</NavItem>
          <NavItem to="/blood-request">Request Blood</NavItem>
          <NavItem to="/siteinfo">Site Info</NavItem>
        </ul>
      </div>

      {/* Mobile Dropdown with Animation */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-gradient-to-r from-red-600 to-red-700 shadow-lg rounded-b"
          >
            <ul className="flex flex-col space-y-2 px-4 py-4 text-base">
              <NavItem to="/" mobile onClick={() => setOpen(false)}>
                Donor List
              </NavItem>
              <NavItem to="/register" mobile onClick={() => setOpen(false)}>
                Register Donor
              </NavItem>
              <NavItem to="/blood-request" mobile onClick={() => setOpen(false)}>
                Request Blood
              </NavItem>
              <NavItem to="/siteinfo" mobile onClick={() => setOpen(false)}>
                Site Info
              </NavItem>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavItem({
  to,
  children,
  mobile = false,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  mobile?: boolean;
  onClick?: () => void;
}) {
  const baseStyle =
    "block px-4 py-2 rounded-lg hover:bg-white hover:text-red-600 transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white";

  return (
    <li>
      <Link
        to={to}
        onClick={onClick}
        className={baseStyle + (mobile ? " w-full" : "")}
      >
        {children}
      </Link>
    </li>
  );
}
