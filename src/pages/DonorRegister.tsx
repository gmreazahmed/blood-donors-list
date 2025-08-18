import { useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { areaData } from "../data/upazila-union";
import { useNavigate } from "react-router-dom";

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
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error adding donor:", error);
    }
  };

  return (
    <section className="bg-red-50">
      <div className="max-w-2xl mx-auto p-6 mt-15">
        <h2 className="text-2xl font-bold text-center text-red-600 mb-6">
          রক্তদাতা নিবন্ধন ফর্ম
        </h2>

        {success && (
          <div className="bg-green-100 text-green-800 border border-green-300 rounded px-4 py-2 mb-4">
            ✅ সফলভাবে নিবন্ধন সম্পন্ন হয়েছে!
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-red-40 shadow-xl rounded-lg p-6 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium mb-1">পূর্ণ নাম *</label>
            <input
              type="text"
              name="name"
              placeholder="পূর্ণ নাম লিখুন"
              value={form.name}
              onChange={handleChange}
              className="border border-gray-300 rounded w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">রক্তের গ্রুপ *</label>
            <select
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
              className="border border-gray-300 rounded w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            >
              <option value="">রক্তের গ্রুপ নির্বাচন করুন</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">উপজেলা *</label>
            <select
              name="upazila"
              value={form.upazila}
              onChange={handleChange}
              className="border border-gray-300 rounded w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
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

          {form.upazila && (
            <div>
              <label className="block text-sm font-medium mb-1">ইউনিয়ন *</label>
              <select
                name="union"
                value={form.union}
                onChange={handleChange}
                className="border border-gray-300 rounded w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
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

          <div>
            <label className="block text-sm font-medium mb-1">গ্রাম *</label>
            <input
              type="text"
              name="village"
              value={form.village}
              onChange={handleChange}
              placeholder="গ্রামের নাম"
              className="border border-gray-300 rounded w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">মোবাইল নাম্বার *</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="01XXXXXXXXX"
              className="border border-gray-300 rounded w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              সর্বশেষ রক্তদানের তারিখ <span className="text-gray-500">(ঐচ্ছিক)</span>
            </label>
            <input
              type="date"
              name="lastDonateDate"
              value={form.lastDonateDate}
              onChange={handleChange}
              className="border border-gray-300 rounded w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-700 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition"
          >
            নিবন্ধন করুন
          </button>
        </form>

        <p className="text-red-600 mt-6  text-center text-xs">
          (বর্তমানে সাতক্ষীরার কালিগঞ্জ উপজেলার জন্য চালু আছে)
        </p>
      </div>
    </section>
  );
}
