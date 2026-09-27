import { Helmet } from "react-helmet-async";
import HeroSection from "../components/HeroSection";
import DonorsList from "./DonorsList";

const bloodGroups = [
  {
    group: "A+",
    title: "A+ রক্তদাতা",
    description: "কালীগঞ্জের A+ রক্তদাতা খুঁজুন।",
  },
  {
    group: "A-",
    title: "A- রক্তদাতা",
    description: "কালীগঞ্জের A- রক্তদাতা খুঁজুন।",
  },
  {
    group: "B+",
    title: "B+ রক্তদাতা",
    description: "কালীগঞ্জের B+ রক্তদাতা খুঁজুন।",
  },
  {
    group: "B-",
    title: "B- রক্তদাতা",
    description: "কালীগঞ্জের B- রক্তদাতা খুঁজুন।",
  },
  {
    group: "O+",
    title: "O+ রক্তদাতা",
    description: "কালীগঞ্জের O+ রক্তদাতা খুঁজুন।",
  },
  {
    group: "O-",
    title: "O- রক্তদাতা",
    description: "কালীগঞ্জের O- রক্তদাতা খুঁজুন।",
  },
  {
    group: "AB+",
    title: "AB+ রক্তদাতা",
    description: "কালীগঞ্জের AB+ রক্তদাতা খুঁজুন।",
  },
  {
    group: "AB-",
    title: "AB- রক্তদাতা",
    description: "কালীগঞ্জের AB- রক্তদাতা খুঁজুন।",
  },
];

const Home = () => {
  return (
    <>
      <Helmet>
        <html lang="bn" />

        <title>
          Blood Donor List Kaliganj | রক্তদাতা কালীগঞ্জ | RoktoData
        </title>

        <meta
          name="description"
          content="কালীগঞ্জের রক্তদাতা খুঁজুন RoktoData-তে। A+, A-, B+, B-, O+, O-, AB+ এবং AB- সহ বিভিন্ন রক্তের গ্রুপের ডোনার তালিকা দেখুন এবং রক্তদাতা হিসেবে যুক্ত হোন।"
        />

        <meta
          name="keywords"
          content="blood donor Kaliganj, blood donor list Kaliganj, Kaligonj blood donor, রক্তদাতা কালীগঞ্জ, রক্তদাতা তালিকা কালীগঞ্জ, রক্তের ডোনার কালীগঞ্জ, RoktoData"
        />

        <link
          rel="canonical"
          href="https://roktodata.vercel.app/"
        />

        <meta
          property="og:title"
          content="Blood Donor List Kaliganj | RoktoData"
        />

        <meta
          property="og:description"
          content="কালীগঞ্জের রক্তদাতা খুঁজুন। রক্তের গ্রুপ অনুযায়ী ডোনার তালিকা দেখুন এবং রক্তদাতা হিসেবে যুক্ত হোন।"
        />

        <meta
          property="og:url"
          content="https://roktodata.vercel.app/"
        />

        <meta property="og:type" content="website" />

        <meta
          property="og:image"
          content="https://roktodata.vercel.app/roktoData.png"
        />

        <meta
          property="og:locale"
          content="bn_BD"
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
          content="কালীগঞ্জের রক্তদাতা তালিকা দেখুন এবং প্রয়োজনীয় রক্তদাতা খুঁজে নিন।"
        />

        <meta
          name="twitter:image"
          content="https://roktodata.vercel.app/roktoData.png"
        />

        {/* Homepage structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": "https://roktodata.vercel.app/#website",
                url: "https://roktodata.vercel.app/",
                name: "RoktoData",
                description:
                  "Kaliganj blood donor directory and blood donor list.",
                inLanguage: "bn-BD",
              },
              {
                "@type": "WebPage",
                "@id": "https://roktodata.vercel.app/#home",
                url: "https://roktodata.vercel.app/",
                name: "Blood Donor List Kaliganj | RoktoData",
                description:
                  "কালীগঞ্জের রক্তদাতা খুঁজে পাওয়ার সহজ অনলাইন প্ল্যাটফর্ম।",
                isPartOf: {
                  "@id": "https://roktodata.vercel.app/#website",
                },
                inLanguage: "bn-BD",
              },
            ],
          })}
        </script>
      </Helmet>

      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section aria-labelledby="home-heading">
          <HeroSection />
        </section>

        {/* Local SEO introduction */}
        <section
          className="border-b border-red-100 bg-red-50/60"
          aria-labelledby="home-heading"
        >
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="mb-3 inline-flex items-center rounded-full bg-red-100 px-4 py-1.5 text-sm font-semibold text-red-700">
                RoktoData • Kaliganj
              </span>

              <h1
                id="home-heading"
                className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
              >
                কালীগঞ্জের রক্তদাতা খুঁজুন
              </h1>

              <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
                কালীগঞ্জে জরুরি রক্তের প্রয়োজন হলে RoktoData-এর
                রক্তদাতা তালিকা থেকে আপনার প্রয়োজনীয় রক্তের গ্রুপের
                ডোনার খুঁজে নিতে পারেন। রক্তের গ্রুপ অনুযায়ী তালিকা
                দেখুন এবং প্রয়োজন অনুযায়ী ডোনারের সাথে যোগাযোগ করুন।
              </p>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href="#donor-list"
                  className="inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  রক্তদাতা খুঁজুন
                </a>

                <a
                  href="/register"
                  className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-6 py-3.5 text-sm font-bold text-red-700 transition hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  রক্তদাতা হিসেবে যুক্ত হোন
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Blood group navigation */}
        <section
          className="bg-white py-14 sm:py-16"
          aria-labelledby="blood-groups-heading"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-9 text-center">
              <span className="text-sm font-bold uppercase tracking-wider text-red-600">
                Blood Groups
              </span>

              <h2
                id="blood-groups-heading"
                className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl"
              >
                রক্তের গ্রুপ অনুযায়ী ডোনার খুঁজুন
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                আপনার প্রয়োজনীয় ব্লাড গ্রুপ নির্বাচন করে কালীগঞ্জের
                রক্তদাতাদের তালিকা দেখুন।
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
              {bloodGroups.map((blood) => (
                <a
                  key={blood.group}
                  href="/donors"
                  aria-label={`${blood.title} দেখুন`}
                  className="group rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-xl font-extrabold text-red-600 transition group-hover:bg-red-600 group-hover:text-white">
                    {blood.group}
                  </div>

                  <h3 className="mt-3 text-sm font-bold text-slate-900">
                    {blood.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {blood.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Donor directory */}
        <section
          id="donor-list"
          className="scroll-mt-24 bg-slate-50 py-14 sm:py-16"
          aria-labelledby="donor-list-heading"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <span className="text-sm font-bold uppercase tracking-wider text-red-600">
                Donor Directory
              </span>

              <h2
                id="donor-list-heading"
                className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl"
              >
                কালীগঞ্জের রক্তদাতা তালিকা
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                রক্তের গ্রুপ অনুযায়ী রক্তদাতা খুঁজে নিন এবং প্রয়োজনীয়
                তথ্য দেখে যোগাযোগ করুন।
              </p>
            </div>

            <DonorsList />
          </div>
        </section>

        {/* How it works */}
        <section
          className="bg-white py-14 sm:py-16"
          aria-labelledby="how-it-works-heading"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-sm font-bold uppercase tracking-wider text-red-600">
                How It Works
              </span>

              <h2
                id="how-it-works-heading"
                className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl"
              >
                RoktoData কীভাবে কাজ করে?
              </h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 font-bold text-red-600">
                  01
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  রক্তের গ্রুপ নির্বাচন করুন
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  প্রয়োজনীয় রক্তের গ্রুপ নির্বাচন করে সংশ্লিষ্ট
                  রক্তদাতাদের তালিকা দেখুন।
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 font-bold text-red-600">
                  02
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  ডোনারের তথ্য দেখুন
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  তালিকা থেকে উপযুক্ত রক্তদাতা নির্বাচন করে
                  প্রদর্শিত যোগাযোগের মাধ্যমে যোগাযোগ করুন।
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 font-bold text-red-600">
                  03
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  প্রয়োজনে রক্তদাতা হিসেবে যুক্ত হোন
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  আপনি রক্ত দিতে আগ্রহী হলে RoktoData-তে আপনার
                  তথ্য নিবন্ধন করে অন্যদের সাহায্য করতে পারেন।
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Blood donation CTA */}
        <section className="bg-red-600 py-14 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
              আপনি কি রক্তদাতা হতে চান?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-red-50 sm:text-base">
              আপনার রক্ত একজন মানুষের কঠিন সময়ে প্রয়োজন হতে পারে।
              স্বেচ্ছায় রক্তদাতা হিসেবে RoktoData-তে যুক্ত হন।
            </p>

            <a
              href="/register"
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-red-700 shadow-lg transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600"
            >
              রক্তদাতা হিসেবে নিবন্ধন করুন
            </a>
          </div>
        </section>

        {/* Local SEO content */}
        <section
          className="bg-slate-50 py-14 sm:py-16"
          aria-labelledby="local-seo-heading"
        >
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2
              id="local-seo-heading"
              className="text-2xl font-extrabold text-slate-900 sm:text-3xl"
            >
              কালীগঞ্জের রক্তদাতা তালিকা — RoktoData
            </h2>

            <div className="mt-5 space-y-4 text-sm leading-8 text-slate-600 sm:text-base">
              <p>
                RoktoData হলো কালীগঞ্জের রক্তদাতা খুঁজে পাওয়ার জন্য
                তৈরি একটি অনলাইন ডিরেক্টরি। এখানে বিভিন্ন রক্তের
                গ্রুপ অনুযায়ী রক্তদাতার তথ্য খুঁজে পাওয়া সহজ করার
                চেষ্টা করা হয়েছে।
              </p>

              <p>
                আপনি যদি কালীগঞ্জে A+, B+, O+, AB+ অথবা অন্য কোনো
                রক্তের গ্রুপের ডোনার খুঁজে থাকেন, তাহলে রক্তদাতা
                তালিকা থেকে প্রয়োজনীয় তথ্য দেখে যোগাযোগ করতে পারেন।
              </p>

              <p>
                একইভাবে যারা স্বেচ্ছায় রক্ত দিতে আগ্রহী, তারা
                রক্তদাতা হিসেবে নিবন্ধন করে এই ডিরেক্টরিতে যুক্ত
                হতে পারেন।
              </p>

              <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <strong>গুরুত্বপূর্ণ:</strong> RoktoData একটি
                রক্তদাতা ডিরেক্টরি। ডোনারের availability বা
                রক্তদানের চিকিৎসাগত যোগ্যতা নিশ্চিত করার দায়িত্ব
                সংশ্লিষ্ট ব্যক্তি ও চিকিৎসা প্রতিষ্ঠানের। জরুরি
                পরিস্থিতিতে নিকটস্থ হাসপাতাল বা ব্লাড ব্যাংকের
                সাথেও যোগাযোগ করুন।
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;