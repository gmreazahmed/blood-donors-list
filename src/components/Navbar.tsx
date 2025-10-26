import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const navItems = [
    { label: "Donor List", path: "/" },
    { label: "Register Donor", path: "/register" },
    { label: "Request Blood", path: "/blood-request" },
    { label: "Site Info", path: "/siteinfo" },
  ];

  return (
    <nav className="bg-gradient-to-r from-red-600 to-red-900 text-white shadow-lg fixed w-full z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent 
          text-2xl font-bold tracking-wide hover:scale-105 transition-transform"
        >
          Rokto Data
        </Link>

        {/* Mobile Button */}
        <button
          className="md:hidden focus:outline-none rounded"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-4 text-sm font-semibold">
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              to={item.path}
              active={pathname === item.path}
            >
              {item.label}
            </NavItem>
          ))}
        </ul>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-red-700 shadow-lg"
          >
            <ul className="flex flex-col space-y-2 px-4 py-4 text-base">
              {navItems.map((item) => (
                <NavItem
                  key={item.path}
                  to={item.path}
                  mobile
                  active={pathname === item.path}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </NavItem>
              ))}
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
  active,
  mobile = false,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  active?: boolean;
  mobile?: boolean;
  onClick?: () => void;
}) {
  const baseStyle = `
    block px-4 py-2 rounded-full transition-all duration-300 cursor-pointer 
    hover:bg-white/10 hover:shadow-md
  `;

  return (
    <li>
      <Link
        to={to}
        onClick={onClick}
        className={`${baseStyle} ${mobile ? "w-full" : ""} ${
          active ? "bg-white/20 font-bold" : ""
        }`}
      >
        {children}
      </Link>
    </li>
  );
}
