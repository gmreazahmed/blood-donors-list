import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-12 text-sm text-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Section 1: Logo/Name */}
        <div>
          <h2 className="text-xl font-bold text-red-600 mb-3">Rokto Data</h2>
          <p className="leading-relaxed">
            We work to connect blood donors and recipients easily, quickly, and reliably in your area.
          </p>
        </div>

        {/* Section 2: Quick Links */}
        <nav aria-label="Quick Links">
          <h3 className="font-semibold text-gray-800 mb-3">Important Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-red-600 transition-colors">
                Donor List
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-red-600 transition-colors">
                Register Donor
              </Link>
            </li>
            <li>
              <Link to="/siteinfo" className="hover:text-red-600 transition-colors">
                Site Info
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-red-600 transition-colors">
                Admin Panel
              </Link>
            </li>
          </ul>
        </nav>

        {/* Section 3: Contact */}
        <address className="not-italic">
          <h3 className="font-semibold text-gray-800 mb-3">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <span className="font-medium">Phone:</span>{" "}
              <a href="tel:+880123456789" className="hover:text-red-600 transition-colors">
                +880123456789
              </a>
            </li>
            <li>
              <span className="font-medium">Email:</span>{" "}
              <a href="mailto:support@roktodata.com" className="hover:text-red-600 transition-colors">
                support@roktodata.com
              </a>
            </li>
            <li className="flex gap-6 mt-3">
              <a href="#" className="hover:text-red-600 transition-colors" aria-label="Facebook">
                Facebook
              </a>
              <a href="#" className="hover:text-red-600 transition-colors" aria-label="Instagram">
                Instagram
              </a>
            </li>
          </ul>
        </address>
      </div>

      <div className="text-center border-t py-4 text-xs text-gray-500 select-none">
        &copy; {new Date().getFullYear()} Rokto Data. All rights reserved.
      </div>
    </footer>
  );
}
