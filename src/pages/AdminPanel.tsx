// src/pages/AdminPanel.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";

interface Donor {
  id: string;
  name: string;
  bloodGroup: string;
  phone: string;
  upazila: string;
  union: string;
}

export default function AdminPanel() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("admin") !== "true") {
      navigate("/admin-login");
    } else {
      fetchDonors();
    }
  }, []);

  const fetchDonors = async () => {
    const snap = await getDocs(collection(db, "donors"));
    setDonors(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Donor[]);
  };

  const handleDelete = async (id: string) => {
    if (confirm("ডোনার ডিলিট করতে চান?")) {
      await deleteDoc(doc(db, "donors", id));
      fetchDonors();
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">নাম</th>
            <th className="p-2 border">রক্ত</th>
            <th className="p-2 border">ফোন</th>
            <th className="p-2 border">অ্যাকশন</th>
          </tr>
        </thead>
        <tbody>
          {donors.map(d => (
            <tr key={d.id}>
              <td className="p-2 border">{d.name}</td>
              <td className="p-2 border">{d.bloodGroup}</td>
              <td className="p-2 border">{d.phone}</td>
              <td className="p-2 border">
                {/* Edit button can be added here */}
                <button
                  onClick={() => handleDelete(d.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  ডিলিট
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
