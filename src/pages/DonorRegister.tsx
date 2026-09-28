import {
  addDoc,
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  CalendarDays,
  CheckCircle2,
  Heart,
  Loader2,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";

import { areaData } from "../data/upazila-union";
import { db } from "../firebase/config";
import type { Donor } from "../types";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const initialForm = {
  name: "",
  bloodGroup: "",
  upazila: "",
  union: "",
  village: "",
  phone: "",
  lastDonateDate: "",
};

type FormState = typeof initialForm;

export default function DonorRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(initialForm);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittedDonor, setSubmittedDonor] = useState<Donor | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "upazila" ? { union: "" } : {}),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (loading) return;

    const name = form.name.trim();
    const phone = form.phone.trim();
    const village = form.village.trim();

    /* =========================
       Required fields
    ========================== */

    if (
      !name ||
      !form.bloodGroup ||
      !form.upazila ||
      !form.union ||
      !phone
    ) {
      alert("অনুগ্রহ করে সব প্রয়োজনীয় ঘর পূরণ করুন।");
      return;
    }

    /* =========================
       Name validation
    ========================== */

    if (name.length < 2) {
      alert("অনুগ্রহ করে সঠিক নাম লিখুন।");
      return;
    }

    /* =========================
       Bangladesh phone validation
    ========================== */

    const phoneRegex = /^01[0-9]{9}$/;

    if (!phoneRegex.test(phone)) {
      alert("⚠️ সঠিক ফোন নম্বর লিখুন। উদাহরণ: 01XXXXXXXXX");
      return;
    }

    /* =========================
       Date validation
    ========================== */

    if (form.lastDonateDate) {
      const selectedDate = new Date(`${form.lastDonateDate}T00:00:00`);
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      if (selectedDate > today) {
        alert("শেষ রক্তদানের তারিখ ভবিষ্যতের হতে পারে না।");
        return;
      }
    }

    setLoading(true);

    try {
      /* =========================
         Duplicate phone check
      ========================== */

      const donorsRef = collection(db, "donors");

      const q = query(
        donorsRef,
        where("phone", "==", phone)
      );

      const snap = await getDocs(q);

      if (!snap.empty) {
        alert(
          "⚠️ এই ফোন নম্বর দিয়ে ইতিমধ্যে একজন ডোনার রেজিস্ট্রেশন করেছেন।"
        );

        setLoading(false);
        return;
      }

      /* =========================
         Final confirmation
      ========================== */

      const isConfirmed = window.confirm(
        `আপনার তথ্য রেজিস্টার করা হবে।\n\n` +
          `নাম: ${name}\n` +
          `ফোন: ${phone}\n` +
          `রক্তের গ্রুপ: ${form.bloodGroup}\n\n` +
          `আপনি কি নিশ্চিত?`
      );

      if (!isConfirmed) {
        setLoading(false);
        return;
      }

      /* =========================
         Create donor
      ========================== */

      const donorRef = await addDoc(donorsRef, {
        name,
        bloodGroup: form.bloodGroup,
        upazila: form.upazila,
        union: form.union,
        village,
        phone,
        lastDonateDate: form.lastDonateDate,
        createdAt: Timestamp.now(),
      });

      /* =========================
         Store submitted donor
      ========================== */

      const registeredDonor: Donor = {
        id: donorRef.id,
        name,
        bloodGroup: form.bloodGroup,
        upazila: form.upazila,
        union: form.union,
        village,
        phone,
        lastDonateDate: form.lastDonateDate,
      };

      setSubmittedDonor(registeredDonor);
      setSuccess(true);
      setLoading(false);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error("Error adding donor:", error);

      setLoading(false);

      alert(
        "দুঃখিত, রেজিস্ট্রেশন সম্পন্ন করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।"
      );
    }
  };

  const handleViewDonor = () => {
    if (!submittedDonor) return;

    navigate("/donors", {
      state: {
        registeredDonor: submittedDonor,
      },
    });
  };

  const handleRegisterAnother = () => {
    setSubmittedDonor(null);
    setSuccess(false);
    setForm(initialForm);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Helmet>
        <title>রক্তদাতা হিসেবে নিবন্ধন করুন | RoktoData</title>

        <meta
          name="description"
          content="RoktoData-তে রক্তদাতা হিসেবে নিবন্ধন করুন। আপনার রক্তের গ্রুপ ও প্রয়োজনীয় তথ্য দিয়ে কালীগঞ্জের রক্তদাতা তালিকায় যুক্ত হন।"
        />

        <meta
          name="keywords"
          content="রক্তদাতা নিবন্ধন, blood donor registration, donor registration Kaliganj, রক্তদাতা কালীগঞ্জ, RoktoData"
        />

        <link
          rel="canonical"
          href="https://roktodata.vercel.app/register"
        />

        <meta
          property="og:title"
          content="রক্তদাতা হিসেবে নিবন্ধন করুন | RoktoData"
        />

        <meta
          property="og:description"
          content="রক্তদাতা হিসেবে RoktoData-তে নিবন্ধন করুন এবং জরুরি সময়ে একজন মানুষের পাশে দাঁড়ানোর সুযোগ তৈরি করুন।"
        />

        <meta
          property="og:url"
          content="https://roktodata.vercel.app/register"
        />

        <meta
          property="og:type"
          content="website"
        />
      </Helmet>

      <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-red-50 via-white to-red-100/70 px-4 py-10 sm:px-6 lg:py-16">
        {/* Background decoration */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-red-200/30 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-red-300/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-3xl">
          {/* =========================
              Header
          ========================== */}

          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl shadow-xl shadow-red-200">
              <img
                src="/roktoData.png"
                alt="RoktoData logo"
                className="h-full w-full object-contain p-2"
              />
            </div>

            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-red-600">
              Become a Blood Donor
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              রক্তদাতা হিসেবে নিবন্ধন করুন
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
              আপনার সামান্য সহযোগিতা জরুরি সময়ে একজন মানুষের জন্য
              গুরুত্বপূর্ণ হয়ে উঠতে পারে। প্রয়োজনীয় তথ্য দিয়ে RoktoData-তে
              রক্তদাতা হিসেবে যুক্ত হোন।
            </p>
          </div>

          {/* =========================
              Main Card
          ========================== */}

          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-2xl shadow-red-100/60 sm:p-8">
            {/* =========================
                SUCCESS STATE
            ========================== */}

            {success && submittedDonor ? (
              <div className="py-2">
                {/* Success icon */}

                <div className="text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/60">
                    <CheckCircle2
                      className="h-10 w-10 text-emerald-600"
                      strokeWidth={2.2}
                    />
                  </div>

                  <p className="mt-5 text-sm font-bold text-emerald-600">
                    Registration Successful
                  </p>

                  <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                    রেজিস্ট্রেশন সফল হয়েছে! 🎉
                  </h2>

                  <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-gray-500">
                    ধন্যবাদ{" "}
                    <strong className="text-gray-800">
                      {submittedDonor.name}
                    </strong>
                    । আপনার তথ্য সফলভাবে RoktoData রক্তদাতা তালিকায় যুক্ত
                    হয়েছে।
                  </p>
                </div>

                {/* Donor data */}

                <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between gap-4 border-b border-gray-100 bg-white px-5 py-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-400">
                        নিবন্ধিত তথ্য
                      </p>

                      <p className="mt-1 text-base font-extrabold text-gray-900">
                        আপনার রক্তদাতা প্রোফাইল
                      </p>
                    </div>

                    <div className="flex h-14 min-w-14 shrink-0 items-center justify-center rounded-2xl bg-red-600 px-3 text-lg font-extrabold text-white shadow-lg shadow-red-200">
                      {submittedDonor.bloodGroup}
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100 px-5">
                    {/* Name */}

                    <div className="flex items-center justify-between gap-4 py-4">
                      <span className="text-sm text-gray-500">
                        নাম
                      </span>

                      <span className="text-right text-sm font-bold text-gray-900">
                        {submittedDonor.name}
                      </span>
                    </div>

                    {/* Blood group */}

                    <div className="flex items-center justify-between gap-4 py-4">
                      <span className="text-sm text-gray-500">
                        রক্তের গ্রুপ
                      </span>

                      <span className="text-sm font-extrabold text-red-600">
                        {submittedDonor.bloodGroup}
                      </span>
                    </div>

                    {/* Upazila */}

                    <div className="flex items-center justify-between gap-4 py-4">
                      <span className="text-sm text-gray-500">
                        উপজেলা
                      </span>

                      <span className="text-right text-sm font-semibold text-gray-800">
                        {submittedDonor.upazila}
                      </span>
                    </div>

                    {/* Union */}

                    <div className="flex items-center justify-between gap-4 py-4">
                      <span className="text-sm text-gray-500">
                        ইউনিয়ন
                      </span>

                      <span className="text-right text-sm font-semibold text-gray-800">
                        {submittedDonor.union}
                      </span>
                    </div>

                    {/* Village */}

                    {submittedDonor.village && (
                      <div className="flex items-center justify-between gap-4 py-4">
                        <span className="text-sm text-gray-500">
                          গ্রাম
                        </span>

                        <span className="text-right text-sm font-semibold text-gray-800">
                          {submittedDonor.village}
                        </span>
                      </div>
                    )}

                    {/* Phone */}

                    <div className="flex items-center justify-between gap-4 py-4">
                      <span className="text-sm text-gray-500">
                        ফোন নম্বর
                      </span>

                      <span className="text-right text-sm font-bold text-gray-900">
                        {submittedDonor.phone}
                      </span>
                    </div>

                    {/* Last donation */}

                    {submittedDonor.lastDonateDate && (
                      <div className="flex items-center justify-between gap-4 py-4">
                        <span className="text-sm text-gray-500">
                          সর্বশেষ রক্তদান
                        </span>

                        <span className="text-right text-sm font-semibold text-gray-800">
                          {submittedDonor.lastDonateDate}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Success notice */}

                <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4">
                  <div className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                    <p className="text-xs leading-6 text-emerald-800">
                      আপনার তথ্য এখন RoktoData-এর রক্তদাতা তালিকায় যুক্ত হয়েছে।
                      প্রয়োজনের সময় মানুষ আপনার দেওয়া যোগাযোগ নম্বরের মাধ্যমে
                      আপনার সাথে যোগাযোগ করতে পারবে।
                    </p>
                  </div>
                </div>

                {/* Actions */}

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleViewDonor}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-200 transition hover:bg-red-700 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-red-100"
                  >
                    <Heart
                      className="h-4 w-4 fill-current"
                      aria-hidden="true"
                    />
                    রক্তদাতা তালিকায় দেখুন
                  </button>

                  <button
                    type="button"
                    onClick={handleRegisterAnother}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-gray-100"
                  >
                    আবার নিবন্ধন করুন
                  </button>
                </div>
              </div>
            ) : (
              /* =========================
                 REGISTRATION FORM
              ========================== */

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* =========================
                    Personal Information
                ========================== */}

                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600">
                      <UserRound
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </div>

                    <div>
                      <h2 className="font-bold text-gray-900">
                        ব্যক্তিগত তথ্য
                      </h2>

                      <p className="text-xs text-gray-500">
                        আপনার প্রয়োজনীয় তথ্য দিন
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Name */}

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                      >
                        পূর্ণ নাম{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="আপনার পূর্ণ নাম"
                        value={form.name}
                        onChange={handleChange}
                        maxLength={100}
                        autoComplete="name"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100"
                        required
                      />
                    </div>

                    {/* Blood Group */}

                    <div>
                      <label
                        htmlFor="bloodGroup"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                      >
                        রক্তের গ্রুপ{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <select
                        id="bloodGroup"
                        name="bloodGroup"
                        value={form.bloodGroup}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100"
                        required
                      >
                        <option value="">
                          রক্তের গ্রুপ নির্বাচন করুন
                        </option>

                        {BLOOD_GROUPS.map((bg) => (
                          <option key={bg} value={bg}>
                            {bg}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Phone */}

                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                      >
                        ফোন নম্বর{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <Phone
                          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                          aria-hidden="true"
                        />

                        <input
                          id="phone"
                          type="tel"
                          name="phone"
                          inputMode="numeric"
                          placeholder="01XXXXXXXXX"
                          value={form.phone}
                          onChange={handleChange}
                          maxLength={11}
                          autoComplete="tel"
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider */}

                <div className="h-px bg-gray-100" />

                {/* =========================
                    Location
                ========================== */}

                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600">
                      <MapPin
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </div>

                    <div>
                      <h2 className="font-bold text-gray-900">
                        অবস্থানের তথ্য
                      </h2>

                      <p className="text-xs text-gray-500">
                        আপনার এলাকার তথ্য নির্বাচন করুন
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Upazila */}

                    <div>
                      <label
                        htmlFor="upazila"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                      >
                        উপজেলা{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <select
                        id="upazila"
                        name="upazila"
                        value={form.upazila}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100"
                        required
                      >
                        <option value="">
                          উপজেলা নির্বাচন করুন
                        </option>

                        {Object.keys(areaData).map((area) => (
                          <option key={area} value={area}>
                            {area}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Union */}

                    <div>
                      <label
                        htmlFor="union"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                      >
                        ইউনিয়ন{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <select
                        id="union"
                        name="union"
                        value={form.union}
                        onChange={handleChange}
                        disabled={!form.upazila}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="">
                          {form.upazila
                            ? "ইউনিয়ন নির্বাচন করুন"
                            : "আগে উপজেলা নির্বাচন করুন"}
                        </option>

                        {form.upazila &&
                          areaData[form.upazila]?.map((u) => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Village */}

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="village"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                      >
                        গ্রাম{" "}
                        <span className="font-normal text-gray-400">
                          (ঐচ্ছিক)
                        </span>
                      </label>

                      <input
                        id="village"
                        type="text"
                        name="village"
                        placeholder="আপনার গ্রামের নাম"
                        value={form.village}
                        onChange={handleChange}
                        maxLength={150}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Divider */}

                <div className="h-px bg-gray-100" />

                {/* =========================
                    Donation Information
                ========================== */}

                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600">
                      <CalendarDays
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </div>

                    <div>
                      <h2 className="font-bold text-gray-900">
                        রক্তদানের তথ্য
                      </h2>

                      <p className="text-xs text-gray-500">
                        সর্বশেষ রক্তদানের তথ্য থাকলে দিন
                      </p>
                    </div>
                  </div>

                  <label
                    htmlFor="lastDonateDate"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    সর্বশেষ রক্তদানের তারিখ{" "}
                    <span className="font-normal text-gray-400">
                      (ঐচ্ছিক)
                    </span>
                  </label>

                  <input
                    id="lastDonateDate"
                    type="date"
                    name="lastDonateDate"
                    value={form.lastDonateDate}
                    onChange={handleChange}
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100"
                  />

                  <p className="mt-2 text-xs leading-5 text-gray-500">
                    এই তথ্যটি ডোনারের সম্ভাব্য availability দেখাতে সহায়তা
                    করতে পারে। এটি কোনো চিকিৎসাগত eligibility নিশ্চিত করে না।
                  </p>
                </div>

                {/* Privacy Notice */}

                <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                  <p className="text-xs leading-6 text-amber-800">
                    <strong>গুরুত্বপূর্ণ:</strong> আপনার দেওয়া তথ্য
                    রক্তদাতা তালিকায় প্রদর্শিত হতে পারে এবং প্রয়োজনের সময়
                    যোগাযোগের জন্য ফোন নম্বর ব্যবহার করা হতে পারে। শুধুমাত্র
                    স্বেচ্ছায় ও সম্মত হয়ে নিবন্ধন করুন।
                  </p>
                </div>

                {/* Submit */}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <>
                      <Loader2
                        className="h-5 w-5 animate-spin"
                        aria-hidden="true"
                      />
                      রেজিস্ট্রেশন হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Heart
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                      রক্তদাতা হিসেবে নিবন্ধন করুন
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Bottom note */}

            {!success && (
              <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-gray-500">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                বর্তমানে কালীগঞ্জ এলাকার জন্য এই সেবা চালু রয়েছে
              </div>
            )}
          </div>

          {/* Bottom SEO / trust text */}

          <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-6 text-gray-500">
            RoktoData-এর মাধ্যমে রক্তদাতা হিসেবে যুক্ত হয়ে জরুরি সময়ে
            রক্তের প্রয়োজন থাকা মানুষের কাছে পৌঁছাতে সাহায্য করুন।
          </p>
        </div>
      </main>
    </>
  );
}