import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const slideTexts = [
  "এক ফোঁটা রক্ত, একটি নতুন জীবন।",
  "রক্ত দিন, মানবতার পাশে দাঁড়ান।",
  "স্বেচ্ছায় রক্তদান করুন, জীবন বাঁচাতে সাহায্য করুন।",
  "আপনার এক ব্যাগ রক্ত কারও জন্য নতুন আশার কারণ হতে পারে।",
  "রক্তদাতা খুঁজুন, প্রয়োজনের সময়ে পাশে থাকুন।",
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % slideTexts.length);
    }, 4000);

    return () => window.clearInterval(interval);
  }, []);

  const handleScrollToDonors = () => {
    const element = document.getElementById("donor-list");

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate min-h-[680px] w-full overflow-hidden bg-gradient-to-br from-red-50 via-white to-rose-50 sm:min-h-[720px]"
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-red-200/40 blur-3xl sm:h-[420px] sm:w-[420px]" />

        <div className="absolute -bottom-40 -right-32 h-80 w-80 rounded-full bg-rose-200/40 blur-3xl sm:h-[450px] sm:w-[450px]" />

        <div className="absolute left-1/2 top-1/3 h-40 w-40 -translate-x-1/2 rounded-full bg-red-100/50 blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:min-h-[720px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8">
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center lg:text-left"
        >
          {/* Badge */}
          <div className="mb-6 flex justify-center lg:justify-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-white/80 px-4 py-2 text-xs font-bold text-red-700 shadow-sm backdrop-blur sm:text-sm">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-red-600"
              />

              Kaliganj Blood Donor Directory
            </span>
          </div>

          {/* Heading */}
          <h1
            id="hero-title"
            className="mx-auto max-w-3xl text-4xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:mx-0 lg:text-6xl xl:text-7xl"
          >
            কালীগঞ্জের
            <span className="block text-red-600">
              রক্তদাতা খুঁজুন
            </span>
          </h1>

          {/* English SEO supporting text */}
          <p className="mt-4 text-base font-semibold text-slate-500 sm:text-lg">
            Blood Donor List in Kaliganj
          </p>

          {/* Animated message */}
          <div className="mt-6 min-h-[48px] overflow-hidden sm:min-h-[54px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.45 }}
                className="text-lg font-bold text-red-600 sm:text-xl"
              >
                {slideTexts[index]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 lg:mx-0">
            RoktoData-তে কালীগঞ্জের বিভিন্ন রক্তের গ্রুপের
            রক্তদাতা খুঁজে নিন। প্রয়োজনের সময়ে ডোনারের তথ্য
            দেখুন এবং যোগাযোগ করুন। আপনিও স্বেচ্ছায় রক্তদাতা
            হিসেবে যুক্ত হয়ে অন্যের পাশে দাঁড়াতে পারেন।
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <button
              type="button"
              onClick={handleScrollToDonors}
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-red-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition duration-200 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <span>রক্তদাতা খুঁজুন</span>

              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </button>

            <Link
              to="/register"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-red-600 bg-white/80 px-7 py-3 text-sm font-bold text-red-600 backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              রক্তদাতা হোন
            </Link>
          </div>

          {/* Trust points */}
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs font-medium text-slate-500 sm:text-sm lg:justify-start">
            <span className="inline-flex items-center gap-2">
              <span className="text-green-600">✓</span>
              রক্তের গ্রুপ অনুযায়ী খুঁজুন
            </span>

            <span className="inline-flex items-center gap-2">
              <span className="text-green-600">✓</span>
              মোবাইল-ফ্রেন্ডলি
            </span>

            <span className="inline-flex items-center gap-2">
              <span className="text-green-600">✓</span>
              দ্রুত ডোনার খুঁজুন
            </span>
          </div>
        </motion.div>

        {/* RIGHT VISUAL */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.15,
            ease: "easeOut",
          }}
          className="relative mx-auto w-full max-w-xl"
        >
          {/* Decorative ring */}
          <div
            aria-hidden="true"
            className="absolute -inset-4 rounded-[2rem] border border-red-100/70 sm:-inset-6 sm:rounded-[2.5rem]"
          />

          <div
            aria-hidden="true"
            className="absolute -inset-8 rounded-[2.5rem] bg-red-100/30 blur-2xl"
          />

          {/* Image container */}
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white bg-white p-2 shadow-2xl shadow-red-900/10 sm:rounded-[2rem] sm:p-3">
            <img
              src="/hero.png"
              alt="রক্তদান ও রক্তদাতা — RoktoData"
              width="800"
              height="800"
              fetchPriority="high"
              decoding="async"
              className="aspect-[4/3] w-full rounded-[1.25rem] object-cover sm:aspect-square sm:rounded-[1.5rem]"
            />

            {/* Floating blood group card */}
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-xl backdrop-blur-md sm:bottom-7 sm:left-7 sm:right-auto sm:min-w-[230px]">
              <p className="text-xs font-semibold text-slate-500">
                আপনার প্রয়োজনীয়
              </p>

              <div className="mt-1 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 text-sm font-black text-white shadow-md">
                  O+
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Blood Donor
                  </p>

                  <p className="text-xs text-slate-500">
                    Kaliganj
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Small floating badge */}
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut",
            }}
            className="absolute -right-2 -top-5 hidden rounded-2xl border border-red-100 bg-white px-4 py-3 shadow-xl sm:block lg:-right-5"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600">
                ♥
              </span>

              <div>
                <p className="text-xs font-bold text-slate-900">
                  Donate Blood
                </p>

                <p className="text-[11px] text-slate-500">
                  Save a life
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom scroll hint */}
      <motion.button
        type="button"
        onClick={handleScrollToDonors}
        aria-label="রক্তদাতার তালিকায় যান"
        animate={{ y: [0, 6, 0] }}
        transition={{
          repeat: Infinity,
          duration: 1.8,
          ease: "easeInOut",
        }}
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-xs font-semibold text-red-500 transition hover:text-red-700 sm:flex"
      >
        <span>Donors</span>
        <span aria-hidden="true" className="text-lg">
          ↓
        </span>
      </motion.button>
    </section>
  );
}