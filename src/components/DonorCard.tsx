import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

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
        (new Date().getTime() - new Date(editDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      setDaysAgo(diff);
    } else {
      setDaysAgo(null);
    }
  }, [editDate]);

  const handleUpdate = async () => {
    if (!editDate) return;
    alert("যেহেতু জনস্বার্থে সবার জন্য উন্মুক্ত এজন্য ভুল তথ্য প্রদান করবেন না, অনুগ্রহ সঠিক তথ্যটি তথ্য প্রদান করুন।");
    const ref = doc(db, "donors", donor.id);
    await updateDoc(ref, { lastDonateDate: editDate });
    alert("সর্বশেষ রক্তদানের তারিখ আপডেট হয়েছে।");
  };

  const isAvailable = daysAgo !== null && daysAgo >= 120;

  return (
    <div className="relative border rounded-xl shadow-md p-6 bg-red-40 hover:shadow-lg transition duration-300">
      
      <div className="flex flex-col gap-1 mb-3">
        <h3 className="text-2xl font-bold text-gray-800">{donor.name}</h3>
        <p className="text-sm font-bold text-gray-700"><span className="font-medium">রক্তের গ্রুপ:</span>{" "}
        <span className="font-bold text-red-600">{donor.bloodGroup}</span></p>
        <p className="text-sm text-gray-700"><span className="font-medium">ঠিকানা:</span> {donor.village}, {donor.union}, {donor.upazila}</p>
        <p className="text-sm text-gray-700 flex items-center gap-2">
          <span className="font-medium">ফোন:</span>{" "}
          <span className="font-bold text-black">{donor.phone}</span>
          <a
            href={`tel:${donor.phone}`}
            className="border border-green-500 text-green-500 hover:bg-green-500 hover:text-white text-xs px-3 py-1 rounded transition
"
          >
            কল করুন
          </a>
        </p>
      </div>

      <div className="border-t pt-3 mt-3">
        <label className="text-sm font-medium text-gray-700 block mb-1">
          সর্বশেষ রক্তদানের তারিখ:
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="date"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
            className="border rounded px-3 py-1 text-sm text-gray-800 shadow-sm"
          />
          <button
            onClick={handleUpdate}
            className="border border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-4 py-1 rounded text-sm transition"
          >
            আপডেট করুন
          </button>
        </div>
          {isAvailable && (
            <p className="text-xs text-green-600 mt-2">
              সর্বশেষ রক্তদান হয়েছে {daysAgo} দিন আগে। এই ডোনার এখন রক্ত দানে প্রস্তুত।
            </p>
          )}
          {!isAvailable && daysAgo !== null && (
            <p className="text-xs text-red-600 mt-2">
              এই ডোনার এখন রক্ত দানে প্রস্তুত নয়। সর্বশেষ রক্তদান হয়েছে {daysAgo} দিন আগে।
            </p>
          )}
      </div>
    </div>
  );
}
