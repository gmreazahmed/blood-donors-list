import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Check,
  CheckCircle2,
  Clock3,
  Droplets,
  Hospital,
  Loader2,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { db } from "../firebase/config";

type BloodRequest = {
  id: string;
  name: string;
  phone: string;
  bloodGroup: string;
  hospital: string;
  reason: string;
  fulfilled: boolean;
  createdAt?: Timestamp;
};

const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

const initialForm = {
  name: "",
  phone: "",
  bloodGroup: "",
  hospital: "",
  reason: "",
};

export default function BloodRequestPage() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [solvingId, setSolvingId] = useState<string | null>(null);

  const [success, setSuccess] = useState(false);

  /* =========================
     Fetch requests
  ========================== */

  const fetchRequests = async () => {
    setFetching(true);

    try {
      const q = query(
        collection(db, "bloodRequests"),
        orderBy("createdAt", "desc"),
        limit(10)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...(item.data() as Omit<BloodRequest, "id">),
      }));

      setRequests(data);
    } catch (error) {
      console.error("Error fetching blood requests:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  /* =========================
     Input change
  ========================== */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================
     Solve request
  ========================== */

  const handleSolve = async (id: string) => {
    const confirmed = window.confirm(
      "এই রক্তের অনুরোধটি কি পূরণ হয়েছে?"
    );

    if (!confirmed) return;

    setSolvingId(id);

    try {
      await updateDoc(
        doc(db, "bloodRequests", id),
        {
          fulfilled: true,
        }
      );

      setRequests((prev) =>
        prev.map((request) =>
          request.id === id
            ? {
                ...request,
                fulfilled: true,
              }
            : request
        )
      );
    } catch (error) {
      console.error("Error updating request:", error);
      alert(
        "অনুরোধের status পরিবর্তন করা যায়নি।"
      );
    } finally {
      setSolvingId(null);
    }
  };

  /* =========================
     Submit request
  ========================== */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (loading) return;

    const name = form.name.trim();
    const phone = form.phone.trim();
    const hospital = form.hospital.trim();
    const reason = form.reason.trim();

    /* Required validation */
    if (
      !name ||
      !phone ||
      !form.bloodGroup ||
      !hospital ||
      !reason
    ) {
      alert(
        "অনুগ্রহ করে সব প্রয়োজনীয় তথ্য পূরণ করুন।"
      );
      return;
    }

    /* Name validation */
    if (name.length < 2) {
      alert("অনুগ্রহ করে সঠিক নাম লিখুন।");
      return;
    }

    /* Phone validation */
    const phoneRegex = /^01[0-9]{9}$/;

    if (!phoneRegex.test(phone)) {
      alert(
        "⚠️ সঠিক ফোন নম্বর লিখুন। উদাহরণ: 01XXXXXXXXX"
      );
      return;
    }

    /* Text length validation */
    if (hospital.length > 200) {
      alert(
        "হাসপাতালের নাম সর্বোচ্চ ২০০ অক্ষরের হতে পারে।"
      );
      return;
    }

    if (reason.length > 1000) {
      alert(
        "প্রয়োজনের বিবরণ সর্বোচ্চ ১০০০ অক্ষরের হতে পারে।"
      );
      return;
    }

    setLoading(true);

    try {
      await addDoc(
        collection(db, "bloodRequests"),
        {
          name,
          phone,
          bloodGroup: form.bloodGroup,
          hospital,
          reason,
          fulfilled: false,
          createdAt: Timestamp.now(),
        }
      );

      setForm(initialForm);
      setSuccess(true);

      await fetchRequests();

      setTimeout(() => {
        setSuccess(false);
      }, 4000);
    } catch (error) {
      console.error(
        "Error creating blood request:",
        error
      );

      alert(
        "দুঃখিত, অনুরোধ পাঠানো যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     Stats
  ========================== */

  const activeRequests = requests.filter(
    (request) => !request.fulfilled
  ).length;

  const fulfilledRequests = requests.filter(
    (request) => request.fulfilled
  ).length;

  return (
    <>
      <Helmet>
        <title>
          রক্তের অনুরোধ | Blood Request Kaliganj | RoktoData
        </title>

        <meta
          name="description"
          content="কালীগঞ্জে জরুরি রক্তের প্রয়োজন হলে RoktoData-তে রক্তের অনুরোধ পাঠান এবং রক্তদাতাদের কাছে প্রয়োজনীয় তথ্য পৌঁছে দিন।"
        />

        <meta
          name="keywords"
          content="blood request Kaliganj, রক্তের অনুরোধ কালীগঞ্জ, জরুরি রক্ত, blood donor Kaliganj, RoktoData"
        />

        <link
          rel="canonical"
          href="https://roktodata.vercel.app/blood-request"
        />

        <meta
          property="og:title"
          content="রক্তের অনুরোধ | RoktoData"
        />

        <meta
          property="og:description"
          content="জরুরি রক্তের প্রয়োজন হলে RoktoData-তে রক্তের অনুরোধ পাঠান।"
        />

        <meta
          property="og:url"
          content="https://roktodata.vercel.app/blood-request"
        />
      </Helmet>

      <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-red-50 via-white to-red-100/60 px-4 py-10 sm:px-6 lg:py-16">

        {/* Background decoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-red-200/25 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-red-300/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-6xl">

          {/* =========================
              Header
          ========================== */}

          <div className="mx-auto mb-10 max-w-3xl text-center">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600 text-white shadow-xl shadow-red-200">
              <Droplets
                className="h-8 w-8 fill-current"
                strokeWidth={1.8}
              />
            </div>

            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-red-600">
              Emergency Blood Request
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              জরুরি রক্তের অনুরোধ
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
              আপনার বা আপনার পরিচিত কারও জরুরি রক্তের প্রয়োজন হলে
              প্রয়োজনীয় তথ্য দিয়ে অনুরোধ পাঠান। রক্তদাতারা তালিকা দেখে
              প্রয়োজন অনুযায়ী যোগাযোগ করতে পারবেন।
            </p>
          </div>

          {/* =========================
              Stats
          ========================== */}

          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">

            <div className="rounded-2xl border border-red-100 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-red-600">
                <Droplets className="h-4 w-4" />
                <span className="text-xs font-semibold">
                  Active Requests
                </span>
              </div>

              <p className="mt-2 text-2xl font-extrabold text-gray-900">
                {activeRequests}
              </p>
            </div>

            <div className="rounded-2xl border border-green-100 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-semibold">
                  Fulfilled
                </span>
              </div>

              <p className="mt-2 text-2xl font-extrabold text-gray-900">
                {fulfilledRequests}
              </p>
            </div>

            <div className="col-span-2 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm sm:col-span-1">
              <div className="flex items-center gap-2 text-blue-600">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs font-semibold">
                  Help Someone
                </span>
              </div>

              <p className="mt-2 text-sm font-bold text-gray-800">
                আপনার সাহায্য একটি জীবন বাঁচাতে পারে
              </p>
            </div>
          </div>

          {/* =========================
              Request List
          ========================== */}

          <section className="mb-12">

            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">
                  সাম্প্রতিক রক্তের অনুরোধ
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  সর্বশেষ ১০টি অনুরোধ
                </p>
              </div>
            </div>

            {fetching ? (
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
                  >
                    <div className="h-5 w-40 rounded bg-gray-200" />
                    <div className="mt-4 h-3 w-3/4 rounded bg-gray-100" />
                    <div className="mt-2 h-3 w-1/2 rounded bg-gray-100" />
                    <div className="mt-2 h-3 w-2/3 rounded bg-gray-100" />
                  </div>
                ))}
              </div>
            ) : requests.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center">
                <Droplets className="mx-auto h-10 w-10 text-gray-300" />

                <h3 className="mt-4 font-bold text-gray-700">
                  কোনো রক্তের অনুরোধ পাওয়া যায়নি
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  প্রয়োজন হলে নিচের ফর্ম ব্যবহার করে নতুন অনুরোধ পাঠান।
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <article
                    key={request.id}
                    className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg sm:p-6 ${
                      request.fulfilled
                        ? "border-gray-200"
                        : "border-red-100"
                    }`}
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                      {/* Request info */}
                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-3">

                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                            <UserRound className="h-5 w-5" />
                          </div>

                          <div>
                            <h3 className="font-extrabold text-gray-900">
                              {request.name}
                            </h3>

                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-extrabold text-red-700">
                                <Droplets className="h-3 w-3" />
                                {request.bloodGroup}
                              </span>

                              {request.fulfilled ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Fulfilled
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-bold text-yellow-700">
                                  <Clock3 className="h-3 w-3" />
                                  জরুরি
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 grid gap-3 text-sm text-gray-600 sm:grid-cols-2">

                          <a
                            href={`tel:${request.phone}`}
                            className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Phone className="h-4 w-4 shrink-0" />
                            <span className="truncate">
                              {request.phone}
                            </span>
                          </a>

                          <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5">
                            <Hospital className="h-4 w-4 shrink-0 text-red-500" />
                            <span className="truncate">
                              {request.hospital}
                            </span>
                          </div>

                        </div>

                        <div className="mt-3 flex items-start gap-2 rounded-xl bg-gray-50 px-3 py-3 text-sm leading-6 text-gray-600">
                          <MapPin className="mt-1 h-4 w-4 shrink-0 text-red-500" />

                          <span>
                            {request.reason}
                          </span>
                        </div>

                      </div>

                      {/* Action */}
                      <div className="flex shrink-0 lg:pl-4">
                        {!request.fulfilled ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleSolve(request.id)
                            }
                            disabled={
                              solvingId === request.id
                            }
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-green-100 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
                          >
                            {solvingId === request.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}

                            {solvingId === request.id
                              ? "Updating..."
                              : "Solve"}
                          </button>
                        ) : (
                          <div className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 px-5 py-3 text-sm font-bold text-gray-500 lg:w-auto">
                            <CheckCircle2 className="h-4 w-4" />
                            অনুরোধ পূরণ হয়েছে
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* =========================
              Request Form
          ========================== */}

          <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-2xl shadow-red-100/50 sm:p-8">

            <div className="mb-7 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Send className="h-5 w-5" />
              </div>

              <h2 className="text-2xl font-extrabold text-gray-900">
                নতুন রক্তের অনুরোধ পাঠান
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                প্রয়োজনীয় তথ্য সঠিকভাবে পূরণ করুন।
              </p>
            </div>

            {success && (
              <div
                role="status"
                className="mb-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

                <div>
                  <p className="font-bold">
                    রক্তের অনুরোধ সফলভাবে পাঠানো হয়েছে।
                  </p>

                  <p className="mt-1 text-sm">
                    প্রয়োজনীয় মানুষদের কাছে আপনার অনুরোধ পৌঁছানোর সুযোগ তৈরি হয়েছে।
                  </p>
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="grid gap-5 sm:grid-cols-2"
            >

              {/* Name */}
              <div>
                <label
                  htmlFor="request-name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  নাম <span className="text-red-500">*</span>
                </label>

                <input
                  id="request-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="রোগীর / যোগাযোগকারীর নাম"
                  maxLength={100}
                  autoComplete="name"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="request-phone"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  ফোন নম্বর <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <input
                    id="request-phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                    maxLength={11}
                    inputMode="numeric"
                    autoComplete="tel"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100"
                    required
                  />
                </div>
              </div>

              {/* Blood Group */}
              <div>
                <label
                  htmlFor="request-bloodGroup"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  প্রয়োজনীয় রক্তের গ্রুপ{" "}
                  <span className="text-red-500">*</span>
                </label>

                <select
                  id="request-bloodGroup"
                  name="bloodGroup"
                  value={form.bloodGroup}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100"
                  required
                >
                  <option value="">
                    রক্তের গ্রুপ নির্বাচন করুন
                  </option>

                  {BLOOD_GROUPS.map((group) => (
                    <option
                      key={group}
                      value={group}
                    >
                      {group}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hospital */}
              <div>
                <label
                  htmlFor="request-hospital"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  হাসপাতাল <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <Hospital className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <input
                    id="request-hospital"
                    type="text"
                    name="hospital"
                    value={form.hospital}
                    onChange={handleChange}
                    placeholder="হাসপাতালের নাম"
                    maxLength={200}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100"
                    required
                  />
                </div>
              </div>

              {/* Reason */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="request-reason"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  প্রয়োজন / সমস্যার বিবরণ{" "}
                  <span className="text-red-500">*</span>
                </label>

                <textarea
                  id="request-reason"
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  placeholder="যেমন: অপারেশনের জন্য ১ ব্যাগ B+ রক্ত প্রয়োজন..."
                  maxLength={1000}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100"
                  required
                />

                <p className="mt-1 text-right text-xs text-gray-400">
                  {form.reason.length}/1000
                </p>
              </div>

              {/* Privacy */}
              <div className="sm:col-span-2 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                <p className="text-xs leading-6 text-amber-800">
                  <strong>গুরুত্বপূর্ণ:</strong> রক্তের অনুরোধে দেওয়া
                  যোগাযোগের তথ্য প্রয়োজন অনুযায়ী অন্যদের কাছে দৃশ্যমান
                  হতে পারে। শুধুমাত্র প্রয়োজনীয় ও সঠিক তথ্য প্রদান করুন।
                </p>
              </div>

              {/* Submit */}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      অনুরোধ পাঠানো হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      রক্তের অনুরোধ পাঠান
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* Bottom notice */}
          <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-6 text-gray-500">
            RoktoData একটি তথ্যভিত্তিক blood donor directory। জরুরি
            পরিস্থিতিতে হাসপাতাল বা সংশ্লিষ্ট চিকিৎসা কর্তৃপক্ষের
            নির্দেশনা অনুসরণ করুন।
          </p>
        </div>
      </main>
    </>
  );
}