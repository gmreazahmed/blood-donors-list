import {
  addDoc,
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { areaData } from "../data/upazila-union";
import { db } from "../firebase/config";

export default function DonorRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    bloodGroup: "",
    upazila: "",
    union: "",
    village: "",
    phone: "",
    lastDonateDate: "",
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Required fields check
    if (
      !form.name ||
      !form.bloodGroup ||
      !form.upazila ||
      !form.union ||
      !form.phone
    ) {
      alert("অনুগ্রহ করে সব প্রয়োজনীয় ঘর পূরণ করুন।");
      return;
    }

    // ✅ Phone validation
    const phoneRegex = /^01[0-9]{9}$/;
    if (!phoneRegex.test(form.phone)) {
      alert("⚠️ অনুগ্রহ করে সঠিক ফোন নাম্বার লিখুন (01XXXXXXXXX)");
      return;
    }

    // ✅ Check if phone already exists
    try {
      const donorsRef = collection(db, "donors");
      const q = query(donorsRef, where("phone", "==", form.phone));
      const snap = await getDocs(q);

      if (!snap.empty) {
        alert("⚠️ এই ফোন নাম্বার দিয়ে ইতিমধ্যে রেজিস্ট্রেশন করা হয়েছে!");
        return;
      }
    } catch (err) {
      console.error("Error checking phone duplicate:", err);
      alert("দুঃখিত, ফোন চেক করতে সমস্যা হয়েছে।");
      return;
    }

    // ✅ Confirm phone
    const isConfirmed = window.confirm(
      `আপনি কি এই ফোন নাম্বারটি নিশ্চিত করছেন? ${form.phone}`
    );
    if (!isConfirmed) return;

    // ✅ Add donor
    try {
      await addDoc(collection(db, "donors"), {
        ...form,
        createdAt: Timestamp.now(),
      });

      setForm({
        name: "",
        bloodGroup: "",
        upazila: "",
        union: "",
        village: "",
        phone: "",
        lastDonateDate: "",
      });

      setSuccess(true);
      navigate("/");
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error adding donor:", error);
      alert("দুঃখিত, ডোনর সংযুক্ত করতে সমস্যা হয়েছে।");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-pink-50 to-red-200 p-6">
      <div className="container mx-auto w-full relative">
        {/* Glass Card */}
        <div className="backdrop-blur-xl bg-white/40 shadow-2xl border border-white/30 rounded-3xl p-8">
          {success && (
            <div className="mb-4 px-4 py-2 rounded-lg bg-green-100 border border-green-400 text-green-700">
              ✅ রক্তদাতা সফলভাবে সংযুক্ত হয়েছে!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                পূর্ণ নাম *
              </label>
              <input
                type="text"
                name="name"
                placeholder="পূর্ণ নাম লিখুন"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white/70 shadow-sm focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition"
                required
              />
            </div>
            {/* Blood Group */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                রক্তের গ্রুপ *
              </label>
              <select
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white/70 shadow-sm focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition"
                required
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
            </div>
            {/* Upazila */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                উপজেলা *
              </label>
              <select
                name="upazila"
                value={form.upazila}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white/70 shadow-sm focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition"
                required
              >
                <option value="">উপজেলা নির্বাচন করুন</option>
                {Object.keys(areaData).map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
            {/* Union */}
            {form.upazila && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  ইউনিয়ন *
                </label>
                <select
                  name="union"
                  value={form.union}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white/70 shadow-sm focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition"
                  required
                >
                  <option value="">ইউনিয়ন নির্বাচন করুন</option>
                  {areaData[form.upazila].map((union) => (
                    <option key={union} value={union}>
                      {union}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {/* Village */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                গ্রাম *
              </label>
              <input
                type="text"
                name="village"
                value={form.village}
                onChange={handleChange}
                placeholder="গ্রামের নাম"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white/70 shadow-sm focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition"
                required
              />
            </div>
            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                মোবাইল নাম্বার *
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white/70 shadow-sm focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition"
                required
              />
            </div>
            {/* Last Donate */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                সর্বশেষ রক্তদানের তারিখ{" "}
                <span className="text-gray-500">(ঐচ্ছিক)</span>
              </label>
              <input
                type="date"
                name="lastDonateDate"
                value={form.lastDonateDate}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white/70 shadow-sm focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition"
              />
            </div>
            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform hover:scale-[1.02] transition"
            >
              নিবন্ধন করুন
            </button>
          </form>

          <p className="text-red-700 mt-6 text-center text-xs font-medium">
            (বর্তমানে সাতক্ষীরার কালিগঞ্জ উপজেলার জন্য চালু আছে)
          </p>
        </div>
      </div>
    </section>
  );
}
