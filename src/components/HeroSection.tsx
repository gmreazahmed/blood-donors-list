import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const slideTexts = [
  "এক ফোঁটা রক্ত, একটি নতুন জীবন।",
  "রক্ত দিন, মানবতা বাঁচান।",
  "রক্তদান করুন, ভালোবাসা ছড়িয়ে দিন।",
  "আপনার রক্ত অন্যের জীবন বাঁচাতে পারে।",
  "রক্ত দিন, সম্পর্ক গড়ুন মানবতার সাথে।",
  "একজন রক্তদাতা, শতজনের বাঁচার আশা।",
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const [paused] = useState(false);

  // Browser setInterval returns number
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!paused) {
      intervalRef.current = window.setInterval(() => {
        setIndex((prev) => (prev + 1) % slideTexts.length);
      }, 4000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [paused]);

  function handleScrollToDonors(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    const element = document.getElementById("donorListSection");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden">

  {/* Background Gradient */}
  <div className="absolute inset-0 bg-gradient-to-br from-red-100 via-white to-red-50"></div>

  {/* Glow Effects */}
  <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-red-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
  <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-pink-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>

  <div className="relative max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

    {/* LEFT */}
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center lg:text-left"
    >

      {/* Main Heading */}
      <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
        Rokto  <span className="text-red-600">Data</span>
      </h1>

      {/* Slider Text */}
      <div className="mt-6 h-[80px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="text-lg sm:text-xl font-semibold text-red-600"
          >
            {slideTexts[index]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Subtext */}
      <p className="mt-4 text-gray-600 max-w-xl mx-auto lg:mx-0">
        Kaliganj এলাকার রক্তদাতাদের খুঁজুন অথবা নিজে রক্তদান করে একটি জীবন বাঁচান।
      </p>

      {/* Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">

        <button
          onClick={handleScrollToDonors}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition transform hover:scale-105"
        >
          Donor খুঁজুন
        </button>

        <Link
          to="/register"
          className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-3 rounded-xl font-semibold transition transform hover:scale-105"
        >
          Donor হোন
        </Link>

      </div>
    </motion.div>

    {/* RIGHT IMAGE */}
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
      className="flex justify-center"
    >
      <img
        src="/hero.jpg"
        alt="Blood Donation"
        className="w-full max-w-md rounded-3xl shadow-2xl border border-white"
      />
    </motion.div>

  </div>

  {/* Scroll Indicator */}
  <div className="absolute bottom-6 w-full flex justify-center">
    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
      className="text-red-500 text-sm"
    >
      ↓ Scroll
    </motion.div>
  </div>

</section>
  );
}

/* Add these Tailwind animations in global.css */
