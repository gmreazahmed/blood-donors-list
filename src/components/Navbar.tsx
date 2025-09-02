import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-red-600 to-red-900  text-white shadow-lg fixed w-full z-50 ">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="bg-gradient-to-r from-white  to-gray-300 bg-clip-text text-transparent text-2xl font-bold tracking-wide hover:scale-105 transition-transform flex gap-2 items-center"
        >
          <img
            className="w-[15px] sm:w-[16px] md:w-[20px] lg:w-[24px] xl:w-[32px] 2xl:w-[36px]"
            src="https://th.bing.com/th/id/R.c933a03de613e862e69643898bd31a1e?rik=wVKcEouBfo2vtg&riu=http%3a%2f%2fnurex.it%2fwp-content%2fuploads%2f2021%2f12%2fcropped-blood.jpg&ehk=59DSBXEbwbaJoPx%2bt0LadiyOjBhRnbylVHn7zUlG4%2bg%3d&risl=&pid=ImgRaw&r=0"
            alt="lodading"
          />
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
        <ul className="hidden md:flex gap-[11px] sm:gap-[12px] md:gap-[13px] lg:gap-[14px] xl:gap-[15px] 2xl:gap-[16px] text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] font-semibold">
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
              <NavItem
                to="/blood-request"
                mobile
                onClick={() => setOpen(false)}
              >
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
  const baseStyle = `
  block px-4 py-2
  rounded-[52.222px]
  transition-all duration-300 ease-in-out
  hover:bg-[linear-gradient(180deg,rgba(5,5,31,0.10)_20%,rgba(255,255,255,0.10)_100%)]
  hover:shadow-md
  cursor-pointer
`;

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
