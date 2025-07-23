import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-red-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-white text-2xl font-bold tracking-wide">
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
          <NavItem to="/siteinfo">Site Info</NavItem>
        </ul>
      </div>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 bg-red-600 rounded-b shadow-lg">
          <ul className="space-y-2 text-base">
            <NavItem to="/" mobile onClick={() => setOpen(false)}>
              Donor List
            </NavItem>
            <NavItem to="/register" mobile onClick={() => setOpen(false)}>
              Register
            </NavItem>
            <NavItem to="/siteinfo" mobile onClick={() => setOpen(false)}>
              Site Info
            </NavItem>
            <NavItem to="/admin" mobile onClick={() => setOpen(false)}>
              Admin
            </NavItem>
          </ul>
        </div>
      )}
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
    "block px-4 py-2 rounded hover:bg-white hover:text-red-600 transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white";
  return (
    <li>
      <Link to={to} onClick={onClick} className={baseStyle + (mobile ? " w-full" : "")}>
        {children}
      </Link>
    </li>
  );
}
