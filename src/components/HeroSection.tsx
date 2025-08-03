import { useState, useEffect, useRef } from "react";

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

  return (
    <section className="w-full bg-gradient-to-br from-red-200 to-white py-24 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto text-center">
        {/* SLIDER */}
        <div
          className="relative h-[100px] sm:h-[130px] overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {slideTexts.map((text, i) => (
            <div
              key={i}
              className={`absolute top-0 left-0 w-full h-full flex items-center justify-center transition-all duration-1000 ease-in-out 
                ${i === index ? "opacity-100 translate-y-0 z-10" : "opacity-0 translate-y-6 z-0"}
              `}
            >
              <h1 className="text-xl sm:text-4xl font-bold text-red-700 px-2 leading-snug">
                {text}
              </h1>
            </div>
          ))}
        </div>

        {/* SUBTEXT */}
        <p className="mt-6 text-gray-600 text-base sm:text-lg max-w-xl mx-auto">
          আপনার রক্ত দান অন্য কারো জীবনে আলো এনে দিতে পারে। আজই সিদ্ধান্ত নিন রক্তদাতা হওয়ার।
        </p>

        {/* BUTTONS */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/donors"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition shadow"
          >
            রক্তদাতা খুঁজুন
          </a>
          <a
            href="/register"
            className="border border-red-600 text-red-600 hover:bg-red-100 font-semibold px-6 py-3 rounded-lg transition"
          >
            রক্তদাতা হোন
          </a>
        </div>
      </div>
    </section>
  );
}
