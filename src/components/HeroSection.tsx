import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Typewriter from "typewriter-effect";
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
  const [paused, setPaused] = useState(false);

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
    <section className="relative  w-full py-20 px-6 sm:px-10 overflow-hidden pt-[80px] lg:pt-[100px] xl:pt-[150px] 2xl:pt-[250px]">
      {/* Animated Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-100 via-pink-50 to-red-100 animate-pulse-slow"></div>
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="relative container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* LEFT: Text */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left relative z-10"
        >
          {/* SLIDER TEXT */}
          <div
            className="relative h-[100px] sm:h-[180px] overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.h1
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -40, scale: 0.95 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute w-full text-2xl sm:text-5xl font-extrabold bg-gradient-to-r from-red-600 to-red-900 bg-clip-text text-transparent leading-snug"
              >
                {slideTexts[index]}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* SUBTEXT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="pt-[14px] sm:pt-[15px] md:pt-[16px] lg:pt-[20px] xl:pt-[24px] 2xl:pt-[32px] font-semibold text-gray-700 text-base sm:text-lg max-w-xl mx-auto lg:mx-0"
          >
            <Typewriter
              options={{
                strings: [
                  "আমাদের মাধ্যমে দ্রুত রক্তদাতা খুঁজুন বা রক্ত দান করুন।",
                ],
                autoStart: true,
                loop: true,
                delay: 50,
                deleteSpeed: 50,
              }}
            />
          </motion.div>

          {/* BUTTONS */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.15 },
              },
            }}
            className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4"
          >
            <motion.button
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 0px 25px rgba(220,38,38,0.6)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleScrollToDonors}
              className="bg-red-700 hover:bg-red-800 text-white font-semibold px-7 py-3 rounded-xl transition shadow-lg"
            >
              রক্তদাতা খুঁজুন
            </motion.button>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/register"
                className="border-2 border-red-600 text-red-700 hover:bg-red-700 hover:text-white font-semibold px-7 py-3 rounded-xl transition shadow-lg block"
              >
                রক্তদাতা হোন
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* RIGHT: Floating Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex justify-center lg:justify-end z-10"
        >
          <motion.img
            src="/hero.jpg"
            alt="Blood Donation"
            className="rounded-3xl w-full drop-shadow-2xl border-4 border-white/40"
            animate={{ y: [0, -20, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>

      {/* Scroll Down Arrow */}
      <div className="pt-12 block text-center z-10 relative">
        <motion.button
          onClick={handleScrollToDonors}
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="p-3 rounded-full bg-white/60 shadow-md backdrop-blur-md hover:bg-red-100 transition"
        >
          <svg
            className="w-7 h-7"
            viewBox="0 0 24 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.8">
              <path
                d="M19.9201 29.0499L13.4001 22.5299C12.6301 21.7599 11.3701 21.7599 10.6001 22.5299L4.08008 29.0499"
                stroke="#DC2626"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <g opacity="0.6">
              <path
                d="M17.2802 17.0334L12.9335 12.6868C12.4202 12.1734 11.5802 12.1734 11.0669 12.6868L6.72021 17.0334"
                stroke="#DC2626"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </motion.button>
      </div>
    </section>
  );
}

/* Add these Tailwind animations in global.css */
