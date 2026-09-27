import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { FaFacebook, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import { db } from "../firebase/config";

export default function Footer() {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !comment.trim()) return;

    setLoading(true);
    setSubmitted(false);

    try {
      await addDoc(collection(db, "footerComments"), {
        name: name.trim(),
        comment: comment.trim(),
        createdAt: serverTimestamp(),
      });

      setName("");
      setComment("");
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("মন্তব্য পাঠানো যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-red-100 bg-gradient-to-b from-white via-red-50/50 to-red-100/70">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-red-200/20 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-red-300/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
          {/* BRAND */}
          <div>
            <Link
              to="/"
              className="group inline-flex items-center gap-3"
              aria-label="RoktoData Home"
            >
              {/* Actual RoktoData logo */}
              <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-lg shadow-red-200 transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/roktoData.png"
                  alt="RoktoData logo"
                  className="h-full w-full object-contain p-1.5"
                />
              </span>

              <div>
                <span className="block text-2xl font-extrabold tracking-tight text-gray-900">
                  Rokto<span className="text-red-600">Data</span>
                </span>

                <span className="block text-xs font-medium tracking-wide text-gray-500">
                  Blood Donor Directory
                </span>
              </div>
            </Link>

            <p className="mt-6 max-w-md text-sm leading-7 text-gray-600">
              কালীগঞ্জের রক্তদাতা খুঁজে পাওয়ার জন্য RoktoData একটি সহজ
              অনলাইন blood donor directory। জরুরি সময়ে প্রয়োজনীয় রক্তদাতার
              তথ্য খুঁজে পেতে এবং স্বেচ্ছায় রক্তদানে উৎসাহিত করতে এই
              প্ল্যাটফর্ম তৈরি করা হয়েছে।
            </p>

            {/* Trust badge */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-red-100 bg-white px-4 py-2 text-xs font-medium text-gray-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              মানবিক সহায়তার জন্য তৈরি
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Quick Links
            </h3>

            <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <Link
                to="/donors"
                className="group flex items-center gap-2 text-gray-600 transition hover:text-red-600"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-red-300 transition group-hover:bg-red-600" />
                রক্তদাতা খুঁজুন
              </Link>

              <Link
                to="/register"
                className="group flex items-center gap-2 text-gray-600 transition hover:text-red-600"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-red-300 transition group-hover:bg-red-600" />
                রক্তদাতা হোন
              </Link>

              <Link
                to="/blood-request"
                className="group flex items-center gap-2 text-gray-600 transition hover:text-red-600"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-red-300 transition group-hover:bg-red-600" />
                রক্তের অনুরোধ
              </Link>

              <Link
                to="/siteinfo"
                className="group flex items-center gap-2 text-gray-600 transition hover:text-red-600"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-red-300 transition group-hover:bg-red-600" />
                সাইট সম্পর্কে
              </Link>

              <Link
                to="/"
                className="group flex items-center gap-2 text-gray-600 transition hover:text-red-600"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-red-300 transition group-hover:bg-red-600" />
                হোম
              </Link>
            </div>

            {/* Social */}
            <div className="mt-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                আমাদের সাথে যুক্ত থাকুন
              </p>

              <div className="flex items-center gap-3">
                <a
                  href="https://www.facebook.com/roktodata.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="RoktoData Facebook Page"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:text-red-600 hover:shadow-md"
                >
                  <FaFacebook className="text-lg" />
                </a>

                <a
                  href="https://www.facebook.com/groups/roktodata.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="RoktoData Facebook Group"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:text-red-600 hover:shadow-md"
                >
                  <FaUsers className="text-lg" />
                </a>
              </div>
            </div>
          </div>

          {/* FEEDBACK */}
          <div>
            <div className="mb-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                আপনার মতামত
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                RoktoData আরও ভালো করতে আপনার পরামর্শ আমাদের জানান।
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <label htmlFor="footer-name" className="sr-only">
                আপনার নাম বা ফোন
              </label>

              <input
                id="footer-name"
                type="text"
                placeholder="নাম / ফোন"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                autoComplete="name"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                required
              />

              <label htmlFor="footer-comment" className="sr-only">
                আপনার মতামত
              </label>

              <textarea
                id="footer-comment"
                placeholder="আপনার মতামত লিখুন..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={1000}
                rows={4}
                className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? "পাঠানো হচ্ছে..." : "মতামত পাঠান"}
              </button>

              {submitted && (
                <div
                  role="status"
                  className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
                >
                  ✓ ধন্যবাদ! আপনার মন্তব্য সংরক্ষণ করা হয়েছে।
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-gradient-to-r from-transparent via-red-200 to-transparent" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-xs leading-5 text-gray-500">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-gray-700">RoktoData</span>.
            All rights reserved.
          </p>

          <p className="text-xs text-gray-500">
            রক্ত দিন · জীবন বাঁচান ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}