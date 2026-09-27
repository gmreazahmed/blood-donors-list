import { Link } from "react-router-dom";
import { Heart, UserPlus } from "lucide-react";

export default function RegBtn() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 md:hidden pointer-events-none">
      <div className="mx-auto max-w-md pointer-events-auto">
        <Link
          to="/register"
          aria-label="রক্তদাতা হিসেবে নিবন্ধন করুন"
          className="group flex w-full items-center justify-center gap-2.5 rounded-2xl border border-red-500/20 bg-red-600 px-5 py-3.5 text-sm font-bold text-white shadow-[0_10px_35px_rgba(185,28,28,0.30)] backdrop-blur-md transition-all duration-300 hover:bg-red-700 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-red-200"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15">
            <UserPlus className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
          </span>

          <span>
            রক্তদাতা হিসেবে নিবন্ধন করুন
          </span>

          <Heart className="ml-1 h-4 w-4 fill-current opacity-90" />
        </Link>
      </div>
    </div>
  );
}