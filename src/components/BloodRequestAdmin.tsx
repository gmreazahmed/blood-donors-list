"use client";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";

interface RequestData {
  name: string;
  age: number;
  bloodGroup: string;
  contact: string;
}

type BloodRequest = {
  id: string;
  name: string;
  phone: string;
  bloodGroup: string;
  hospital: string;
  reason: string;
  fulfilled: boolean;
  createdAt: RequestData;
};

export default function BloodRequestAdmin() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<
    Omit<BloodRequest, "id" | "createdAt">
  >({
    name: "",
    phone: "",
    bloodGroup: "",
    hospital: "",
    reason: "",
    fulfilled: false,
  });

  const fetchRequests = async () => {
    const q = query(
      collection(db, "bloodRequests"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<BloodRequest, "id">),
    }));
    setRequests(data);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleEditClick = (req: BloodRequest) => {
    setEditingId(req.id);
    setEditForm({
      name: req.name,
      phone: req.phone,
      bloodGroup: req.bloodGroup,
      hospital: req.hospital,
      reason: req.reason,
      fulfilled: req.fulfilled,
    });
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setEditForm((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setEditForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    await updateDoc(doc(db, "bloodRequests", editingId), editForm);
    setEditingId(null);
    fetchRequests();
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("আপনি কি নিশ্চিতভাবে এই অনুরোধ মুছতে চান?");
    if (!confirm) return;
    await deleteDoc(doc(db, "bloodRequests", id));
    fetchRequests();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow mt-10 mx-auto">
      <h2 className="text-xl font-semibold mb-4">রক্তের অনুরোধসমূহ</h2>

      {requests.length === 0 ? (
        <p>কোন রক্তের অনুরোধ নেই।</p>
      ) : (
        <div className="space-y-6">
          {requests.map((req) =>
            editingId === req.id ? (
              <div
                key={req.id}
                className="border p-4 rounded-md bg-gray-50 space-y-2"
              >
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                  placeholder="নাম"
                />
                <input
                  type="text"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                  placeholder="ফোন"
                />
                <select
                  name="bloodGroup"
                  value={editForm.bloodGroup}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="">রক্তের গ্রুপ নির্বাচন করুন</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    )
                  )}
                </select>
                <input
                  type="text"
                  name="hospital"
                  value={editForm.hospital}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                  placeholder="হাসপাতাল"
                />
                <textarea
                  name="reason"
                  value={editForm.reason}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                  placeholder="কারণ"
                ></textarea>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="fulfilled"
                    checked={editForm.fulfilled}
                    onChange={handleEditChange}
                  />
                  Fulfilled
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={handleUpdate}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={req.id}
                className="border p-4 rounded-md bg-white shadow-sm flex justify-between items-start"
              >
                <div>
                  <p className="font-semibold">
                    {req.name} ({req.bloodGroup})
                  </p>
                  <p>📞 {req.phone}</p>
                  <p>🏥 {req.hospital}</p>
                  <p>📝 {req.reason}</p>
                  <p className="text-sm text-gray-500">
                    {req.fulfilled ? "Fulfilled" : "Pending"}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleEditClick(req)}
                    className="border border-green-500 text-green-500 hover:bg-green-500 hover:text-white text-xs px-3 py-1 rounded transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(req.id)}
                    className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-xs px-3 py-1 rounded transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
