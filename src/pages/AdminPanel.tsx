import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { collection, deleteDoc, doc, getDocs, updateDoc, addDoc } from "firebase/firestore";
import { areaData } from "../data/upazila-union";

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
    setDonors(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Donor[]);
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
    setNewDonor({ name: "", bloodGroup: "", phone: "", upazila: "", union: "", village: "" });
    fetchDonors();
  };

  // Filter donors for search
  const filteredDonors = donors.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.phone.includes(searchTerm) ||
    d.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get union list for selected upazila
  const getUnions = (upazila: string) => {
    return areaData[upazila] || [];
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      
      <div className="mb-6  flex justify-between items-center pb-4">
        <h2 className="text-xl font-bold">এডমিন প্যানেল</h2>
        <button
          onClick={() => {
            localStorage.removeItem("isAdmin");
            navigate("/admin-login");
          }}
          className="bg-gray-600 text-white px-4 py-1 rounded hover:bg-gray-700"
        >
          Sign Out
        </button>
      </div>

      {/* নতুন ডোনার যোগ করার ফর্ম */}
      <div className="mt-4 mb-4 pt-4 ">
        <div className="mb-4 border-b pb-2">
          <h3 className="font-semibold mb-2">নতুন ডোনার যোগ করুন</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="নাম"
            className="border p-2 rounded"
            value={newDonor.name}
            onChange={(e) => setNewDonor({ ...newDonor, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="ফোন"
            className="border p-2 rounded"
            value={newDonor.phone}
            onChange={(e) => setNewDonor({ ...newDonor, phone: e.target.value })}
          />
          <select
            className="border p-2 rounded"
            value={newDonor.bloodGroup}
            onChange={(e) => setNewDonor({ ...newDonor, bloodGroup: e.target.value })}
          >
            <option value="">রক্ত গ্রুপ</option>
            {bloodGroups.map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
          <select
            className="border p-2 rounded"
            value={newDonor.upazila}
            onChange={(e) => setNewDonor({ ...newDonor, upazila: e.target.value, union: "" })}
          >
            <option value="">উপজেলা</option>
            {Object.keys(areaData).map(upazila => (
              <option key={upazila} value={upazila}>{upazila}</option>
            ))}
          </select>
          <select
            className="border p-2 rounded"
            value={newDonor.union}
            onChange={(e) => setNewDonor({ ...newDonor, union: e.target.value })}
          >
            <option value="">ইউনিয়ন</option>
            {getUnions(newDonor.upazila).map(union => (
              <option key={union} value={union}>{union}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="গ্রাম"
            className="border p-2 rounded"
            value={newDonor.village}
            onChange={(e) => setNewDonor({ ...newDonor, village: e.target.value })}
          />
        </div>
        <button
          onClick={handleAdd}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          নতুন ডোনার যোগ করুন
        </button>
      </div>
      
      <div className="mt-8 mb-4 border-b pb-4">
        <h3 className="font-semibold mb-2">ডোনার তালিকা</h3>
      </div>

      <input
        type="text"
        placeholder="নাম, ফোন, বা রক্ত গ্রুপ দিয়ে খুঁজুন"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border px-3 py-2 mb-4 rounded"
      />
      
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">নাম</th>
            <th className="p-2 border">রক্ত</th>
            <th className="p-2 border">ফোন</th>
            <th className="p-2 border">উপজেলা</th>
            <th className="p-2 border">ইউনিয়ন</th>
            <th className="p-2 border">গ্রাম</th>
            <th className="p-2 border">অ্যাকশন</th>
          </tr>
        </thead>
        <tbody>
          {filteredDonors.map(donor => (
            <tr key={donor.id}>
              {editingId === donor.id ? (
                <>
                  <td className="p-2 border">
                    <input
                      className="border p-1 w-full"
                      value={editData.name || ""}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                  </td>
                  <td className="p-2 border">
                    <select
                      className="border p-1 w-full"
                      value={editData.bloodGroup || ""}
                      onChange={(e) => setEditData({ ...editData, bloodGroup: e.target.value })}
                    >
                      <option value="">রক্ত গ্রুপ</option>
                      {bloodGroups.map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2 border">
                    <input
                      className="border p-1 w-full"
                      value={editData.phone || ""}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    />
                  </td>
                  <td className="p-2 border">
                    <select
                      className="border p-1 w-full"
                      value={editData.upazila || ""}
                      onChange={(e) => setEditData({ ...editData, upazila: e.target.value, union: "" })}
                    >
                      <option value="">উপজেলা</option>
                      {Object.keys(areaData).map(upazila => (
                        <option key={upazila} value={upazila}>{upazila}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2 border">
                    <select
                      className="border p-1 w-full"
                      value={editData.union || ""}
                      onChange={(e) => setEditData({ ...editData, union: e.target.value })}
                    >
                      <option value="">ইউনিয়ন</option>
                      {getUnions(editData.upazila || "").map(union => (
                        <option key={union} value={union}>{union}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2 border">
                    <input
                      className="border p-1 w-full"
                      value={editData.village || ""}
                      onChange={(e) => setEditData({ ...editData, village: e.target.value })}
                    />
                  </td>
                  <td className="p-2 border flex gap-2">
                    <button onClick={handleUpdate} className="bg-green-600 text-white px-2 py-1 rounded">Save</button>
                    <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-2 py-1 rounded">Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-2 border">{donor.name}</td>
                  <td className="p-2 border">{donor.bloodGroup}</td>
                  <td className="p-2 border">{donor.phone}</td>
                  <td className="p-2 border">{donor.upazila}</td>
                  <td className="p-2 border">{donor.union}</td>
                  <td className="p-2 border">{donor.village}</td>
                  <td className="p-2 border flex gap-2">
                    <button onClick={() => handleEdit(donor)} className="bg-blue-600 text-white px-2 py-1 rounded">Edit</button>
                    <button onClick={() => handleDelete(donor.id!)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      
    </div>
  );
}
