import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { motion } from "framer-motion";
import { Phone, CheckCircle2, XCircle } from "lucide-react";

type Donor = {
  id: string;
  name: string;
  bloodGroup: string;
  upazila: string;
  union: string;
  village: string;
  phone: string;
  lastDonateDate?: string;
};

export default function DonorCard({ donor }: { donor: Donor }) {
  const [editDate, setEditDate] = useState(donor.lastDonateDate || "");
  const [daysAgo, setDaysAgo] = useState<number | null>(null);

  useEffect(() => {
    if (editDate) {
      const diff = Math.floor(
        (new Date().getTime() - new Date(editDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      setDaysAgo(diff);
    } else {
      setDaysAgo(null);
    }
  }, [editDate]);

  const handleUpdate = async () => {
    if (!editDate) return;
    alert("⚠️ জনস্বার্থে সঠিক তথ্য দিন, ভুল তথ্য দেবেন না।");
    const ref = doc(db, "donors", donor.id);
    await updateDoc(ref, { lastDonateDate: editDate });
    alert("✅ সর্বশেষ রক্তদানের তারিখ আপডেট হয়েছে।");
  };

  const isAvailable = daysAgo !== null && daysAgo >= 120;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full"
    >
      <div className="relative bg-white rounded-2xl shadow-md overflow-hidden transition-colors duration-500 group hover:bg-red-200 hover:text-black h-full flex flex-col justify-between">
        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          {isAvailable ? (
            <span className="flex items-center gap-1 bg-green-100 text-green-700 group-hover:bg-green-600 group-hover:text-white text-xs font-semibold px-2 py-1 rounded-full transition">
              <CheckCircle2 size={14} /> প্রস্তুত
            </span>
          ) : (
            <span className="flex items-center gap-1 bg-red-100 text-red-600 group-hover:bg-red-700 group-hover:text-white text-xs font-semibold px-2 py-1 rounded-full transition">
              <XCircle size={14} /> অনুপলব্ধ
            </span>
          )}
        </div>

        {/* Donor Info */}
        <div className="p-6 space-y-3">
          <h3 className="text-xl font-bold">{donor.name}</h3>

          <p className="text-sm">
            <span className="font-medium">রক্তের গ্রুপ:</span>{" "}
            <span className="font-bold text-red-600 text-lg group-hover:text-red-800">
              {donor.bloodGroup}
            </span>
          </p>

          <p className="text-sm">
            <span className="font-medium">ঠিকানা:</span>{" "}
            {donor.village}, {donor.union}, {donor.upazila}
          </p>

          {/* Phone */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">ফোন:</span>
            <span className="font-semibold">{donor.phone}</span>
            <a
              href={`tel:${donor.phone}`}
              className="flex items-center gap-1 border border-green-500 text-green-600 hover:bg-green-600 hover:text-white text-xs px-3 py-1 rounded transition"
            >
              <Phone size={14} />
              কল করুন
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t p-4 bg-gray-50 group-hover:bg-red-200">
          <label className="text-sm font-medium block mb-2">
            সর্বশেষ রক্তদানের তারিখ-
          </label>
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="border rounded px-3 py-2 text-sm text-gray-800 shadow-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
            />
            <button
              onClick={handleUpdate}
              className="border border-green-500 text-green-600 hover:bg-green-600 hover:text-white px-4 py-2 rounded text-sm transition"
            >
              আপডেট করুন
            </button>
          </div>

          {/* Availability Info */}
          {isAvailable && (
            <p className="text-xs mt-3 text-green-600 group-hover:text-green-800">
              ✅ সর্বশেষ রক্তদান হয়েছে {daysAgo} দিন আগে — এখন প্রস্তুত।
            </p>
          )}
          {!isAvailable && daysAgo !== null && (
            <p className="text-xs mt-3 text-red-600 group-hover:text-red-800">
              ❌ সর্বশেষ রক্তদান হয়েছে {daysAgo} দিন আগে — এখনো প্রস্তুত নয়।
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
