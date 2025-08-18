import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Typewriter from "typewriter-effect";
import { ChevronDown } from "lucide-react";

// ✅ Text slider content
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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ Auto-slider logic
  useEffect(() => {
    if (!paused) {
      intervalRef.current = setInterval(() => {
        setIndex((prev) => (prev + 1) % slideTexts.length);
      }, 4000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused]);

  const handleScrollToDonors = () => {
    const element = document.getElementById("donorListSection");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

 

  return (
    <section className="w-full mt-15 py-16 px-6 sm:px-10 ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* LEFT: Text Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center  lg:text-left relative p-8  transition duration-500"
        >
          {/* SLIDER */}
          <div
            className="relative h-[100px] sm:h-[200px] overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.h1
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8 }}
                className="absolute w-full text-2xl sm:text-5xl font-extrabold  bg-gradient-to-r from-red-600 to-red-900 bg-clip-text text-transparent mt-5 leading-snug"
              >
                {slideTexts[index]}
              </motion.h1>
            </AnimatePresence>
          </div>

                   {/* SUBTEXT with Typewriter */}
         <div className="mt-9 font-semibold bg-gradient-to-r from-gray-500 via-gray-600 to-gray-800 bg-clip-text text-transparent text-base sm:text-lg max-w-xl mx-auto lg:mx-0">
  <Typewriter
    options={{
      strings: ["আমাদের মাধ্যমে দ্রুত রক্তদাতা খুঁজুন বা রক্ত দান করুন।"],
      autoStart: true,
      loop: true,
      delay: 50,
      deleteSpeed: 50,

    }}
  />
</div>

          {/* BUTTONS */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 0px 20px rgba(220,38,38,0.6)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleScrollToDonors}
              className="bg-red-700 hover:bg-red-800 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              রক্তদাতা খুঁজুন
            </motion.button>
            <motion.div
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 0px 20px rgba(220,38,38,0.4)",
              }}
            >
              <Link
                to="/register"
                className="border border-red-600 text-red-700 hover:bg-red-50 font-semibold px-6 py-3 rounded-lg transition block"
              >
                রক্তদাতা হোন
              </Link>
            </motion.div>
            
          </div>

          <div className=" flex items-center justify-center pt-15 lg:justify-start">
          <button
           onClick={handleScrollToDonors}
              className="w-6 h-6 flex items-center justify-center rounded bg-red-700 opacity-70 text-white shadow-lg hover:bg-red-800 hover:shadow-red-500/50 transition duration-300 animate-bounce"
             >
          <ChevronDown size={20} />
          </button>
          </div>

          
        </motion.div>
        

        {/* RIGHT: Hero Image with Floating Animation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex justify-center lg:justify-end"
        >
          <motion.img
            src="/hero.jpg" // ✅ Replace with your own hero image
            alt="Blood Donation"
            className="w-full rounded-2xl max-w-sm sm:max-w-md lg:max-w-lg h-auto drop-shadow-2xl"
            animate={{ y: [0, -20, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
