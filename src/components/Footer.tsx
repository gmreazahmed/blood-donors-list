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
  <footer className="bg-gradient-to-b from-red-50 via-white to-red-100 mt-20 border-t border-gray-200">

    <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">

      {/* Brand */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-red-600">
          🩸 RoktoData
        </h2>

        <p className="text-gray-600 text-sm leading-relaxed">
          Kaliganj এলাকার রক্তদাতাদের খুঁজে পেতে এই platform তৈরি করা হয়েছে।
          সহজেই donor খুঁজুন এবং জরুরি সময়ে জীবন বাঁচাতে সাহায্য করুন।
        </p>

        {/* SEO hidden keywords */}
        <p className="hidden">
          blood donor list kaliganj, kaliganj blood donor, roktodata satkhira
        </p>
      </div>

      {/* Links */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-4">
          Quick Links
        </h3>

        <ul className="space-y-2 text-gray-600 text-sm">
          <li>
            <Link to="/" className="hover:text-red-600 transition">
              Donor List
            </Link>
          </li>
          <li>
            <Link to="/register" className="hover:text-red-600 transition">
              Register Donor
            </Link>
          </li>
          <li>
            <Link to="/blood-request" className="hover:text-red-600 transition">
              Request Blood
            </Link>
          </li>
          <li>
            <Link to="/siteinfo" className="hover:text-red-600 transition">
              Site Info
            </Link>
          </li>
        </ul>

        {/* Social */}
        <div className="flex gap-4 mt-5 text-gray-600 text-xl">
          <a
            href="https://www.facebook.com/roktodata.online"
            target="_blank"
            rel="noreferrer"
            className="hover:text-red-600 transition"
          >
            <FaFacebook />
          </a>
          <a
            href="https://www.facebook.com/groups/roktodata.online"
            target="_blank"
            rel="noreferrer"
            className="hover:text-red-600 transition"
          >
            <FaUsers />
          </a>
        </div>
      </div>

      {/* Feedback */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-4">
          Feedback
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            type="text"
            placeholder="নাম / ফোন"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg text-sm focus:ring-2 focus:ring-red-400"
            required
          />

          <textarea
            placeholder="আপনার মতামত লিখুন..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg text-sm focus:ring-2 focus:ring-red-400"
            rows={3}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm transition"
          >
            {loading ? "Sending..." : "Submit"}
          </button>

        </form>
      </div>

    </div>

    {/* Bottom */}
    <div className="text-center text-xs text-gray-500 border-t py-4">
      © {new Date().getFullYear()} RoktoData — All rights reserved.
    </div>

  </footer>
);
}
