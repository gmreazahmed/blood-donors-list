import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-12 text-sm text-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Section 1: Logo/Name */}
        <div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Rokto Data</h2>
          <p className="text-sm leading-relaxed">
            আপনার এলাকায় সহজে, দ্রুত ও নির্ভরযোগ্যভাবে রক্তদাতা ও প্রাপককে সংযুক্ত করতে আমরা কাজ করি।
          </p>
        </div>

        {/* Section 2: Quick Links */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">প্রয়োজনীয় লিঙ্ক</h3>
          <ul className="space-y-1">
            <li><Link to="/" className="hover:text-red-600">রক্তদাতা তালিকা</Link></li>
            <li><Link to="/register" className="hover:text-red-600">রক্তদাতা নিবন্ধন</Link></li>
            <li><Link to="/siteinfo" className="hover:text-red-600">সাইট তথ্য</Link></li>
          </ul>
        </div>

        {/* Section 3: Contact */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">যোগাযোগ</h3>
          <ul className="space-y-1 text-sm">
            <li><span className="font-medium">ফোন:</span> +৮৮০১২৩৪৫৬৭৮৯</li>
            <li><span className="font-medium">ইমেইল:</span> support@roktodata.com</li>
            <li className="flex gap-4 mt-2">
              <a href="#" className="hover:text-red-600">Facebook</a>
              <a href="#" className="hover:text-red-600">Instagram</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center border-t py-4 text-xs text-gray-500">
        &copy; {new Date().getFullYear()} রক্ত ডেটা. সর্বস্বত্ব সংরক্ষিত।
      </div>
    </footer>
  );
}
