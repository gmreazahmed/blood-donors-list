import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-12 text-sm text-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Section 1: Logo/Name */}
        <div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Rokto Data</h2>
          <p>Connecting donors and recipients easily, reliably, and quickly in your local area.</p>
        </div>

        {/* Section 2: Quick Links */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li><Link to="/" className="hover:text-red-600">Donor List</Link></li>
            <li><Link to="/register" className="hover:text-red-600">Register Donor</Link></li>
            <li><Link to="/siteinfo" className="hover:text-red-600">Site Info</Link></li>
          </ul>
        </div>

        {/* Section 3: Contact */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Contact</h3>
          <ul className="space-y-1">
            <li><span className="font-medium">Phone:</span> +880123456789</li>
            <li><span className="font-medium">Email:</span> support@roktodata.com</li>
            <li className="flex gap-4 mt-2">
              {/* Replace these with actual icons if needed */}
              <a href="#" className="hover:text-red-600">Facebook</a>
              <a href="#" className="hover:text-red-600">Instagram</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center border-t py-4 text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Rokto Data. All rights reserved.
      </div>
    </footer>
  );
}
