import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-12 text-sm text-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Section 1: Logo/Info */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-red-600">Rokto Data</h2>
          <p className="leading-relaxed text-justify">
            সাইটটি জনসেবামূলক উদ্দেশ্যে তৈরি করা হয়েছে এবং সকলের জন্য উন্মুক্ত।
            রক্তদাতারা সহজেই তথ্য হালনাগাদ করতে পারবেন এবং প্রয়োজনকারীরা দ্রুত রক্তদাতা খুঁজে পাবেন।
            বর্তমানে এটি সাতক্ষীরা জেলার কালিগঞ্জ উপজেলার জন্য চালু রয়েছে।
          </p>
        </div>

        {/* Section 2: Quick Links */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">Important Links</h3>
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
        </div>

        {/* Section 3: Contact */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">Contact</h3>
          <ul className="space-y-2">
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
            <li className="flex gap-4 mt-2">
              <a href="#" className="hover:text-red-600 transition-colors" aria-label="Facebook">
                Facebook
              </a>
              <a href="#" className="hover:text-red-600 transition-colors" aria-label="Instagram">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center border-t py-4 text-xs text-gray-500 select-none">
        &copy; {new Date().getFullYear()} Rokto Data. All rights reserved.
      </div>
    </footer>
  );
}
