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
          className="md:hidden focus:outline-none"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 text-sm font-medium">
          <NavItem to="/">Donor List</NavItem>
          <NavItem to="/register">Register</NavItem>
          <NavItem to="/siteinfo">Site Info</NavItem>
          <NavItem to="/admin">Admin</NavItem>
        </ul>
      </div>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="md:hidden px-4 pb-4">
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
    "block px-3 py-2 rounded hover:bg-white hover:text-red-600 transition duration-200";
  return (
    <li>
      <Link to={to} onClick={onClick} className={baseStyle + (mobile ? " w-full" : "")}>
        {children}
      </Link>
    </li>
  );
}
