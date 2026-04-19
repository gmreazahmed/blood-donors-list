import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const navItems = [
    { label: "Donors", path: "/" },
    { label: "Register", path: "/register" },
    { label: "Request", path: "/blood-request" },
    { label: "Info", path: "/siteinfo" },
  ];

  return (
    <nav className="fixed w-full z-50 backdrop-blur-md bg-white/70 border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold text-red-600 hover:scale-105 transition"
        >
          🩸 RoktoData
        </Link>

        {/* Mobile Button */}
        <button
          className="md:hidden text-gray-800"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-2 text-sm font-medium">
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-t shadow-md"
          >
            <ul className="flex flex-col px-4 py-4 gap-2">
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
  return (
    <li>
      <Link
        to={to}
        onClick={onClick}
        className={`
          px-4 py-2 rounded-full transition-all duration-300
          ${mobile ? "w-full block" : ""}
          ${
            active
              ? "bg-red-500 text-white shadow"
              : "text-gray-700 hover:bg-red-50 hover:text-red-600"
          }
        `}
      >
        {children}
      </Link>
    </li>
  );
}