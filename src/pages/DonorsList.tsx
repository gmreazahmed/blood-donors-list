import { collection, getDocs, Timestamp } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";

import DonorCard from "../components/DonorCard";
import RegBtn from "../components/RegBtn";
import { areaData } from "../data/upazila-union";
import { db } from "../firebase/config";

type Donor = {
  id: string;
  name: string;
  bloodGroup: string;
  upazila: string;
  union: string;
  village: string;
  phone: string;
  lastDonateDate?: string | Timestamp;
};

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const upazilas = Object.keys(areaData);

const isAvailable = (donor: Donor) => {
  if (!donor.lastDonateDate) return true;

  let lastDate: Date;

  try {
    if (typeof donor.lastDonateDate === "string") {
      lastDate = new Date(donor.lastDonateDate);
    } else {
      lastDate = donor.lastDonateDate.toDate();
    }
  } catch {
    return false;
  }

  if (Number.isNaN(lastDate.getTime())) {
    return false;
  }

  const now = new Date();

  const diffMonths =
    (now.getFullYear() - lastDate.getFullYear()) * 12 +
    (now.getMonth() - lastDate.getMonth());

  return diffMonths >= 3;
};

export default function DonorsList() {
  const [allDonors, setAllDonors] = useState<Donor[]>([]);

  const [blood, setBlood] = useState("");
  const [upazila, setUpazila] = useState("");
  const [union, setUnion] = useState("");
  const [search, setSearch] = useState("");

  const [showCount, setShowCount] = useState(12);
  const [availableOnly, setAvailableOnly] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * Fetch donor data once.
   *
   * Previously Firestore was queried every time a filter/search
   * changed. For a local donor directory this avoids unnecessary
   * repeated reads and makes filtering much faster.
   */
  useEffect(() => {
    let mounted = true;

    const fetchDonors = async () => {
      try {
        setLoading(true);
        setError("");

        const snap = await getDocs(collection(db, "donors"));

        if (!mounted) return;

        const donorData: Donor[] = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Donor, "id">),
        }));

        setAllDonors(donorData);
      } catch (err) {
        console.error("Failed to load donors:", err);

        if (mounted) {
          setError(
            "রক্তদাতাদের তথ্য লোড করা সম্ভব হয়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।"
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchDonors();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * Client-side filtering.
   */
  const filteredDonors = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return allDonors.filter((donor) => {
      const matchesBlood =
        !blood || donor.bloodGroup === blood;

      const matchesUpazila =
        !upazila || donor.upazila === upazila;

      const matchesUnion =
        !union || donor.union === union;

      const matchesSearch =
        !normalizedSearch ||
        donor.name?.toLowerCase().includes(normalizedSearch) ||
        donor.phone?.toLowerCase().includes(normalizedSearch) ||
        donor.village?.toLowerCase().includes(normalizedSearch);

      const matchesAvailability =
        !availableOnly || isAvailable(donor);

      return (
        matchesBlood &&
        matchesUpazila &&
        matchesUnion &&
        matchesSearch &&
        matchesAvailability
      );
    });
  }, [
    allDonors,
    blood,
    upazila,
    union,
    search,
    availableOnly,
  ]);

  const visibleDonors = filteredDonors.slice(0, showCount);

  const hasMore = visibleDonors.length < filteredDonors.length;

  const clearFilters = () => {
    setBlood("");
    setUpazila("");
    setUnion("");
    setSearch("");
    setAvailableOnly(false);
    setShowCount(12);
  };

  const handleBloodChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setBlood(event.target.value);
    setShowCount(12);
  };

  const handleUpazilaChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setUpazila(event.target.value);
    setUnion("");
    setShowCount(12);
  };

  const handleUnionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setUnion(event.target.value);
    setShowCount(12);
  };

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearch(event.target.value);
    setShowCount(12);
  };

  const handleAvailabilityChange = () => {
    setAvailableOnly((previous) => !previous);
    setShowCount(12);
  };

  return (
    <>
      <Helmet>
        <title>
          Blood Donor List Kaliganj | রক্তদাতা তালিকা | RoktoData
        </title>

        <meta
          name="description"
          content="কালীগঞ্জের রক্তদাতা তালিকা দেখুন। রক্তের গ্রুপ, উপজেলা, ইউনিয়ন বা নাম অনুযায়ী RoktoData-তে রক্তদাতা খুঁজে নিন।"
        />

        <meta
          name="keywords"
          content="blood donor list Kaliganj, blood donor Kaliganj, Kaliganj blood donor, রক্তদাতা তালিকা কালীগঞ্জ, রক্তদাতা কালীগঞ্জ, RoktoData"
        />

        <link
          rel="canonical"
          href="https://roktodata.vercel.app/donors"
        />

        <meta
          property="og:title"
          content="Blood Donor List Kaliganj | RoktoData"
        />

        <meta
          property="og:description"
          content="কালীগঞ্জের রক্তদাতা তালিকা থেকে প্রয়োজনীয় রক্তের গ্রুপের ডোনার খুঁজে নিন।"
        />

        <meta
          property="og:url"
          content="https://roktodata.vercel.app/donors"
        />

        <meta property="og:type" content="website" />

        <meta
          property="og:image"
          content="https://roktodata.vercel.app/roktoData.png"
        />

        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          name="twitter:title"
          content="Blood Donor List Kaliganj | RoktoData"
        />

        <meta
          name="twitter:description"
          content="কালীগঞ্জের রক্তদাতা তালিকা দেখুন এবং প্রয়োজনীয় ডোনার খুঁজে নিন।"
        />

        <meta
          name="twitter:image"
          content="https://roktodata.vercel.app/roktoData.png"
        />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Blood Donor List Kaliganj",
            alternateName: "কালীগঞ্জের রক্তদাতা তালিকা",
            url: "https://roktodata.vercel.app/donors",
            description:
              "কালীগঞ্জের রক্তদাতা তালিকা এবং রক্তের গ্রুপ অনুযায়ী ডোনার খোঁজার পেজ।",
            isPartOf: {
              "@type": "WebSite",
              name: "RoktoData",
              url: "https://roktodata.vercel.app/",
            },
            inLanguage: "bn-BD",
          })}
        </script>
      </Helmet>

      <section
        id="donor-list"
        aria-labelledby="donor-directory-heading"
        className="bg-gradient-to-b from-red-50 via-white to-slate-50 py-12 sm:py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* =========================
              HEADER
          ========================== */}
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-red-600"
                />
                RoktoData Donor Directory
              </div>

              <h2
                id="donor-directory-heading"
                className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl"
              >
                কালীগঞ্জের রক্তদাতা তালিকা
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                রক্তের গ্রুপ, এলাকা অথবা নাম দিয়ে কালীগঞ্জের
                রক্তদাতা খুঁজে নিন।
              </p>
            </div>

            <div className="shrink-0">
              <RegBtn />
            </div>
          </div>

          {/* =========================
              SEARCH & FILTERS
          ========================== */}
          <div className="mb-10 rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5 sm:p-6">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  রক্তদাতা খুঁজুন
                </h3>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  প্রয়োজন অনুযায়ী নিচের ফিল্টার ব্যবহার করুন।
                </p>
              </div>

              {(blood ||
                upazila ||
                union ||
                search ||
                availableOnly) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="self-start rounded-lg px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 sm:self-auto"
                >
                  সব ফিল্টার মুছে দিন
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {/* Search */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label
                  htmlFor="donor-search"
                  className="mb-1.5 block text-xs font-bold text-slate-600"
                >
                  খুঁজুন
                </label>

                <div className="relative">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    ⌕
                  </span>

                  <input
                    id="donor-search"
                    type="search"
                    placeholder="নাম, ফোন বা গ্রাম..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100"
                  />
                </div>
              </div>

              {/* Blood Group */}
              <div>
                <label
                  htmlFor="blood-group"
                  className="mb-1.5 block text-xs font-bold text-slate-600"
                >
                  রক্তের গ্রুপ
                </label>

                <select
                  id="blood-group"
                  value={blood}
                  onChange={handleBloodChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100"
                >
                  <option value="">সব গ্রুপ</option>

                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>

              {/* Upazila */}
              <div>
                <label
                  htmlFor="upazila"
                  className="mb-1.5 block text-xs font-bold text-slate-600"
                >
                  উপজেলা
                </label>

                <select
                  id="upazila"
                  value={upazila}
                  onChange={handleUpazilaChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100"
                >
                  <option value="">সব উপজেলা</option>

                  {upazilas.map((area) => (
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
                  className="mb-1.5 block text-xs font-bold text-slate-600"
                >
                  ইউনিয়ন
                </label>

                <select
                  id="union"
                  value={union}
                  onChange={handleUnionChange}
                  disabled={!upazila}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">
                    {upazila ? "সব ইউনিয়ন" : "আগে উপজেলা নির্বাচন করুন"}
                  </option>

                  {upazila &&
                    areaData[upazila]?.map((un) => (
                      <option key={un} value={un}>
                        {un}
                      </option>
                    ))}
                </select>
              </div>

              {/* Availability */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAvailabilityChange}
                  aria-pressed={availableOnly}
                  className={`min-h-[46px] w-full rounded-xl px-4 py-3 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                    availableOnly
                      ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
                      : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  {availableOnly
                    ? "✓ এখন সম্ভব হতে পারে"
                    : "শুধু Available"}
                </button>
              </div>
            </div>

            {/* Results summary */}
            <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
              <span>
                মোট{" "}
                <strong className="text-slate-900">
                  {filteredDonors.length}
                </strong>{" "}
                জন ডোনার পাওয়া গেছে
              </span>

              {(blood ||
                upazila ||
                union ||
                search ||
                availableOnly) && (
                <span className="text-red-600">
                  ফিল্টার সক্রিয়
                </span>
              )}
            </div>
          </div>

          {/* =========================
              ERROR
          ========================== */}
          {error && (
            <div
              role="alert"
              className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-center"
            >
              <p className="font-bold text-red-700">
                তথ্য লোড করা যায়নি
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* =========================
              LOADING
          ========================== */}
          {loading && (
            <div
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
              aria-label="রক্তদাতাদের তথ্য লোড হচ্ছে"
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-slate-200" />

                    <div className="flex-1">
                      <div className="h-4 w-32 rounded bg-slate-200" />
                      <div className="mt-2 h-3 w-24 rounded bg-slate-100" />
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="h-3 w-full rounded bg-slate-100" />
                    <div className="h-3 w-4/5 rounded bg-slate-100" />
                    <div className="h-10 w-full rounded-xl bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* =========================
              EMPTY STATE
          ========================== */}
          {!loading &&
            !error &&
            filteredDonors.length === 0 && (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl">
                  🩸
                </div>

                <h3 className="mt-5 text-xl font-extrabold text-slate-900">
                  কোনো ডোনার পাওয়া যায়নি
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">
                  আপনার নির্বাচিত ফিল্টার পরিবর্তন করে আবার চেষ্টা
                  করুন অথবা সব ফিল্টার মুছে দিন।
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  সব ফিল্টার মুছে দিন
                </button>
              </div>
            )}

          {/* =========================
              DONOR GRID
          ========================== */}
          {!loading &&
            !error &&
            visibleDonors.length > 0 && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {visibleDonors.map((donor) => (
                  <article
                    key={donor.id}
                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-100 hover:shadow-xl"
                  >
                    <DonorCard donor={donor} />
                  </article>
                ))}
              </div>
            )}

          {/* =========================
              LOAD MORE
          ========================== */}
          {!loading && hasMore && (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() =>
                  setShowCount((previous) => previous + 12)
                }
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-900 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              >
                আরও ডোনার দেখুন
              </button>
            </div>
          )}

          {/* =========================
              INFORMATION
          ========================== */}
          {!loading && filteredDonors.length > 0 && (
            <div className="mt-12 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <h3 className="text-sm font-extrabold text-amber-900">
                গুরুত্বপূর্ণ তথ্য
              </h3>

              <p className="mt-2 text-xs leading-6 text-amber-800 sm:text-sm">
                এখানে দেখানো donor availability তথ্যের ভিত্তিতে
                অনুমান করা হতে পারে। রক্তদাতার সাথে যোগাযোগ করে
                বর্তমান availability নিশ্চিত করুন। জরুরি
                পরিস্থিতিতে নিকটস্থ হাসপাতাল বা ব্লাড ব্যাংকের
                সাথেও যোগাযোগ করুন।
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}