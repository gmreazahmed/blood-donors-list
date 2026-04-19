import { doc, updateDoc, Timestamp } from "firebase/firestore";
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
  lastDonateDate?: string | Timestamp; // ✅ string বা Timestamp
};

export default function DonorCard({ donor }: { donor: Donor }) {
  const [editDate, setEditDate] = useState(
    donor.lastDonateDate
      ? donor.lastDonateDate instanceof Timestamp
        ? donor.lastDonateDate.toDate().toISOString().slice(0, 10)
        : donor.lastDonateDate
      : ""
  );
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
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.3 }}
    className="w-full h-full"
  >
    <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden flex flex-col transition">

      {/* Blood Group Badge */}
      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow">
        {donor.bloodGroup}
      </div>

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

      {/* Content */}
      <div className="p-6 pt-12 space-y-3 flex-1">

        {/* Name */}
        <h3 className="text-xl font-semibold text-gray-900">
          {donor.name}
        </h3>

        {/* Location */}
        <p className="text-sm text-gray-600">
          📍 {donor.village}, {donor.union}, {donor.upazila}
        </p>

        {/* Phone */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-sm font-medium text-gray-700">
            📞 {donor.phone}
          </span>

          <a
            href={`tel:${donor.phone}`}
            className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-2 rounded-lg shadow transition"
          >
            <Phone size={14} />
            Call
          </a>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t bg-gray-50 px-5 py-4 space-y-3">

        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
          <Calendar size={14} /> Last Donation Date
        </label>

        <div className="flex gap-2 flex-wrap">
          <input
            type="date"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500"
          />

          <button
            onClick={handleUpdate}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Update
          </button>
        </div>

        {/* Status Text */}
        {isAvailable && (
          <p className="text-xs text-green-600">
            ✅ {daysAgo} দিন আগে রক্তদান — এখন প্রস্তুত
          </p>
        )}
        {!isAvailable && daysAgo !== null && (
          <p className="text-xs text-red-600">
            ❌ {daysAgo} দিন আগে — এখনো প্রস্তুত নয়
          </p>
        )}
      </div>
    </div>
  </motion.div>
);
}
