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
  <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100 p-6">
    <div className="w-full max-w-2xl">

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-red-600">
            🩸 Donor Registration
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            রক্তদাতা হিসেবে যুক্ত হয়ে একটি জীবন বাঁচাতে সাহায্য করুন
          </p>
        </div>

        {success && (
          <div className="mb-4 text-center bg-green-100 text-green-700 py-2 rounded-lg">
            ✅ সফলভাবে রেজিস্ট্রেশন সম্পন্ন হয়েছে
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4">

          <input
            type="text"
            name="name"
            placeholder="পূর্ণ নাম"
            value={form.name}
            onChange={handleChange}
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

          <select
            name="upazila"
            value={form.upazila}
            onChange={handleChange}
            className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-red-400"
            required
          >
            <option value="">উপজেলা</option>
            {Object.keys(areaData).map((area) => (
              <option key={area}>{area}</option>
            ))}
          </select>

          {form.upazila && (
            <select
              name="union"
              value={form.union}
              onChange={handleChange}
              className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-red-400"
              required
            >
              <option value="">ইউনিয়ন</option>
              {areaData[form.upazila].map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          )}

          <input
            type="text"
            name="village"
            placeholder="গ্রাম"
            value={form.village}
            onChange={handleChange}
            className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-red-400"
          />

          <input
            type="tel"
            name="phone"
            placeholder="ফোন নম্বর (01XXXXXXXXX)"
            value={form.phone}
            onChange={handleChange}
            className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-red-400"
            required
          />

          <input
            type="date"
            name="lastDonateDate"
            value={form.lastDonateDate}
            onChange={handleChange}
            className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-red-400"
          />

          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition"
          >
            নিবন্ধন করুন
          </button>

        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          বর্তমানে শুধু কালিগঞ্জ উপজেলার জন্য চালু আছে
        </p>

      </div>
    </div>
  </section>
);
}
