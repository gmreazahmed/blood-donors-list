import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy,
  limit,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

type BloodRequest = {
  id: string;
  name: string;
  phone: string;
  bloodGroup: string;
  hospital: string; //
  reason: string; // 
  fulfilled: boolean;
  createdAt: any;
};

export default function BloodRequestPage() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    bloodGroup: "",
    hospital: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch recent 10 requests
  const fetchRequests = async () => {
    const q = query(collection(db, "bloodRequests"), orderBy("createdAt", "desc"), limit(10));
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

  // Handle "Solve" button click
  const handleSolve = async (id: string) => {
    await updateDoc(doc(db, "bloodRequests", id), { fulfilled: true });
    fetchRequests();
  };

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, phone, bloodGroup, hospital, reason } = form;
    if (!name || !phone || !bloodGroup || !hospital || !reason) {
      alert("অনুগ্রহ করে সব তথ্য পূরণ করুন।");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "bloodRequests"), {
        ...form,
        fulfilled: false,
        createdAt: Timestamp.now(),
      });
      alert("আপনার রক্তের অনুরোধ সফলভাবে পাঠানো হয়েছে।");
      setForm({ name: "", phone: "", bloodGroup: "", hospital: "", reason: "" });
      fetchRequests();
    } catch (err) {
      alert("ত্রুটি ঘটেছে, অনুগ্রহ করে আবার চেষ্টা করুন।");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-red-600 mb-6 text-center">রক্তের অনুরোধসমূহ</h2>

      {/* Request List */}
      <div className="space-y-6 mb-10">
        {requests.length === 0 && (
          <p className="text-center text-gray-500 mt-10">কোনো রক্তের অনুরোধ পাওয়া যায়নি।</p>
        )}

        {requests.map((req) => (
          <div
            key={req.id}
            className={`border rounded-lg shadow-md p-5 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}
          >
            <div className="flex flex-col space-y-1 max-w-md">
              <h3 className="text-xl font-semibold text-red-600">{req.name}</h3>
              <p className="text-gray-700 text-sm flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h1l2 7h13l2-7h1" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10V7a2 2 0 012-2h10a2 2 0 012 2v3" />
                </svg>
                <a href={`tel:${req.phone}`} className="hover:underline font-medium text-blue-700">
                  {req.phone}
                </a>
              </p>
              <p className="text-gray-700 text-sm">
                <span className="font-semibold">রক্তের গ্রুপ: </span>{req.bloodGroup}
              </p>
              <p className="text-gray-700 text-sm">
                <span className="font-semibold">হাসপাতাল/ক্লিনিক: </span>{req.hospital}
              </p>
              <p className="text-gray-700 text-sm">
                <span className="font-semibold">রোগীর সমস্যা: </span>{req.reason}
              </p>
            </div>

            <div className="flex flex-col justify-center items-center">
              {!req.fulfilled ? (
                <button
                  onClick={() => handleSolve(req.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md shadow-md transition"
                >
                  Solve
                </button>
              ) : (
                <span className="text-gray-500 font-semibold px-4 py-2 border border-gray-300 rounded-md select-none">
                  Fulfilled
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Request Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-red-600 mb-4 text-center">নতুন রক্তের অনুরোধ পাঠান</h3>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="আপনার নাম"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="ফোন নম্বর"
            className="w-full border rounded px-3 py-2"
            required
          />
          <select
            name="bloodGroup"
            value={form.bloodGroup}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">রক্তের গ্রুপ নির্বাচন করুন</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
          <input
            type="text"
            name="hospital"
            value={form.hospital}
            onChange={handleChange}
            placeholder="হাসপাতাল/ক্লিনিক"
            className="w-full border rounded px-3 py-2"
            required
          />
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            placeholder="রোগীর সমস্যা / প্রয়োজন"
            className="w-full border rounded px-3 py-2"
            rows={3}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
          >
            {loading ? "অনুরোধ প্রেরণ হচ্ছে..." : "অনুরোধ পাঠান"}
          </button>
        </form>
      </div>
    </div>
  );
}
