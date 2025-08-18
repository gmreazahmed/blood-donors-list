import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import DonorCard from "../components/DonorCard";
import { areaData } from "../data/upazila-union";
import RegBtn from './../components/RegBtn';

interface Donor {
  id: string;
  name: string;
  bloodGroup: string;
  upazila: string;
  union: string;
  village: string;
  phone: string;
  lastDonateDate?: any; // can be string or Firestore Timestamp
}

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const upazilas = Object.keys(areaData);

// ✅ Function to check availability
const isAvailable = (donor: Donor) => {
  if (!donor.lastDonateDate) return true;

  let lastDate: Date;

  // Handle Firestore Timestamp or string
  if (typeof donor.lastDonateDate === "string") {
    lastDate = new Date(donor.lastDonateDate);
  } else if (donor.lastDonateDate?.toDate) {
    lastDate = donor.lastDonateDate.toDate();
  } else {
    return true;
  }

  const now = new Date();
  const diffMonths =
    (now.getFullYear() - lastDate.getFullYear()) * 12 +
    (now.getMonth() - lastDate.getMonth());

  return diffMonths >= 3;
};

export default function DonorsList() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [blood, setBlood] = useState("");
  const [upazila, setUpazila] = useState("");
  const [union, setUnion] = useState("");
  const [search, setSearch] = useState("");
  const [showCount, setShowCount] = useState(10);
  const [availableOnly, setAvailableOnly] = useState(false); // ✅ new toggle

  const fetchDonors = async () => {
    const snap = await getDocs(collection(db, "donors"));
    let donorData: Donor[] = snap.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Donor, "id">),
    }));

    if (blood) donorData = donorData.filter(d => d.bloodGroup === blood);
    if (upazila) donorData = donorData.filter(d => d.upazila === upazila);
    if (union) donorData = donorData.filter(d => d.union === union);
    if (search) {
      donorData = donorData.filter(
        d =>
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.phone.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (availableOnly) {
      donorData = donorData.filter(isAvailable);
    }

    setDonors(donorData.slice(0, showCount));
  };

  useEffect(() => {
    fetchDonors();
  }, [blood, upazila, union, search, showCount, availableOnly]);

  return (
    <section id="donorListSection">
      <div className="p-4 max-w-6xl mx-auto">
        <RegBtn />

        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-500 to-gray-800 bg-clip-text text-transparent mb-4 mt-22">
          রক্ত দানকারীদের তালিকা-
        </h2>
        <p className="text-red-600 mb-6 text-xs">
          (বর্তমানে সাতক্ষীরার কালিগঞ্জ উপজেলার জন্য চালু আছে)
        </p>

        {/* 🔽 Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="নাম বা ফোন দিয়ে খুঁজুন"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-grow min-w-[200px] px-3 py-2 border border-gray-400 shadow-md rounded focus:outline-none focus:ring-1 focus:ring-red-500"
          />
          <select
            value={blood}
            onChange={e => setBlood(e.target.value)}
            className="w-36 px-3 py-2 border border-gray-400 shadow-md rounded focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <option value="">রক্তের গ্রুপ</option>
            {bloodGroups.map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
          <select
            value={upazila}
            onChange={e => {
              setUpazila(e.target.value);
              setUnion("");
            }}
            className="w-36 px-3 py-2 border border-gray-400 shadow-md rounded focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <option value="">উপজেলা</option>
            {upazilas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
          {upazila && (
            <select
              value={union}
              onChange={e => setUnion(e.target.value)}
              className="w-36 px-3 py-2 border border-gray-400 shadow-md rounded focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="">ইউনিয়ন</option>
              {areaData[upazila].map(un => (
                <option key={un} value={un}>{un}</option>
              ))}
            </select>
          )}

          {/* ✅ Available toggle */}
          <button
            onClick={() => setAvailableOnly(prev => !prev)}
            className={`px-4 py-2 rounded shadow-md transition ${
              availableOnly
                ? "bg-green-600 text-white hover:bg-green-700"
                : "border border-gray-400 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {availableOnly ? " প্রস্তুত" : "সব ডোনার"}
          </button>
        </div>

        {/* 🔽 Donor list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {donors.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              কোনো ডোনার পাওয়া যায়নি
            </p>
          ) : (
            donors.map(donor => <DonorCard key={donor.id} donor={donor} />)
          )}
        </div>

        {/* Load more */}
        {donors.length >= showCount && (
          <div className="text-center mt-8 mb-6">
            <button
              onClick={() => setShowCount(prev => prev + 10)}
              className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition"
            >
              আরও দেখুন
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
