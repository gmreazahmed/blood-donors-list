import { Link } from "react-router-dom";

export default function RegBtn() {
  return (
    <div className="fixed bottom-4 right-4 md:hidden z-50">
      <Link
        to="/register"
        className="bg-red-600 text-white px-4 py-2 rounded shadow-lg hover:bg-red-700 transition"
      >
        Register New Donor
      </Link>
    </div>
  );
}
