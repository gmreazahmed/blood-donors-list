import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BloodRequestAdmin from "../components/BloodRequestAdmin";
import FooterCommentsAdmin from "../components/FooterCommentsAdmin";
import { areaData } from "../data/upazila-union";
import { db } from "../firebase/config";

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

  const [active, setActive] = useState("donors");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("isAdmin") !== "true") {
      navigate("/admin-login");
    } else {
      fetchDonors();
    }
  }, [navigate]);

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
      await updateDoc(doc(db, "donors", editingId), editData);
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

  const getUnions = (upazila: string) => areaData[upazila] || [];

  const inputStyle =
    "w-full border border-gray-200 px-3 py-2 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-400 transition";

  const menuStyle = (active: boolean) =>
    `w-full text-left px-4 py-3 rounded-xl transition ${
      active
        ? "bg-red-500 text-white shadow"
        : "hover:bg-red-50 text-gray-700"
    }`;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-sm p-5 flex flex-col">

        <h2 className="text-2xl font-bold text-red-600 mb-8">🩸 Admin</h2>

        <div className="space-y-2">
          <button onClick={()=>setActive("donors")} className={menuStyle(active==="donors")}>👤 Donors</button>
          <button onClick={()=>setActive("requests")} className={menuStyle(active==="requests")}>🩸 Requests</button>
          <button onClick={()=>setActive("comments")} className={menuStyle(active==="comments")}>💬 Comments</button>
        </div>

        <button
          onClick={()=>{
            localStorage.removeItem("isAdmin");
            navigate("/admin-login");
          }}
          className="mt-auto bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl"
        >
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6">

        <h2 className="text-2xl font-bold mb-6">
          {active==="donors" && "👤 Donor Management"}
          {active==="requests" && "🩸 Blood Requests"}
          {active==="comments" && "💬 Comments"}
        </h2>

        {active==="donors" && (
          <>
            {/* ADD */}
            <section className="bg-white p-6 rounded-2xl shadow mb-6">

              <h3 className="mb-4 font-semibold">➕ Add Donor</h3>

              <div className="grid md:grid-cols-3 gap-4">
                <input className={inputStyle} placeholder="Name"
                  value={newDonor.name}
                  onChange={(e)=>setNewDonor({...newDonor,name:e.target.value})} />

                <input className={inputStyle} placeholder="Phone"
                  value={newDonor.phone}
                  onChange={(e)=>setNewDonor({...newDonor,phone:e.target.value})} />

                <select className={inputStyle}
                  value={newDonor.bloodGroup}
                  onChange={(e)=>setNewDonor({...newDonor,bloodGroup:e.target.value})}>
                  <option value="">Blood</option>
                  {bloodGroups.map(bg=><option key={bg}>{bg}</option>)}
                </select>

                <select className={inputStyle}
                  value={newDonor.upazila}
                  onChange={(e)=>setNewDonor({...newDonor,upazila:e.target.value,union:""})}>
                  <option value="">Upazila</option>
                  {Object.keys(areaData).map(u=><option key={u}>{u}</option>)}
                </select>

                <select className={inputStyle}
                  value={newDonor.union}
                  onChange={(e)=>setNewDonor({...newDonor,union:e.target.value})}>
                  <option value="">Union</option>
                  {getUnions(newDonor.upazila).map(u=><option key={u}>{u}</option>)}
                </select>

                <input className={inputStyle} placeholder="Village"
                  value={newDonor.village}
                  onChange={(e)=>setNewDonor({...newDonor,village:e.target.value})} />
              </div>

              <button onClick={handleAdd}
                className="mt-5 bg-red-500 text-white px-6 py-2 rounded-xl">
                Add
              </button>

            </section>

            {/* SEARCH */}
            <input
              placeholder="🔍 Search..."
              value={searchTerm}
              onChange={(e)=>setSearchTerm(e.target.value)}
              className="w-full mb-4 px-4 py-2 border rounded-xl"
            />

            {/* TABLE */}
            <section className="bg-white rounded-2xl shadow overflow-hidden">

              <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="p-3">Name</th>
                      <th className="p-3">Blood</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Upazila</th>
                      <th className="p-3">Union</th>
                      <th className="p-3">Village</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredDonors.map(donor=>(
                      <tr key={donor.id} className="border-t">

                        {editingId===donor.id ? (
                          <>
                            <td><input className={inputStyle} value={editData.name||""}
                              onChange={(e)=>setEditData({...editData,name:e.target.value})} /></td>

                            <td>
                              <select className={inputStyle} value={editData.bloodGroup||""}
                                onChange={(e)=>setEditData({...editData,bloodGroup:e.target.value})}>
                                {bloodGroups.map(bg=><option key={bg}>{bg}</option>)}
                              </select>
                            </td>

                            <td><input className={inputStyle} value={editData.phone||""}
                              onChange={(e)=>setEditData({...editData,phone:e.target.value})} /></td>

                            <td>
                              <select className={inputStyle} value={editData.upazila||""}
                                onChange={(e)=>setEditData({...editData,upazila:e.target.value,union:""})}>
                                {Object.keys(areaData).map(u=><option key={u}>{u}</option>)}
                              </select>
                            </td>

                            <td>
                              <select className={inputStyle} value={editData.union||""}
                                onChange={(e)=>setEditData({...editData,union:e.target.value})}>
                                {getUnions(editData.upazila||"").map(u=><option key={u}>{u}</option>)}
                              </select>
                            </td>

                            <td><input className={inputStyle} value={editData.village||""}
                              onChange={(e)=>setEditData({...editData,village:e.target.value})} /></td>

                            <td className="flex gap-2 p-2">
                              <button onClick={handleUpdate} className="bg-green-500 text-white px-3 py-1 rounded">Save</button>
                              <button onClick={()=>setEditingId(null)} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="p-3">{donor.name}</td>
                            <td className="p-3 text-red-500">{donor.bloodGroup}</td>
                            <td className="p-3">{donor.phone}</td>
                            <td className="p-3">{donor.upazila}</td>
                            <td className="p-3">{donor.union}</td>
                            <td className="p-3">{donor.village}</td>

                            <td className="p-3 flex gap-2">
                              <button onClick={()=>handleEdit(donor)} className="text-green-600">Edit</button>
                              <button onClick={()=>handleDelete(donor.id!)} className="text-red-600">Delete</button>
                            </td>
                          </>
                        )}

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 text-sm text-gray-500 border-t">
                Total: {filteredDonors.length}
              </div>

            </section>
          </>
        )}

        {active==="requests" && <BloodRequestAdmin />}
        {active==="comments" && <FooterCommentsAdmin />}

      </main>
    </div>
  );
}