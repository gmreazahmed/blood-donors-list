import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { FaFacebook, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import { db } from "../firebase/config";

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
    <footer className="relative bg-gradient-to-b from-red-100 via-pink-50 to-red-200 mt-16">
      <div className="absolute inset-0 backdrop-blur-xl bg-white/40"></div>

      <div className="relative container mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Section 1: Info */}
        <div className="space-y-4">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            Rokto Data
          </h2>
          <p className="leading-relaxed text-gray-700 text-justify">
            সাইটটি জনসেবামূলক উদ্দেশ্যে তৈরি করা হয়েছে এবং সকলের জন্য উন্মুক্ত।
            রক্তদাতারা সহজেই তথ্য হালনাগাদ করতে পারবেন এবং প্রয়োজনকারীরা দ্রুত
            রক্তদাতা খুঁজে পাবেন। বর্তমানে এটি সাতক্ষীরা জেলার কালিগঞ্জ উপজেলার
            জন্য চালু রয়েছে।
          </p>
        </div>

        {/* Section 2: Links */}
        <div className="space-y-8">
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 text-lg">
              Important Links
            </h3>
            <ul className="space-y-2 text-gray-700 font-medium">
              <li>
                <Link
                  to="/"
                  className="hover:text-red-600 transition-colors duration-200"
                >
                  Donor List
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="hover:text-red-600 transition-colors duration-200"
                >
                  Register Donor
                </Link>
              </li>
              <li>
                <Link
                  to="/siteinfo"
                  className="hover:text-red-600 transition-colors duration-200"
                >
                  Site Info
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="hover:text-red-600 transition-colors duration-200"
                >
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3 text-lg">
              Social Links
            </h3>
            <div className="flex gap-6 text-2xl text-gray-600">
              <a
                href="https://www.facebook.com/roktodata.online"
                target="_blank"
                rel="noreferrer"
                title="Facebook Page"
                className="hover:text-red-600 hover:scale-110 transform transition"
              >
                <FaFacebook />
              </a>
              <a
                href="https://www.facebook.com/groups/roktodata.online"
                target="_blank"
                rel="noreferrer"
                title="Facebook Group"
                className="hover:text-red-600 hover:scale-110 transform transition"
              >
                <FaUsers />
              </a>
            </div>
          </div>
        </div>

        {/* Section 3: Comment Box */}
        <div className="space-y-5">
          <h3 className="font-semibold text-gray-800 text-lg">
            পরামর্শ বা ভুল তথ্য থাকলে আমাদের জানান -
          </h3>
          <form
            onSubmit={handleSubmit}
            className="space-y-3 bg-white/50 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/40"
          >
            <input
              type="text"
              placeholder="নাম/মোবাইল নম্বর"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              required
            />
            <textarea
              placeholder="মন্তব্য"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              rows={4}
              required
            ></textarea>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white px-5 py-2.5 rounded-xl shadow-md font-medium transition transform hover:scale-[1.02]"
            >
              {loading ? "পাঠানো হচ্ছে..." : "মন্তব্য পাঠান"}
            </button>
          </form>
        </div>
      </div>

      <div className="relative text-center border-t border-white/40 py-5 text-xs text-gray-600 select-none">
        &copy; {new Date().getFullYear()} Rokto Data. All rights reserved.
      </div>
    </footer>
  );
}
