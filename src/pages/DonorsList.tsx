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
    <section id="donorListSection" className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              রক্ত দানকারীদের তালিকা
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              বর্তমানে সাতক্ষীরার কালিগঞ্জ উপজেলার জন্য চালু আছে
            </p>
          </div>
          <RegBtn />
        </div>

        {/* Sticky Filter Bar */}
        <div className="sticky top-0 z-10 bg-white shadow-lg rounded-lg p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="নাম বা ফোন দিয়ে খুঁজুন"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
              />
            </div>
            <select
              value={blood}
              onChange={(e) => setBlood(e.target.value)}
              className="w-full sm:w-40 px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
            >
              <option value="">রক্তের গ্রুপ</option>
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
            <select
              value={upazila}
              onChange={(e) => {
                setUpazila(e.target.value);
                setUnion("");
              }}
              className="w-full sm:w-40 px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
            >
              <option value="">উপজেলা</option>
              {upazilas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
            {upazila && (
              <select
                value={union}
                onChange={(e) => setUnion(e.target.value)}
                className="w-full sm:w-40 px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
              >
                <option value="">ইউনিয়ন</option>
                {areaData[upazila].map((un) => (
                  <option key={un} value={un}>
                    {un}
                  </option>
                ))}
              </select>
            )}
            <button
              onClick={() => setAvailableOnly((prev) => !prev)}
              className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                availableOnly
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {availableOnly ? "প্রস্তুত ডোনার" : "সব ডোনার"}
            </button>
          </div>
        </div>

        {/* Donor List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {donors.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">কোনো ডোনার পাওয়া যায়নি</p>
            </div>
          ) : (
            donors.map((donor) => (
              <div
                key={donor.id}
                className="transform transition-all duration-300 hover:scale-105"
              >
                <DonorCard donor={donor} />
              </div>
            ))
          )}
        </div>

        {/* Load More */}
        {donors.length >= showCount && (
          <div className="text-center mt-10">
            <button
              onClick={() => setShowCount((prev) => prev + 10)}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition"
            >
              আরও দেখুন
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
