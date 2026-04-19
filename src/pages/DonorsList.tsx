import { collection, getDocs, Timestamp } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import DonorCard from "../components/DonorCard";
import { areaData } from "../data/upazila-union";
import { db } from "../firebase/config";
import RegBtn from "../components/RegBtn";
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

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const upazilas = Object.keys(areaData);

const isAvailable = (donor: Donor) => {
  if (!donor.lastDonateDate) return true;

  let lastDate: Date;
  if (typeof donor.lastDonateDate === "string") {
    lastDate = new Date(donor.lastDonateDate);
  } else {
    lastDate = donor.lastDonateDate.toDate();
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
  const [availableOnly, setAvailableOnly] = useState(false);

  const fetchDonors = useCallback(async () => {
    const snap = await getDocs(collection(db, "donors"));
    let donorData: Donor[] = snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Donor, "id">),
    }));

    if (blood) donorData = donorData.filter((d) => d.bloodGroup === blood);
    if (upazila) donorData = donorData.filter((d) => d.upazila === upazila);
    if (union) donorData = donorData.filter((d) => d.union === union);
    if (search) {
      donorData = donorData.filter(
        (d) =>
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.phone.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (availableOnly) donorData = donorData.filter(isAvailable);

    setDonors(donorData.slice(0, showCount));
  }, [blood, upazila, union, search, showCount, availableOnly]);

  useEffect(() => {
    fetchDonors();
  }, [blood, upazila, union, search, showCount, availableOnly, fetchDonors]);

 return (
  <section className="min-h-screen bg-gradient-to-b from-red-50 via-white to-red-50">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-bold text-gray-800">
            Blood Donor List
          </h2>
          <p className="mt-3 text-gray-500 max-w-md">
            Kaliganj এলাকার রক্তদাতাদের খুঁজুন, যোগাযোগ করুন এবং জরুরি সময়ে সাহায্য পান
          </p>
        </div>
        <RegBtn />
      </div>

      {/* Filter Bar */}
      <div className="sticky top-0 z-10 mb-10">
        <div className="bg-white/70 backdrop-blur-lg shadow-xl rounded-2xl p-5 border border-gray-100">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

            {/* Search */}
            <input
              type="text"
              placeholder="নাম বা ফোন দিয়ে খুঁজুন..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-400 outline-none transition"
            />

            {/* Blood */}
            <select
              value={blood}
              onChange={(e) => setBlood(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-400"
            >
              <option value="">Blood</option>
              {bloodGroups.map((bg) => (
                <option key={bg}>{bg}</option>
              ))}
            </select>

            {/* Upazila */}
            <select
              value={upazila}
              onChange={(e) => {
                setUpazila(e.target.value);
                setUnion("");
              }}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-400"
            >
              <option value="">Upazila</option>
              {upazilas.map((area) => (
                <option key={area}>{area}</option>
              ))}
            </select>

            {/* Union */}
            {upazila && (
              <select
                value={union}
                onChange={(e) => setUnion(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-400"
              >
                <option value="">Union</option>
                {areaData[upazila].map((un) => (
                  <option key={un}>{un}</option>
                ))}
              </select>
            )}

            {/* Toggle */}
            <button
              onClick={() => setAvailableOnly((prev) => !prev)}
              className={`rounded-xl px-4 py-3 font-medium transition ${
                availableOnly
                  ? "bg-green-500 text-white shadow-md"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {availableOnly ? "✔️ Available" : "All Donors"}
            </button>

          </div>
        </div>
      </div>

      {/* Donor Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {donors.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="text-gray-400 text-lg">
              😔 কোনো ডোনার পাওয়া যায়নি
            </p>
          </div>
        ) : (
          donors.map((donor) => (
            <div
              key={donor.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-5 border border-gray-100 hover:-translate-y-1"
            >
              <DonorCard donor={donor} />
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {donors.length >= showCount && (
        <div className="text-center mt-14">
          <button
            onClick={() => setShowCount((prev) => prev + 10)}
            className="bg-red-500 hover:bg-red-600 text-white px-10 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
          >
            আরও দেখুন
          </button>
        </div>
      )}
    </div>
  </section>
);
}
