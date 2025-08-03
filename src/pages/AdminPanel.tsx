import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { areaData } from "../data/upazila-union";
import FooterCommentsAdmin from "../components/FooterCommentsAdmin";
import BloodRequestAdmin from "../components/BloodRequestAdmin";

interface Donor {
  id?: string;
  name: string;
  bloodGroup: string;
  phone: string;
  upazila: string;
  union: string;
  village: string;
}

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export default function AdminPanel() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Donor>>({});
  const [newDonor, setNewDonor] = useState<Donor>({
    name: "",
    bloodGroup: "",
    phone: "",
    upazila: "",
    union: "",
    village: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("isAdmin") !== "true") {
      navigate("/admin-login");
    } else {
      fetchDonors();
    }
  }, []);

  const fetchDonors = async () => {
    const snap = await getDocs(collection(db, "donors"));
    setDonors(
      snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Donor[]
    );
  };

  const handleDelete = async (id: string) => {
    if (confirm("ডোনার ডিলিট করতে চান?")) {
      await deleteDoc(doc(db, "donors", id));
      fetchDonors();
    }
  };

  const handleEdit = (donor: Donor) => {
    setEditingId(donor.id!);
    setEditData(donor);
  };

  const handleUpdate = async () => {
    if (editingId) {
      const donorRef = doc(db, "donors", editingId);
      await updateDoc(donorRef, editData);
      setEditingId(null);
      fetchDonors();
    }
  };

  const handleAdd = async () => {
    if (!newDonor.name || !newDonor.phone || !newDonor.bloodGroup) {
      alert("সকল ফিল্ড পূরণ করুন");
      return;
    }
    await addDoc(collection(db, "donors"), newDonor);
    setNewDonor({
      name: "",
      bloodGroup: "",
      phone: "",
      upazila: "",
      union: "",
      village: "",
    });
    fetchDonors();
  };

  const filteredDonors = donors.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.phone.includes(searchTerm) ||
      d.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUnions = (upazila: string) => {
    return areaData[upazila] || [];
  };
    
  
  

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
        <button
          onClick={() => {
            localStorage.removeItem("isAdmin");
            navigate("/admin-login");
          }}
          className="bg-gray-700 hover:bg-red-800 text-white px-5 py-2 rounded shadow-md transition"
        >
          Sign Out
        </button>
      </div>

      {/* Add New Donor */}
      <section className="mb-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">
          নতুন ডোনার যোগ করুন
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="নাম"
            className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            value={newDonor.name}
            onChange={(e) => setNewDonor({ ...newDonor, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="ফোন"
            className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            value={newDonor.phone}
            onChange={(e) => setNewDonor({ ...newDonor, phone: e.target.value })}
          />
          <select
            className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            value={newDonor.bloodGroup}
            onChange={(e) =>
              setNewDonor({ ...newDonor, bloodGroup: e.target.value })
            }
          >
            <option value="">রক্ত গ্রুপ</option>
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
          <select
            className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            value={newDonor.upazila}
            onChange={(e) =>
              setNewDonor({ ...newDonor, upazila: e.target.value, union: "" })
            }
          >
            <option value="">উপজেলা</option>
            {Object.keys(areaData).map((upazila) => (
              <option key={upazila} value={upazila}>
                {upazila}
              </option>
            ))}
          </select>
          <select
            className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            value={newDonor.union}
            onChange={(e) =>
              setNewDonor({ ...newDonor, union: e.target.value })
            }
          >
            <option value="">ইউনিয়ন</option>
            {getUnions(newDonor.upazila).map((union) => (
              <option key={union} value={union}>
                {union}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="গ্রাম"
            className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            value={newDonor.village}
            onChange={(e) => setNewDonor({ ...newDonor, village: e.target.value })}
          />
        </div>
        <button
          onClick={handleAdd}
          className="mt-5 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded shadow-md transition"
        >
          নতুন ডোনার যোগ করুন
        </button>
      </section>
      
      {/* Search */}
      <section className="mb-4">
        <input
          type="text"
          placeholder="নাম, ফোন, বা রক্ত গ্রুপ দিয়ে খুঁজুন"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </section>

      {/* Donor Table */}
      <section className="overflow-x-auto rounded-lg shadow border border-gray-300 bg-white">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {[
                "নাম",
                "রক্ত",
                "ফোন",
                "উপজেলা",
                "ইউনিয়ন",
                "গ্রাম",
                "অ্যাকশন",
              ].map((header) => (
                <th
                  key={header}
                  className="p-3 text-left font-semibold text-gray-700 border-b border-gray-300 select-none"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        </table>

        {/* Scrollable body container */}
        <div className="max-h-[500px] overflow-y-auto">
          <table className="min-w-full text-sm">
            <tbody className="divide-y divide-gray-200">
              {filteredDonors.map((donor) => (
                <tr
                  key={donor.id}
                  className="even:bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                >
                  {editingId === donor.id ? (
                    <>
                      {/* EDITING ROW (same as before) */}
                      <td className="p-2 border border-gray-300">
                        <input
                          className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                          value={editData.name || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                        />
                      </td>
                      <td className="p-2 border border-gray-300">
                        <select
                          className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                          value={editData.bloodGroup || ""}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              bloodGroup: e.target.value,
                            })
                          }
                        >
                          <option value="">রক্ত গ্রুপ</option>
                          {bloodGroups.map((bg) => (
                            <option key={bg} value={bg}>
                              {bg}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2 border border-gray-300">
                        <input
                          className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                          value={editData.phone || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, phone: e.target.value })
                          }
                        />
                      </td>
                      <td className="p-2 border border-gray-300">
                        <select
                          className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                          value={editData.upazila || ""}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              upazila: e.target.value,
                              union: "",
                            })
                          }
                        >
                          <option value="">উপজেলা</option>
                          {Object.keys(areaData).map((upazila) => (
                            <option key={upazila} value={upazila}>
                              {upazila}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2 border border-gray-300">
                        <select
                          className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                          value={editData.union || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, union: e.target.value })
                          }
                        >
                          <option value="">ইউনিয়ন</option>
                          {getUnions(editData.upazila || "").map((union) => (
                            <option key={union} value={union}>
                              {union}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2 border border-gray-300">
                        <input
                          className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                          value={editData.village || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, village: e.target.value })
                          }
                        />
                      </td>
                      <td className="p-2 border border-gray-300 flex gap-2">
                        <button
                          onClick={handleUpdate}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded shadow transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded shadow transition"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-2 border border-gray-300">{donor.name}</td>
                      <td className="p-2 border border-gray-300">
                        {donor.bloodGroup}
                      </td>
                      <td className="p-2 border border-gray-300">{donor.phone}</td>
                      <td className="p-2 border border-gray-300">{donor.upazila}</td>
                      <td className="p-2 border border-gray-300">{donor.union}</td>
                      <td className="p-2 border border-gray-300">{donor.village}</td>
                      <td className="p-2 border border-gray-300 flex gap-2">
                        <button
                          onClick={() => handleEdit(donor)}
                          className="border border-green-500 text-green-500 hover:bg-green-500 hover:text-white text-xs px-3 py-1 rounded transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(donor.id!)}
                          className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-xs px-3 py-1 rounded transition"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer showing how many donors are displayed */}
        <div className="text-sm text-gray-600 p-3 border-t border-gray-300">
          মোট: {filteredDonors.length} জন
        </div>
      </section>

      
      {/* Blood Requests Section */}
      <div className="mx-auto">
          <BloodRequestAdmin/>
      </div>

      {/* Footer Comments Section */}           
      <div className="mx-auto">
        <FooterCommentsAdmin />
      </div>
    
    </div>
  );
}