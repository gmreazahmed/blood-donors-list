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
  lastDonateDate?: string;
}

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const upazilas = Object.keys(areaData);

export default function Home() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [blood, setBlood] = useState("");
  const [upazila, setUpazila] = useState("");
  const [union, setUnion] = useState("");
  const [search, setSearch] = useState("");
  const [showCount, setShowCount] = useState(10);

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

    setDonors(donorData.slice(0, showCount));
  };

  useEffect(() => {
    fetchDonors();
  }, [blood, upazila, union, search, showCount]);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <RegBtn />

      <h2 className="text-3xl font-semibold mb-4 text-gray-800">
        রক্ত দানকারীদের তালিকা-
      </h2>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="নাম বা ফোন দিয়ে খুঁজুন"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-grow min-w-[200px] px-3 py-2 border shadow-md rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500"
        />
        <select
          value={blood}
          onChange={e => setBlood(e.target.value)}
          className="w-36 px-3 py-2 border border shadow-md rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500"
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
          className="w-36 px-3 py-2 border border shadow-md rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500"
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
            className="w-36 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <option value="">ইউনিয়ন</option>
            {areaData[upazila].map(un => (
              <option key={un} value={un}>{un}</option>
            ))}
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {donors.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">কোনো ডোনার পাওয়া যায়নি</p>
        ) : (
          donors.map(donor => <DonorCard key={donor.id} donor={donor} />)
        )}
      </div>

      {donors.length >= showCount && (
        <div className="text-center mt-8">
          <button
            onClick={() => setShowCount(prev => prev + 10)}
            className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition"
          >
            আরও দেখুন
          </button>
        </div>
      )}
    </div>
  );
}
