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
    alert(
      "যেহেতু জনস্বার্থে সবার জন্য উন্মুক্ত এজন্য ভুল তথ্য প্রদান করবেন না, অনুগ্রহ করে সঠিক তথ্য প্রদান করুন।"
    );
    const ref = doc(db, "donors", donor.id);
    await updateDoc(ref, { lastDonateDate: editDate });
    alert("✅ সর্বশেষ রক্তদানের তারিখ আপডেট হয়েছে।");
  };

  const isAvailable = daysAgo !== null && daysAgo >= 120;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.4 }}
      className="relative group w-full max-w-md mx-auto cursor-pointer"
    >
      <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden transition-colors duration-500 group-hover:bg-red-200 opacity-90 group-hover:text-black">
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
          <h3 className="text-2xl font-bold">{donor.name}</h3>
          <p className="text-sm font-semibold">
            <span className="font-medium">রক্তের গ্রুপ:</span>{" "}
            <span className="font-bold text-red-600 text-lg group-hover:text-red-800">
              {donor.bloodGroup}
            </span>
          </p>
          <p className="text-sm">
            <span className="font-medium">ঠিকানা:</span> {donor.village},{" "}
            {donor.union}, {donor.upazila}
          </p>

          {/* Phone */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">ফোন:</span>
            <span className="font-bold">{donor.phone}</span>
            <a
              href={`tel:${donor.phone}`}
              className="flex items-center gap-1 border border-green-500 text-green-600 hover:bg-green-600 hover:text-white text-xs px-3 py-1 rounded transition"
            >
              <Phone size={14} />
              কল করুন
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t p-4 bg-gray-50 group-hover:bg-red-200">
          <label className="text-sm font-medium block mb-2">
            সর্বশেষ রক্তদানের তারিখ:
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <input
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="border rounded px-3 py-1 text-sm text-gray-800 shadow-sm w-full sm:w-auto"
            />
            <button
              onClick={handleUpdate}
              className="border border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-4 py-1 rounded text-sm transition w-full sm:w-auto"
            >
              আপডেট করুন
            </button>
          </div>

          {/* Availability Info */}
          {isAvailable && (
            <p className="text-xs mt-2 text-green-600 group-hover:text-green-800">
              ✅ সর্বশেষ রক্তদান হয়েছে {daysAgo} দিন আগে। এখন রক্ত দানে প্রস্তুত।
            </p>
          )}
          {!isAvailable && daysAgo !== null && (
            <p className="text-xs mt-2 text-red-600 group-hover:text-red-800">
              ❌ সর্বশেষ রক্তদান হয়েছে {daysAgo} দিন আগে। ডোনার এখন প্রস্তুত নয়।
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
