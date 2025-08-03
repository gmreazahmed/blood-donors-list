import { useState } from "react";
import { Link } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/config";
import { FaFacebook, FaUsers } from "react-icons/fa";

export default function Footer() {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "footerComments"), {
        name,
        comment,
        createdAt: new Date(),
      });
      setName("");
      setComment("");
      alert("ধন্যবাদ, আপনার মন্তব্য সংরক্ষণ করা হয়েছে।");
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-red-100  mt- text-sm text-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Section 1: Info */}
        <div className="space-y-4">
          <h2 className="text-2xl font-extrabold text-red-600">Rokto Data</h2>
          <p className="leading-relaxed text-justify text-gray-700">
            সাইটটি জনসেবামূলক উদ্দেশ্যে তৈরি করা হয়েছে এবং সকলের জন্য উন্মুক্ত।
            রক্তদাতারা সহজেই তথ্য হালনাগাদ করতে পারবেন এবং প্রয়োজনকারীরা দ্রুত রক্তদাতা খুঁজে পাবেন।
            বর্তমানে এটি সাতক্ষীরা জেলার কালিগঞ্জ উপজেলার জন্য চালু রয়েছে।
          </p>
        </div>

        {/* Section 2: Links */}
        <div className="space-y-6 ">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2 text-lg">Important Links</h3>
            <ul className="space-y-2 text-gray-700">
              <li><Link to="/" className="hover:text-red-600 transition">Donor List</Link></li>
              <li><Link to="/register" className="hover:text-red-600 transition">Register Donor</Link></li>
              <li><Link to="/siteinfo" className="hover:text-red-600 transition">Site Info</Link></li>
              <li><Link to="/admin" className="hover:text-red-600 transition">Admin Panel</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2 text-lg">Social Links</h3>
            <div className="flex gap-5 text-2xl text-gray-600">
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                title="Facebook Page"
                className="hover:text-red-600 transition"
              >
                <FaFacebook />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                title="Facebook Group"
                className="hover:text-red-600 transition"
              >
                <FaUsers />
              </a>
            </div>
          </div>
        </div>

        {/* Section 3: Comment Box */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 ">
            পরামর্শ বা ভুল তথ্য থাকলে আমাদের জানান-
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="নাম/মোবাইল নম্বর"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <textarea
              placeholder="মন্তব্য"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={4}
              required
            ></textarea>
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition font-medium w-full"
            >
              {loading ? "পাঠানো হচ্ছে..." : "মন্তব্য পাঠান"}
            </button>
          </form>
        </div>
      </div>

      <div className="text-center border-t py-4 text-xs text-gray-500 select-none">
        &copy; {new Date().getFullYear()} Rokto Data. All rights reserved.
      </div>
    </footer>
  );
}
