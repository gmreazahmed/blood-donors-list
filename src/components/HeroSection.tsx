import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const titles = [
  "জীবন বাঁচাতে রক্ত দিন, আশা দিন",
  "এক ফোঁটা রক্ত, একটি প্রাণের আশ্বাস",
  "আপনার রক্ত হতে পারে কারো বাঁচার শেষ সুযোগ",
];

export default function HeroSection() {
  const [currentTitle, setCurrentTitle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitle((prev) => (prev + 1) % titles.length);
    }, 4000); // Change every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-red-50 py-16 px-6 sm:px-10 lg:px-20 text-center md:text-left">
      <div className="max-w-6xl mx-auto relative min-h-[80px]">
        <div className="h-20 relative overflow-hidden">
          {titles.map((title, index) => (
            <h1
              key={index}
              className={`absolute top-0 left-0 w-full text-4xl sm:text-5xl font-bold text-red-700 leading-tight transition-opacity duration-1000 ${
                currentTitle === index ? "opacity-100" : "opacity-0"
              }`}
            >
              {title}
            </h1>
          ))}
        </div>

        <p className="mt-4 text-gray-700 text-lg">
          আমাদের মাধ্যমে দ্রুত রক্তদাতা খুঁজুন বা রক্ত দান করুন।
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <Link
            to="/donors"
            className="bg-red-600 text-white px-6 py-3 rounded-md shadow hover:bg-red-700 transition"
          >
            রক্তদাতা খুঁজুন
          </Link>
          <Link
            to="/register"
            className="border border-red-600 text-red-600 px-6 py-3 rounded-md hover:bg-red-100 transition"
          >
            রক্তদাতা হন
          </Link>
        </div>
      </div>
    </section>
  );
}
