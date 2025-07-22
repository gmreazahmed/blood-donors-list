import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import DonorCard from "../components/DonorCard";
import { areaData } from "../data/upazila-union";

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
  // Declare donors state here with correct type
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
      <h2 className="text-xl font-bold mb-4">Donor List</h2>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or phone"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto flex-1"
        />
        <select
          value={blood}
          onChange={e => setBlood(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Blood Groups</option>
          {bloodGroups.map(bg => (
            <option key={bg} value={bg}>
              {bg}
            </option>
          ))}
        </select>
        <select
          value={upazila}
          onChange={e => {
            setUpazila(e.target.value);
            setUnion(""); // reset union when upazila changes
          }}
          className="border p-2 rounded"
        >
          <option value="">All Upazilas</option>
          {upazilas.map(area => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
        {upazila && (
          <select
            value={union}
            onChange={e => setUnion(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Unions</option>
            {areaData[upazila].map(un => (
              <option key={un} value={un}>
                {un}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {donors.map(donor => (
          <DonorCard key={donor.id} donor={donor} />
        ))}
      </div>

      {donors.length >= showCount && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowCount(prev => prev + 10)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}
