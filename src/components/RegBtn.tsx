import { Link } from "react-router-dom";

export default function RegBtn() {
  return (
    <div className="fixed bottom-5 right-5 md:hidden z-50">
      <Link
        to="/register"
        className="bg-red-600 text-white px-5 py-5 rounded-full shadow-lg hover:bg-red-700 transition 
                   flex items-center justify-center font-medium text-sm select-none
                   active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        aria-label="Register New Donor"
      >
        নতুন ডোনার যোগ করুন
      </Link>
    </div>
  );
}
