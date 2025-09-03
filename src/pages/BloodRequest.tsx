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
    <section className="bg-red-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 min-h-screen">
        <h2 className="text-xl font-bold text-center text-red-600 mb-8">
          রক্তের অনুরোধসমূহ
        </h2>

        {/* Request List */}
        <div className="space-y-6 mb-12">
          {requests.length === 0 && (
            <p className="text-center text-gray-500">
              কোনো রক্তের অনুরোধ পাওয়া যায়নি।
            </p>
          )}
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-red-30 rounded-xl shadow-sm p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-red-600">
                  {req.name}
                </h3>
                <p className="text-sm text-gray-700">
                  📞{" "}
                  <a
                    href={`tel:${req.phone}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {req.phone}
                  </a>
                </p>
                <p className="text-sm text-gray-700">
                  🩸 <span className="font-medium">গ্রুপ:</span>{" "}
                  {req.bloodGroup}
                </p>
                <p className="text-sm text-gray-700">
                  🏥 <span className="font-medium">হাসপাতাল:</span>{" "}
                  {req.hospital}
                </p>
                <p className="text-sm text-gray-700">
                  📝 <span className="font-medium">কারণ:</span> {req.reason}
                </p>
              </div>
              <div>
                {!req.fulfilled ? (
                  <button
                    onClick={() => handleSolve(req.id)}
                    className="px-5 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition"
                  >
                    Solve
                  </button>
                ) : (
                  <span className="px-4 py-2 rounded-md text-xs bg-gray-100 text-gray-600 border border-gray-300">
                    Fulfilled
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Request Form */}
        <div className="bg-red-30 rounded-xl shadow-md p-6 sm:p-8">
          <h3 className="text-xl font-semibold text-center text-red-600 mb-6">
            নতুন রক্তের অনুরোধ পাঠান
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="আপনার নাম"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="ফোন নম্বর"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <select
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="">রক্তের গ্রুপ নির্বাচন করুন</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="hospital"
              value={form.hospital}
              onChange={handleChange}
              placeholder="হাসপাতাল/ক্লিনিক"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              placeholder="রোগীর সমস্যা / প্রয়োজন"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={3}
              required
            ></textarea>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-700 hover:bg-red-600 text-white py-2 rounded-md font-semibold transition"
            >
              {loading ? "অনুরোধ প্রেরণ হচ্ছে..." : "অনুরোধ পাঠান"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
