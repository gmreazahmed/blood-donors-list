import { Link } from "react-router-dom";
import {
  Heart,
  Search,
  UserPlus,
} from "lucide-react";

export default function RegBtn() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 pointer-events-none md:hidden">
      <div className="mx-auto flex max-w-md gap-2 pointer-events-auto">
        {/* Search Donors */}
        <Link
          to="/donors"
          aria-label="রক্তদাতা খুঁজুন"
          className="
            group
            flex
            min-h-[54px]
            flex-1
            items-center
            justify-center
            gap-2
            rounded-2xl
            border
            border-slate-200
            bg-white
            px-3
            text-xs
            font-extrabold
            text-slate-800
            shadow-[0_8px_30px_rgba(15,23,42,0.12)]
            transition-all
            duration-200
            hover:border-red-200
            hover:bg-red-50
            hover:text-red-700
            active:scale-[0.98]
            focus:outline-none
            focus:ring-4
            focus:ring-red-100
          "
        >
          <span
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-red-50
              text-red-600
              transition
              group-hover:bg-red-100
            "
          >
            <Search
              className="h-4 w-4"
              aria-hidden="true"
            />
          </span>

          <span>রক্তদাতা খুঁজুন</span>
        </Link>

        {/* Register */}
        <Link
          to="/register"
          aria-label="রক্তদাতা হিসেবে নিবন্ধন করুন"
          className="
            group
            flex
            min-h-[54px]
            flex-[1.35]
            items-center
            justify-center
            gap-2
            rounded-2xl
            border
            border-red-500/20
            bg-red-600
            px-3
            text-xs
            font-bold
            text-white
            shadow-[0_10px_35px_rgba(185,28,28,0.30)]
            transition-all
            duration-200
            hover:bg-red-700
            active:scale-[0.98]
            focus:outline-none
            focus:ring-4
            focus:ring-red-200
          "
        >
          <span
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-white/15
            "
          >
            <UserPlus
              className="
                h-4 w-4
                transition-transform
                duration-200
                group-hover:scale-110
              "
              aria-hidden="true"
            />
          </span>

          <span className="whitespace-nowrap">
            রক্তদাতা হিসেবে নিবন্ধন করুন
          </span>

          <Heart
            className="h-4 w-4 shrink-0 fill-current opacity-90"
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  );
}