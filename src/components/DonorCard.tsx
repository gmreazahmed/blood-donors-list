import { doc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { Calendar, CheckCircle2, Phone, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";

type Donor = {
  id: string;
  name: string;
  bloodGroup: string;
  upazila: string;
  union: string;
  village: string;
  phone: string;
  lastDonateDate?: string | { toDate: () => Date }; // Handle string or Firestore Timestamp
};

export default function DonorCard({ donor }: { donor: Donor }) {
  const [editDate, setEditDate] = useState<string>(
    typeof donor.lastDonateDate === "string"
      ? donor.lastDonateDate
      : donor.lastDonateDate?.toDate().toISOString().split("T")[0] || ""
  );
  const [daysAgo, setDaysAgo] = useState<number | null>(null);

  useEffect(() => {
    if (!editDate) {
      setDaysAgo(null);
      return;
    }

    let lastDate: Date;
    if (typeof donor.lastDonateDate === "string") {
      lastDate = new Date(donor.lastDonateDate);
    } else if (donor.lastDonateDate && "toDate" in donor.lastDonateDate) {
      lastDate = donor.lastDonateDate.toDate();
    } else {
      lastDate = new Date(editDate);
    }

    const diff = Math.floor(
      (new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    setDaysAgo(diff);
  }, [editDate, donor.lastDonateDate]);

  const handleUpdate = async () => {
    if (!editDate) return;

    const confirmUpdate = window.confirm(
      "⚠️ জনস্বার্থে সঠিক তথ্য দিন, ভুল তথ্য দেবেন না। আপডেট করবেন কি?"
    );
    if (!confirmUpdate) return;

    try {
      const ref = doc(db, "donors", donor.id);
      await updateDoc(ref, { lastDonateDate: editDate });
      alert("✅ সর্বশেষ রক্তদানের তারিখ আপডেট হয়েছে।");
    } catch (error) {
      console.error("Update failed:", error);
      alert("❌ আপডেট ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
    }
  };

  const isAvailable = daysAgo !== null && daysAgo >= 120;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.25 }}
      className="w-full h-full"
    >
      <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
        {/* Availability Badge */}
        <div className="absolute top-4 right-4">
          {isAvailable ? (
            <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
              <CheckCircle2 size={14} /> প্রস্তুত
            </span>
          ) : (
            <span className="flex items-center gap-1 bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
              <XCircle size={14} /> অনুপলব্ধ
            </span>
          )}
        </div>

        {/* Donor Info */}
        <div className="p-6 space-y-3 flex-1">
          <h3 className="text-xl font-semibold text-gray-900">{donor.name}</h3>

          <p className="flex items-center gap-2 text-sm">
            <span className="font-medium text-gray-700">রক্তের গ্রুপ:</span>
            <span className="text-lg font-bold text-red-600">
              {donor.bloodGroup}
            </span>
          </p>

          <p className="text-sm text-gray-700">
            <span className="font-medium">ঠিকানা:</span> {donor.village},{" "}
            {donor.union}, {donor.upazila}
          </p>

          {/* Phone */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700">ফোন:</span>
            <span className="font-semibold text-gray-900">{donor.phone}</span>
            <a
              href={`tel:${donor.phone}`}
              className="flex items-center gap-1 border border-green-500 text-green-600 hover:bg-green-600 hover:text-white text-xs px-3 py-1.5 rounded-lg transition"
            >
              <Phone size={14} />
              কল করুন
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t bg-gray-50 px-6 py-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-2">
            <Calendar size={14} /> সর্বশেষ রক্তদানের তারিখ
          </label>
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm text-gray-800 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
            />
            <button
              onClick={handleUpdate}
              className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              আপডেট করুন
            </button>
          </div>

          {/* Availability Info */}
          {isAvailable && (
            <p className="text-xs mt-3 text-green-600">
              ✅ {daysAgo} দিন আগে রক্তদান হয়েছে — এখন প্রস্তুত।
            </p>
          )}
          {!isAvailable && daysAgo !== null && (
            <p className="text-xs mt-3 text-red-600">
              ❌ {daysAgo} দিন আগে রক্তদান হয়েছে — এখনো প্রস্তুত নয়।
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
