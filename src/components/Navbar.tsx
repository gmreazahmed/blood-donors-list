import { AnimatePresence, motion } from "framer-motion";
import {
  Heart,
  Menu,
  Search,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
} from "react-router-dom";

type NavItem = {
  label: string;
  path: string;
};

const navItems: NavItem[] = [
  {
    label: "রক্তদাতা",
    path: "/donors",
  },
  {
    label: "রক্তদাতা হোন",
    path: "/register",
  },
  {
    label: "রক্তের অনুরোধ",
    path: "/blood-request",
  },
  {
    label: "তথ্য",
    path: "/siteinfo",
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  /*
   * Close mobile menu after route change.
   */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /*
   * Prevent background scrolling while mobile menu is open.
   */
  useEffect(() => {
    if (!open) return;

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        originalOverflow;
    };
  }, [open]);

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(path);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <nav
          aria-label="প্রধান নেভিগেশন"
          className="border-b border-slate-200/70 bg-white/85 shadow-sm backdrop-blur-xl"
        >
          <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* =========================
                LOGO
            ========================== */}
            <Link
              to="/"
              aria-label="RoktoData হোমপেজ"
              className="group flex items-center gap-2.5"
            >
             <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-lg shadow-red-600/20">
                <img
                  src="/roktoData.png"
                  alt="RoktoData logo"
                  className="h-full w-full object-contain p-1.5"
                />
              </div>

              <div className="leading-none">
                <span className="block text-lg font-black tracking-tight text-slate-900 sm:text-xl">
                  Rokto<span className="text-red-600">Data</span>
                </span>

                <span className="mt-1 hidden text-[10px] font-semibold tracking-wide text-slate-400 sm:block">
                  BLOOD DONOR DIRECTORY
                </span>
              </div>
            </Link>

            {/* =========================
                DESKTOP NAV
            ========================== */}
            <div className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <DesktopNavItem
                  key={item.path}
                  to={item.path}
                  active={isActive(item.path)}
                >
                  {item.label}
                </DesktopNavItem>
              ))}
            </div>

            {/* =========================
                DESKTOP CTA
            ========================== */}
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/donors"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <Search
                  size={16}
                  aria-hidden="true"
                />

                খুঁজুন
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-red-600/20 transition hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <UserPlus
                  size={16}
                  aria-hidden="true"
                />

                ডোনার হোন
              </Link>
            </div>

            {/* =========================
                MOBILE MENU BUTTON
            ========================== */}
            <button
              type="button"
              aria-label={
                open
                  ? "মেনু বন্ধ করুন"
                  : "মেনু খুলুন"
              }
              aria-expanded={open}
              aria-controls="mobile-navigation"
              onClick={() => setOpen((value) => !value)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 md:hidden"
            >
              {open ? (
                <X
                  size={23}
                  aria-hidden="true"
                />
              ) : (
                <Menu
                  size={23}
                  aria-hidden="true"
                />
              )}
            </button>
          </div>

          {/* =========================
              MOBILE NAV
          ========================== */}
          <AnimatePresence>
            {open && (
              <>
                {/* Backdrop */}
                <motion.button
                  type="button"
                  aria-label="মোবাইল মেনু বন্ধ করুন"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setOpen(false)}
                  className="fixed inset-0 top-[72px] -z-10 bg-slate-950/20 backdrop-blur-[2px] md:hidden"
                />

                <motion.div
                  id="mobile-navigation"
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="overflow-hidden border-t border-slate-100 bg-white md:hidden"
                >
                  <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
                    {/* Mobile CTA */}
                    <div className="mb-3 grid grid-cols-2 gap-2">
                      <Link
                        to="/donors"
                        onClick={() =>
                          setOpen(false)
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-sm"
                      >
                        <Search
                          size={16}
                          aria-hidden="true"
                        />

                        ডোনার খুঁজুন
                      </Link>

                      <Link
                        to="/register"
                        onClick={() =>
                          setOpen(false)
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
                      >
                        <UserPlus
                          size={16}
                          aria-hidden="true"
                        />

                        ডোনার হোন
                      </Link>
                    </div>

                    {/* Navigation */}
                    <ul className="space-y-1">
                      {navItems.map((item) => (
                        <MobileNavItem
                          key={item.path}
                          to={item.path}
                          active={isActive(
                            item.path
                          )}
                          onClick={() =>
                            setOpen(false)
                          }
                        >
                          {item.label}
                        </MobileNavItem>
                      ))}
                    </ul>

                    {/* Brand note */}
                    <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                      <p className="text-sm font-bold text-slate-900">
                        RoktoData
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        কালীগঞ্জের রক্তদাতা খুঁজে
                        পাওয়ার সহজ প্ল্যাটফর্ম।
                      </p>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* Fixed navbar spacer */}
      <div
        aria-hidden="true"
        className="h-[72px]"
      />
    </>
  );
}

/* =====================================================
   DESKTOP NAV ITEM
===================================================== */

function DesktopNavItem({
  to,
  children,
  active,
}: {
  to: string;
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={`relative rounded-xl px-3.5 py-2.5 text-sm font-bold transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
        active
          ? "bg-red-50 text-red-700"
          : "text-slate-600 hover:bg-slate-50 hover:text-red-600"
      }`}
    >
      {children}

      {active && (
        <motion.span
          layoutId="active-nav"
          className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-red-600"
        />
      )}
    </Link>
  );
}

/* =====================================================
   MOBILE NAV ITEM
===================================================== */

function MobileNavItem({
  to,
  children,
  active,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <Link
        to={to}
        onClick={onClick}
        className={`flex min-h-12 items-center rounded-xl px-4 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
          active
            ? "bg-red-50 text-red-700"
            : "text-slate-700 hover:bg-slate-50 hover:text-red-600"
        }`}
      >
        {children}
      </Link>
    </li>
  );
}