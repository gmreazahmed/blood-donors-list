import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
interface BloodRequests {
  name: string;
  bloodGroup: string;
  location: string;
  phone: string;
}
type BloodRequest = {
  id: string;
  name: string;
  phone: string;
  bloodGroup: string;
  hospital: string;
  reason: string;
  fulfilled: boolean;
  createdAt: BloodRequests;
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

  const fetchRequests = async () => {
    const q = query(
      collection(db, "bloodRequests"),
      orderBy("createdAt", "desc"),
      limit(10)
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

  const handleSolve = async (id: string) => {
    await updateDoc(doc(db, "bloodRequests", id), { fulfilled: true });
    fetchRequests();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
      setForm({
        name: "",
        phone: "",
        bloodGroup: "",
        hospital: "",
        reason: "",
      });
      fetchRequests();
    } catch (err) {
      alert("ত্রুটি ঘটেছে, অনুগ্রহ করে আবার চেষ্টা করুন।");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

 return (
  <section className="min-h-screen bg-gradient-to-b from-red-50 via-white to-red-50 py-10">
    <div className="max-w-5xl mx-auto px-4">

      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-red-600">
          Blood Request
        </h2>
        <p className="text-gray-500 mt-2">
          জরুরি রক্তের জন্য অনুরোধ করুন অথবা অন্যদের সাহায্য করুন
        </p>
      </div>

      {/* Request List */}
      <div className="space-y-5 mb-12">
        {requests.length === 0 ? (
          <p className="text-center text-gray-400">
            😔 কোনো রক্তের অনুরোধ পাওয়া যায়নি
          </p>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 flex flex-col md:flex-row justify-between gap-4"
            >
              <div className="space-y-2 text-sm">
                <h3 className="text-lg font-semibold text-red-600">
                  {req.name}
                </h3>

                <p>
                  📞{" "}
                  <a
                    href={`tel:${req.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {req.phone}
                  </a>
                </p>

                <p>🩸 <b>{req.bloodGroup}</b></p>
                <p>🏥 {req.hospital}</p>
                <p className="text-gray-600">📝 {req.reason}</p>
              </div>

              <div className="flex items-center">
                {!req.fulfilled ? (
                  <button
                    onClick={() => handleSolve(req.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg text-sm shadow transition"
                  >
                    ✔ Solve
                  </button>
                ) : (
                  <span className="text-xs bg-gray-100 px-4 py-2 rounded-lg text-gray-600">
                    Fulfilled
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
        <h3 className="text-xl font-semibold text-center text-red-600 mb-6">
          নতুন রক্তের অনুরোধ পাঠান
        </h3>

        <form onSubmit={handleSubmit} className="grid gap-4">

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="নাম"
            className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-red-400"
            required
          />

          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="ফোন নম্বর"
            className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-red-400"
            required
          />

          <select
            name="bloodGroup"
            value={form.bloodGroup}
            onChange={handleChange}
            className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-red-400"
            required
          >
            <option value="">রক্তের গ্রুপ</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
              <option key={bg}>{bg}</option>
            ))}
          </select>

          <input
            type="text"
            name="hospital"
            value={form.hospital}
            onChange={handleChange}
            placeholder="হাসপাতাল"
            className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-red-400"
            required
          />

          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            placeholder="সমস্যা / প্রয়োজন"
            className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-red-400"
            rows={3}
            required
          ></textarea>

          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition"
          >
            {loading ? "Sending..." : "অনুরোধ পাঠান"}
          </button>

        </form>
      </div>

    </div>
  </section>
);
}
