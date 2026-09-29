import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Droplets,
  Heart,
  Info,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "কালীগঞ্জে রক্তদাতা কোথায় পাব?",
    answer:
      "RoktoData-এর রক্তদাতা তালিকা থেকে রক্তের গ্রুপ ও এলাকার তথ্য ব্যবহার করে কালীগঞ্জ, সাতক্ষীরার নিবন্ধিত রক্তদাতা খুঁজে দেখতে পারেন।",
  },
  {
    question: "কতদিন পর পর রক্ত দেওয়া যায়?",
    answer:
      "রক্ত দেওয়ার ব্যবধান সবার জন্য একই নয়। এটি donor-এর স্বাস্থ্য, donation type এবং স্থানীয় blood service-এর নিয়মের ওপর নির্ভর করে। রক্ত দেওয়ার আগে সংশ্লিষ্ট blood service-এর screening ও নির্দেশনা অনুসরণ করুন।",
  },
  {
    question: "রক্তের গ্রুপ কয়টি?",
    answer:
      "ABO ও Rh classification মিলিয়ে সাধারণভাবে ব্যবহৃত আটটি group হলো A+, A-, B+, B-, AB+, AB-, O+ এবং O-।",
  },
  {
    question: "O+ রক্তদাতা কালীগঞ্জে কীভাবে খুঁজব?",
    answer:
      "RoktoData-এর donor list-এ গিয়ে O+ blood group নির্বাচন করে কালীগঞ্জের নিবন্ধিত donor খুঁজে দেখতে পারেন।",
  },
  {
    question: "রক্তদাতা হিসেবে কীভাবে নিবন্ধন করব?",
    answer:
      "RoktoData-এর রক্তদাতা হিসেবে নিবন্ধন পেজে গিয়ে প্রয়োজনীয় তথ্য দিয়ে donor registration সম্পন্ন করতে পারেন।",
  },
  {
    question: "অসুস্থ থাকলে রক্ত দেওয়া যাবে?",
    answer:
      "অসুস্থ অবস্থায় নিজে থেকে রক্তদান করা উচিত নয়। donor eligibility স্বাস্থ্য পরিস্থিতি ও screening-এর ওপর নির্ভর করে। রক্ত দেওয়ার আগে সংশ্লিষ্ট blood service বা স্বাস্থ্যকর্মীর নির্দেশনা অনুসরণ করুন।",
  },
];

const bloodGroups = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8 max-w-3xl">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700">
        <Droplets className="h-3.5 w-3.5" aria-hidden="true" />
        {eyebrow}
      </div>

      <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
        {title}
      </h2>

      {description && (
        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

function FAQItem({
  question,
  answer,
  open,
  onClick,
}: {
  question: string;
  answer: string;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={onClick}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-200"
      >
        <span className="text-sm font-bold leading-6 text-slate-900 sm:text-base">
          {question}
        </span>

        <ChevronDown
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${
            open ? "rotate-180 text-red-600" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="border-t border-slate-100 px-5 pb-5 pt-4">
          <p className="text-sm leading-7 text-slate-600">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function BloodDonorListKaliganj() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const canonical =
    "https://roktodata.vercel.app/blog/blood-donor-list-kaliganj";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Blood Donor List Kaliganj | কালীগঞ্জের রক্তদাতা ও রক্তদান সম্পর্কিত তথ্য",
    description:
      "কালীগঞ্জ, সাতক্ষীরার রক্তদাতা খোঁজা, রক্তদানের সাধারণ তথ্য, রক্তের গ্রুপ, রক্তদানের ব্যবধান এবং donor registration সম্পর্কে তথ্য।",
    url: canonical,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
    publisher: {
      "@type": "Organization",
      name: "RoktoData",
      url: "https://roktodata.vercel.app/",
      logo: {
        "@type": "ImageObject",
        url: "https://roktodata.vercel.app/roktoData.png",
      },
    },
    inLanguage: "bn-BD",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "RoktoData",
        item: "https://roktodata.vercel.app/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://roktodata.vercel.app/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Blood Donor List Kaliganj",
        item: canonical,
      },
    ],
  };

  return (
    <>
      <Helmet>
        <html lang="bn" />

        <title>
          Blood Donor List Kaliganj | রক্তদাতা কালীগঞ্জ | RoktoData
        </title>

        <meta
          name="description"
          content="কালীগঞ্জ, সাতক্ষীরার Blood Donor List ও রক্তদাতা খুঁজুন। রক্তের গ্রুপ, রক্তদান, কতদিন পর রক্ত দেওয়া যায়, রক্তদাতার তথ্য এবং রক্তদাতা নিবন্ধন সম্পর্কে জানুন।"
        />

        <meta
          name="keywords"
          content="Blood Donor List Kaliganj, Blood Donor Kaliganj, Kaliganj Blood Donation, Kaligonj Blood Donor, Kaliganj Satkhira Blood Donor, Blood Donor Satkhira, রক্তদাতা কালীগঞ্জ, রক্তদাতা তালিকা কালীগঞ্জ, রক্তের ডোনার কালীগঞ্জ, কালীগঞ্জ রক্তদাতা, কালীগঞ্জ রক্তদান, সাতক্ষীরা রক্তদাতা, RoktoData Kaliganj"
        />

        <link rel="canonical" href={canonical} />

        <meta
          property="og:title"
          content="Blood Donor List Kaliganj | রক্তদাতা কালীগঞ্জ"
        />

        <meta
          property="og:description"
          content="কালীগঞ্জ, সাতক্ষীরার রক্তদাতা খুঁজুন এবং রক্তদান সম্পর্কিত গুরুত্বপূর্ণ তথ্য জানুন।"
        />

        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonical} />
        <meta
          property="og:image"
          content="https://roktodata.vercel.app/roktoData.png"
        />
        <meta property="og:locale" content="bn_BD" />

        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content="Blood Donor List Kaliganj | রক্তদাতা কালীগঞ্জ"
        />

        <meta
          name="twitter:description"
          content="কালীগঞ্জ, সাতক্ষীরার রক্তদাতা এবং রক্তদান সম্পর্কিত তথ্য।"
        />

        <meta
          name="twitter:image"
          content="https://roktodata.vercel.app/roktoData.png"
        />

        <meta
          name="robots"
          content="index, follow, max-image-preview:large"
        />

        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>

        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>

        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Breadcrumb */}
        <div className="border-b border-slate-100 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-xs text-slate-500"
            >
              <Link
                to="/"
                className="font-semibold transition hover:text-red-600"
              >
                RoktoData
              </Link>

              <span aria-hidden="true">/</span>

              <Link
                to="/blog"
                className="font-semibold transition hover:text-red-600"
              >
                Blog
              </Link>

              <span aria-hidden="true">/</span>

              <span className="truncate font-medium text-slate-700">
                Blood Donor List Kaliganj
              </span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden bg-white">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-100/70 blur-3xl" />
          <div className="absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-rose-100/60 blur-3xl" />

          <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
            <div className="max-w-4xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3.5 py-2 text-xs font-bold text-red-700">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                কালীগঞ্জ, সাতক্ষীরা
              </div>

              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Blood Donor List Kaliganj
                <span className="mt-2 block text-red-600">
                  কালীগঞ্জের রক্তদাতা ও রক্তদান তথ্য
                </span>
              </h1>

              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
                কালীগঞ্জে রক্তদাতা খুঁজছেন? RoktoData-তে রক্তের গ্রুপ ও
                এলাকার ভিত্তিতে নিবন্ধিত রক্তদাতার তথ্য খুঁজে দেখার পাশাপাশি
                রক্তদান, রক্তের গ্রুপ, donor এবং রক্তদানের সাধারণ নিয়ম সম্পর্কে
                সহজ ভাষায় প্রয়োজনীয় তথ্য জানা যাবে।
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/donors"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-extrabold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-100"
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                  কালীগঞ্জের রক্তদাতা খুঁজুন
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>

                <Link
                  to="/register"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-extrabold text-slate-800 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-4 focus:ring-red-100"
                >
                  <UserPlus className="h-4 w-4" aria-hidden="true" />
                  রক্তদাতা হিসেবে নিবন্ধন করুন
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick information */}
        <section className="border-y border-slate-200 bg-slate-50">
          <div className="mx-auto grid max-w-6xl gap-3 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {[
              {
                icon: Search,
                title: "রক্তদাতা খুঁজুন",
                text: "রক্তের গ্রুপ ও এলাকা অনুযায়ী",
              },
              {
                icon: Droplets,
                title: "৮টি Blood Group",
                text: "A, B, AB ও O — positive/negative",
              },
              {
                icon: Clock3,
                title: "Donation Interval",
                text: "ব্যক্তি ও service অনুযায়ী ভিন্ন",
              },
              {
                icon: Heart,
                title: "স্বেচ্ছায় রক্তদান",
                text: "মানবিক সহায়তার একটি উপায়",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>

                  <h2 className="text-sm font-extrabold text-slate-900">
                    {item.title}
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          {/* Donor CTA */}
          <section className="mb-16">
            <div className="overflow-hidden rounded-3xl bg-slate-950 p-6 text-white sm:p-8 lg:p-10">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-red-200">
                    <Droplets className="h-3.5 w-3.5" />
                    Kaliganj Blood Donor Directory
                  </div>

                  <h2 className="text-2xl font-extrabold sm:text-3xl">
                    জরুরি সময়ে রক্তদাতা খুঁজুন
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
                    রক্তের গ্রুপ নির্বাচন করে কালীগঞ্জের নিবন্ধিত রক্তদাতাদের
                    তালিকা দেখুন এবং প্রয়োজন অনুযায়ী যোগাযোগ করুন।
                  </p>
                </div>

                <Link
                  to="/donors"
                  className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-extrabold text-white transition hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-300/30"
                >
                  <Search className="h-4 w-4" />
                  রক্তদাতা তালিকা দেখুন
                </Link>
              </div>
            </div>
          </section>

          {/* What is blood donation */}
          <section className="mb-16">
            <SectionTitle
              eyebrow="রক্তদান সম্পর্কে"
              title="রক্তদান কী এবং কেন গুরুত্বপূর্ণ?"
              description="রক্ত প্রয়োজন এমন রোগীদের চিকিৎসায় নিরাপদ রক্তের সরবরাহ অত্যন্ত গুরুত্বপূর্ণ।"
            />

            <div className="grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
              <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <p className="text-sm leading-8 text-slate-600 sm:text-base">
                  রক্তদান হলো একজন উপযুক্ত donor-এর কাছ থেকে নির্দিষ্ট পরিমাণ
                  রক্ত সংগ্রহ করে প্রয়োজনীয় রোগীর চিকিৎসায় ব্যবহার করা। দুর্ঘটনা,
                  অস্ত্রোপচার, প্রসবকালীন জটিলতা, গুরুতর রক্তস্বল্পতা এবং বিভিন্ন
                  চিকিৎসায় রক্ত বা রক্তের উপাদান প্রয়োজন হতে পারে।
                </p>

                <p className="mt-5 text-sm leading-8 text-slate-600 sm:text-base">
                  নিরাপদ রক্তের নিয়মিত সরবরাহের জন্য স্বেচ্ছায় রক্তদানকারী
                  উপযুক্ত donor-দের ভূমিকা গুরুত্বপূর্ণ। তবে রক্তদানের আগে
                  donor screening এবং সংশ্লিষ্ট blood service-এর নির্দেশনা
                  অনুসরণ করা প্রয়োজন।
                </p>
              </article>

              <div className="rounded-3xl bg-red-50 p-6 sm:p-8">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-red-600 shadow-sm">
                  <Heart className="h-5 w-5" />
                </div>

                <h3 className="text-lg font-extrabold text-slate-900">
                  রক্তদান মানুষের পাশে দাঁড়ানোর একটি উপায়
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  নিয়মিত ও স্বেচ্ছায় রক্তদান নিরাপদ রক্তের সরবরাহ বজায় রাখতে
                  সহায়তা করতে পারে।
                </p>
              </div>
            </div>
          </section>

          {/* Donation interval */}
          <section className="mb-16">
            <SectionTitle
              eyebrow="Donation Interval"
              title="কতদিন পর পর রক্ত দেওয়া যায়?"
              description="রক্তদানের ব্যবধান নিয়ে প্রচলিত তথ্যের বদলে donor screening ও স্থানীয় blood service-এর নির্দেশনা অনুসরণ করা গুরুত্বপূর্ণ।"
            />

            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm">
                  <Info className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    সবার জন্য একই interval নয়
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    রক্ত দেওয়ার ব্যবধান donor-এর স্বাস্থ্য, donation type এবং
                    সংশ্লিষ্ট blood service-এর নিয়মের ওপর নির্ভর করতে পারে।
                    বিভিন্ন দেশ ও blood service-এর donor selection criteria
                    আলাদা হতে পারে।
                  </p>

                  <p className="mt-3 text-sm font-semibold leading-7 text-slate-800">
                    তাই শুধু “কয় মাস পর” শুনে সিদ্ধান্ত না নিয়ে প্রতিবার
                    donation-এর আগে screening ও সংশ্লিষ্ট স্বাস্থ্যকর্মীর
                    নির্দেশনা অনুসরণ করুন।
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Blood groups */}
          <section className="mb-16">
            <SectionTitle
              eyebrow="Blood Groups"
              title="রক্তের গ্রুপ কয়টি?"
              description="ABO এবং Rh classification অনুযায়ী সাধারণভাবে ব্যবহৃত আটটি blood group হলো:"
            />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {bloodGroups.map((group) => (
                <Link
                  key={group}
                  to="/donors"
                  className="group rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-lg font-black text-red-600 transition group-hover:bg-red-600 group-hover:text-white">
                    {group}
                  </div>

                  <p className="mt-3 text-xs font-bold text-slate-600">
                    {group} রক্তদাতা
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* Eligibility */}
          <section className="mb-16">
            <SectionTitle
              eyebrow="Donor Information"
              title="কারা রক্ত দিতে পারেন?"
              description="রক্তদানের eligibility ব্যক্তি ও স্থানীয় blood service-এর নিয়ম অনুযায়ী নির্ধারিত হয়।"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "রক্তদানের সময় সুস্থ থাকা গুরুত্বপূর্ণ",
                "প্রতিবার donation-এর আগে donor screening প্রয়োজন",
                "অসুস্থতা বা কিছু medical condition থাকলে donation স্থগিত হতে পারে",
                "কিছু ওষুধ বা সংক্রমণের ক্ষেত্রে সাময়িকভাবে donor হওয়া যায় না",
                "গর্ভাবস্থা ও কিছু বিশেষ স্বাস্থ্য পরিস্থিতিতে donation করা উচিত নয়",
                "চূড়ান্ত eligibility সংশ্লিষ্ট blood service বা healthcare professional নির্ধারণ করেন",
              ].map((text) => (
                <div
                  key={text}
                  className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
                    aria-hidden="true"
                  />

                  <p className="text-sm leading-7 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Before and after */}
          <section className="mb-16">
            <SectionTitle
              eyebrow="Before & After"
              title="রক্ত দেওয়ার আগে ও পরে কী করবেন?"
            />

            <div className="grid gap-6 md:grid-cols-2">
              <article className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Clock3 className="h-5 w-5" />
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900">
                    রক্ত দেওয়ার আগে
                  </h3>
                </div>

                <ul className="space-y-3">
                  {[
                    "পর্যাপ্ত বিশ্রাম নেওয়ার চেষ্টা করুন",
                    "স্বাভাবিক খাবার ও পানি গ্রহণ করুন",
                    "অসুস্থ বোধ করলে donation স্থগিত করুন",
                    "চলমান ওষুধ বা স্বাস্থ্যগত তথ্য screening-এ জানান",
                    "আগের donation-এর তারিখ জানা থাকলে জানান",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm leading-7 text-slate-600"
                    >
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900">
                    রক্ত দেওয়ার পরে
                  </h3>
                </div>

                <ul className="space-y-3">
                  {[
                    "কিছু সময় বিশ্রাম নিন",
                    "পর্যাপ্ত তরল পান করুন",
                    "blood service-এর দেওয়া নির্দেশনা অনুসরণ করুন",
                    "অস্বাভাবিক অসুস্থতা হলে স্বাস্থ্যসেবা নিন",
                    "পরবর্তী donation-এর সময় নিজে থেকে নির্ধারণ না করে service-এর নির্দেশনা অনুসরণ করুন",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm leading-7 text-slate-600"
                    >
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </section>

          {/* Kaliganj map */}
          <section className="mb-16">
            <SectionTitle
              eyebrow="Kaliganj, Satkhira"
              title="কালীগঞ্জ, সাতক্ষীরার রক্তদাতা"
              description="RoktoData কালীগঞ্জ উপজেলা, সাতক্ষীরা এলাকার রক্তদাতাদের খুঁজে পেতে সহায়তা করার জন্য তৈরি করা হয়েছে।"
            />

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
                <div className="p-6 sm:p-8">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <MapPin
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-950">
                    কালীগঞ্জ উপজেলা, সাতক্ষীরা
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    কালীগঞ্জ সাতক্ষীরা জেলার একটি উপজেলা। এই এলাকার রক্তদাতাদের
                    খুঁজে পাওয়া সহজ করার লক্ষ্যেই RoktoData-এর donor directory
                    তৈরি করা হয়েছে।
                  </p>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <MapPin className="h-4 w-4 shrink-0 text-red-600" />
                      <span>Kaliganj Upazila, Satkhira, Bangladesh</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Droplets className="h-4 w-4 shrink-0 text-red-600" />
                      <span>Kaliganj Blood Donor Directory</span>
                    </div>
                  </div>

                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Kaliganj%20Upazila%2C%20Satkhira%2C%20Bangladesh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-extrabold text-white transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-100"
                  >
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    Google Maps-এ দেখুন
                  </a>
                </div>

                <div className="min-h-[320px] bg-slate-100 lg:min-h-full">
                  <iframe
                    title="Kaliganj Upazila, Satkhira map"
                    src="https://www.google.com/maps?q=Kaliganj%20Upazila%2C%20Satkhira%2C%20Bangladesh&output=embed"
                    className="h-[320px] w-full border-0 lg:h-full lg:min-h-[430px]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Kaliganj donor section */}
          <section className="mb-16">
            <SectionTitle
              eyebrow="Kaliganj Blood Donor"
              title="কালীগঞ্জের রক্তদাতা তালিকা"
              description="জরুরি সময়ে রক্তের প্রয়োজন হলে RoktoData-এর donor directory থেকে নিবন্ধিত রক্তদাতাদের তথ্য খুঁজে দেখতে পারেন।"
            />

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "কালীগঞ্জ",
                      "সাতক্ষীরা",
                      "A+",
                      "B+",
                      "O+",
                      "AB+",
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="mt-5 text-xl font-extrabold text-slate-950">
                    রক্তের গ্রুপ অনুযায়ী donor খুঁজুন
                  </h3>

                  <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                    আপনার প্রয়োজনীয় blood group অনুযায়ী donor list দেখুন।
                    donor-এর দেওয়া যোগাযোগের তথ্য ব্যবহার করার সময় দায়িত্বশীল
                    থাকুন এবং অপ্রয়োজনীয় কল বা বার্তা থেকে বিরত থাকুন।
                  </p>
                </div>

                <Link
                  to="/donors"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-extrabold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700"
                >
                  <Search className="h-4 w-4" />
                  Donor List
                </Link>
              </div>
            </div>
          </section>

          {/* Donor registration */}
          <section className="mb-16">
            <div className="rounded-3xl bg-red-600 p-6 text-white sm:p-8 lg:p-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                    <Heart className="h-5 w-5" />
                  </div>

                  <h2 className="text-2xl font-extrabold sm:text-3xl">
                    আপনি কি রক্তদাতা?
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-red-50 sm:text-base">
                    রক্তদানের জন্য আগ্রহী হলে RoktoData-তে আপনার donor
                    information নিবন্ধন করতে পারেন।
                  </p>
                </div>

                <Link
                  to="/register"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-red-700 shadow-lg transition hover:bg-red-50"
                >
                  <UserPlus className="h-4 w-4" />
                  রক্তদাতা হিসেবে নিবন্ধন
                </Link>
              </div>
            </div>
          </section>

          {/* Donor data */}
          <section className="mb-16">
            <SectionTitle
              eyebrow="Donor Information"
              title="রক্তদাতার তথ্য কেন গুরুত্বপূর্ণ?"
              description="জরুরি সময়ে donor-এর প্রয়োজনীয় তথ্য খুঁজে পাওয়া যোগাযোগকে সহজ করতে পারে।"
            />

            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
              <p className="text-sm leading-8 text-slate-600 sm:text-base">
                জরুরি সময়ে শুধু blood group জানা যথেষ্ট নাও হতে পারে। এলাকার
                তথ্য এবং যোগাযোগের মাধ্যম থাকলে প্রয়োজনের সময়ে registered
                donor-এর সঙ্গে যোগাযোগ করা সহজ হতে পারে। RoktoData-তে donor
                registration-এর সময় নাম, blood group, উপজেলা, ইউনিয়ন, গ্রাম,
                ফোন এবং শেষ রক্তদানের তারিখের মতো তথ্য রাখা হয়।
              </p>

              <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />

                  <p className="text-xs leading-6 text-slate-600">
                    <strong className="text-slate-800">
                      গুরুত্বপূর্ণ:
                    </strong>{" "}
                    RoktoData-এর donor information দায়িত্বশীলভাবে ব্যবহার করুন।
                    জরুরি রক্তের প্রয়োজন ছাড়া donor-কে অপ্রয়োজনীয়ভাবে কল বা
                    বার্তা দেওয়া থেকে বিরত থাকুন।
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-16">
            <SectionTitle
              eyebrow="FAQ"
              title="রক্তদান ও কালীগঞ্জের রক্তদাতা সম্পর্কে সাধারণ প্রশ্ন"
              description="রক্তদাতা খোঁজা ও রক্তদান সম্পর্কে সাধারণ কিছু প্রশ্নের উত্তর।"
            />

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={faq.question}
                  question={faq.question}
                  answer={faq.answer}
                  open={openFaq === index}
                  onClick={() =>
                    setOpenFaq(openFaq === index ? null : index)
                  }
                />
              ))}
            </div>
          </section>

          {/* Health disclaimer */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />

              <div>
                <h2 className="text-sm font-extrabold text-slate-800">
                  গুরুত্বপূর্ণ স্বাস্থ্য তথ্য
                </h2>

                <p className="mt-2 text-xs leading-6 text-slate-500">
                  এই পেজটি সাধারণ তথ্য ও জনসচেতনতার উদ্দেশ্যে তৈরি। এটি
                  চিকিৎসকের পরামর্শ বা blood service-এর donor screening-এর
                  বিকল্প নয়। রক্তদান বা transfusion-এর বিষয়ে চূড়ান্ত সিদ্ধান্ত
                  সংশ্লিষ্ট healthcare professional বা blood service-এর
                  নির্দেশনা অনুযায়ী নিন।
                </p>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="rounded-3xl border border-red-100 bg-red-50 p-6 text-center sm:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-red-600 shadow-sm">
              <Droplets className="h-6 w-6" />
            </div>

            <h2 className="mt-5 text-2xl font-extrabold text-slate-950">
              কালীগঞ্জের রক্তদাতা খুঁজছেন?
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
              RoktoData-এর donor directory থেকে রক্তের গ্রুপ অনুযায়ী নিবন্ধিত
              রক্তদাতাদের খুঁজে দেখুন।
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/donors"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-extrabold text-white shadow-lg shadow-red-600/20 hover:bg-red-700"
              >
                <Search className="h-4 w-4" />
                রক্তদাতা খুঁজুন
              </Link>

              <Link
                to="/blood-request"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 text-sm font-extrabold text-red-700 hover:bg-red-100"
              >
                <Phone className="h-4 w-4" />
                রক্তের অনুরোধ
              </Link>
            </div>
          </section>

          {/* Sources */}
          <section className="mt-10 border-t border-slate-200 pt-8">
            <div className="flex items-start gap-3">
              <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />

              <div>
                <h2 className="text-sm font-extrabold text-slate-800">
                  তথ্যের উৎস
                </h2>

                <p className="mt-2 text-xs leading-6 text-slate-500">
                  রক্তদান ও donor eligibility সম্পর্কিত সাধারণ তথ্যের জন্য
                  World Health Organization (WHO)-এর blood donation এবং donor
                  selection guidance অনুসরণ করা হয়েছে। স্থানীয় donor eligibility
                  ও donation interval সংশ্লিষ্ট blood service-এর নিয়ম অনুযায়ী
                  যাচাই করা উচিত।
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}