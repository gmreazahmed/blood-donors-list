import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Code2,
  Heart,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Users,
} from "lucide-react";

export default function SiteInfo() {
  return (
    <>
      <Helmet>
        <title>
          সাইট সম্পর্কে | RoktoData — Blood Donor Directory
        </title>

        <meta
          name="description"
          content="RoktoData সম্পর্কে জানুন। এটি একটি জনসেবামূলক blood donor directory, যা বর্তমানে সাতক্ষীরা জেলার কালিগঞ্জ উপজেলার জন্য চালু রয়েছে।"
        />

        <meta
          name="keywords"
          content="RoktoData, blood donor Kaliganj, রক্তদাতা কালিগঞ্জ, blood donor list Kaliganj, রক্তদান, সাতক্ষীরা রক্তদাতা"
        />

        <link
          rel="canonical"
          href="https://roktodata.vercel.app/siteinfo"
        />

        <meta
          property="og:title"
          content="সাইট সম্পর্কে | RoktoData"
        />

        <meta
          property="og:description"
          content="RoktoData একটি জনসেবামূলক blood donor directory।"
        />

        <meta
          property="og:url"
          content="https://roktodata.vercel.app/siteinfo"
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
          className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-red-300/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-5xl">

          {/* =========================
              Hero
          ========================== */}

          <header className="mx-auto mb-12 max-w-3xl text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl shadow-xl shadow-red-200">
              <img
                src="/roktoData.png"
                alt="RoktoData logo"
                className="h-full w-full object-contain p-2"
              />
            </div>

            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-red-600">
              About RoktoData
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              সাইট সম্পর্কে
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
              RoktoData — একটি জনসেবামূলক উদ্যোগ, যার লক্ষ্য প্রয়োজনের
              সময়ে রক্তদাতা ও রক্তপ্রয়োজনকারীদের মধ্যে তথ্যের সহজ
              সংযোগ তৈরি করা।
            </p>

          </header>

          {/* =========================
              Mission
          ========================== */}

          <section className="mb-6 rounded-3xl border border-red-100 bg-white p-6 shadow-xl shadow-red-100/40 sm:p-8">

            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Heart
                  className="h-6 w-6 fill-current"
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-red-600">
                  Our Mission
                </p>

                <h2 className="text-2xl font-extrabold text-gray-900">
                  মানবিক সহায়তার জন্য একটি সহজ প্ল্যাটফর্ম
                </h2>

                <p className="mt-4 text-sm leading-8 text-gray-600 sm:text-base">
                  এই ওয়েবসাইটটি জনসেবামূলক উদ্দেশ্যে তৈরি করা হয়েছে।
                  আমরা বিশ্বাস করি, রক্তদানের মাধ্যমে অনেক মানুষের জীবন
                  রক্ষা ও বাঁচানো সম্ভব। তাই এই প্ল্যাটফর্মটি সকলের জন্য
                  উন্মুক্ত, এবং সবাইকে অনুরোধ করা হচ্ছে সঠিক তথ্য প্রদান
                  করতে — কারণ এটি সবার কল্যাণের জন্য।
                </p>
              </div>

            </div>
          </section>

          {/* =========================
              How it works
          ========================== */}

          <section className="mb-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-lg shadow-gray-100/60 sm:p-8">

            <div className="mb-7 flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-red-600">
                  How It Works
                </p>

                <h2 className="mt-1 text-2xl font-extrabold text-gray-900">
                  কীভাবে কাজ করে
                </h2>
              </div>

            </div>

            <div className="grid gap-4 sm:grid-cols-3">

              <InfoStep
                number="01"
                title="তথ্য যোগ করুন"
                text="রক্তদাতারা প্রয়োজনীয় তথ্য দিয়ে সহজে তালিকায় যুক্ত হতে পারেন।"
                icon={<Users className="h-5 w-5" />}
              />

              <InfoStep
                number="02"
                title="ডোনার খুঁজুন"
                text="রক্তপ্রয়োজনকারীরা প্রয়োজনীয় রক্তের গ্রুপ অনুযায়ী donor খুঁজে নিতে পারেন।"
                icon={<MapPin className="h-5 w-5" />}
              />

              <InfoStep
                number="03"
                title="যোগাযোগ করুন"
                text="তালিকায় থাকা যোগাযোগের তথ্য ব্যবহার করে প্রয়োজন অনুযায়ী যোগাযোগ করা যায়।"
                icon={<Phone className="h-5 w-5" />}
              />

            </div>

            <div className="mt-7 rounded-2xl border border-red-100 bg-red-50/70 p-5">

              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-red-600" />

                <p className="text-sm leading-7 text-gray-700">
                  এই সাইটটি বর্তমানে{" "}
                  <strong className="text-gray-900">
                    সাতক্ষীরা জেলার কালিগঞ্জ উপজেলা
                  </strong>{" "}
                  এর জন্য চালু রয়েছে। ভবিষ্যতে অন্যান্য অঞ্চলেও এই
                  সেবা সম্প্রসারণের পরিকল্পনা রয়েছে।
                </p>
              </div>

            </div>
          </section>

          {/* =========================
              Foundations
          ========================== */}

          <section className="mb-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-lg shadow-gray-100/60 sm:p-8">

            <div className="mb-6 flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Building2 className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-red-600">
                  Support
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-gray-900 sm:text-2xl">
                  তথ্য ও সার্বিক সহযোগিতা
                </h2>
              </div>

            </div>

            <div className="grid gap-3 sm:grid-cols-3">

              <SupportItem text="আমার ব্লাড ডোনেট ফাউন্ডেশন" />

              <SupportItem text="রায়পুর নিজদেবপুর ব্লাড ফাউন্ডেশন" />

              <SupportItem text="Hope Blood Donate Foundation" />

            </div>

          </section>

          {/* =========================
              Developers
          ========================== */}

          <section className="mb-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-lg shadow-gray-100/60 sm:p-8">

            <div className="mb-7 text-center">

              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Code2 className="h-6 w-6" />
              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-red-600">
                Development Team
              </p>

              <h2 className="mt-1 text-xl font-extrabold text-gray-900 sm:text-2xl">
                এই উদ্যোগ ও ওয়েব অ্যাপ্লিকেশনের পেছনে
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Development &amp; technical contribution
              </p>

            </div>

            <div className="grid gap-3 sm:grid-cols-3">

              <DeveloperCard
                name="জিএম রিয়াজ আহমেদ"
                href="https://www.facebook.com/gmreazahmed"
              />

              <DeveloperCard
                name="নাসিফ উর রহমান"
                href="https://www.facebook.com/nasif.rahman.980"
              />

              <DeveloperCard
                name="মীর মারুফ হোসেন"
                href="https://www.facebook.com/MirMaruf360"
              />

            </div>

          </section>

          {/* =========================
              Bamboo Coders
          ========================== */}

          <section className="mb-8 overflow-hidden rounded-3xl border border-red-200 bg-gradient-to-br from-red-100 to-white p-6 sm:p-8">

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-white shadow-lg shadow-red-200">
                    <Building2 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-red-600">
                      Development Agency
                    </p>

                    <h2 className="text-xl font-extrabold text-gray-900">
                      Bamboo Coders
                    </h2>
                  </div>
                </div>

                <p className="mt-4 max-w-xl text-sm leading-7 text-gray-700">
                  ওয়েব অ্যাপ্লিকেশন ও প্রযুক্তিগত সহযোগিতার জন্য
                  যোগাযোগ করতে পারেন।
                </p>

              </div>

              <div className="space-y-3 sm:min-w-[260px]">

                <a
                  href="tel:+8801700837307"
                  className="flex items-center gap-3 rounded-xl border border-red-100 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-red-300 hover:text-red-600"
                >
                  <Phone className="h-4 w-4 text-red-600" />
                  +8801700837307
                </a>

                <a
                  href="mailto:bamboocodersbd@gimail.com"
                  className="flex items-center gap-3 rounded-xl border border-red-100 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-red-300 hover:text-red-600"
                >
                  <Mail className="h-4 w-4 shrink-0 text-red-600" />
                  <span className="break-all">
                    bamboocodersbd@gimail.com
                  </span>
                </a>

              </div>

            </div>
          </section>

          {/* =========================
              Feedback note
          ========================== */}

          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 text-center shadow-sm">

            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-700">
              <CheckCircle2 className="h-4 w-4 text-red-600" />
              আপনার মতামত আমাদের জন্য গুরুত্বপূর্ণ
            </div>

            <p className="mx-auto mt-2 max-w-2xl text-xs leading-6 text-gray-500">
              যদি কোনও ভুল তথ্য থাকে বা আপনার কোনো পরামর্শ থাকে,
              অনুগ্রহ করে আমাদের পরামর্শ বক্সে জানান।
            </p>

          </div>

          <div className="h-4" />
        </div>
      </main>
    </>
  );
}

/* =========================
   Info Step
========================= */

function InfoStep({
  number,
  title,
  text,
  icon,
}: {
  number: string;
  title: string;
  text: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group rounded-2xl border border-gray-100 bg-gray-50/70 p-5 transition duration-300 hover:-translate-y-1 hover:border-red-100 hover:bg-white hover:shadow-lg">

      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm">
          {icon}
        </div>

        <span className="text-xs font-extrabold text-gray-300">
          {number}
        </span>

      </div>

      <h3 className="mt-5 font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-500">
        {text}
      </p>

      <ArrowRight className="mt-4 h-4 w-4 text-red-300 transition group-hover:translate-x-1 group-hover:text-red-600" />
    </div>
  );
}

/* =========================
   Support Item
========================= */

function SupportItem({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">

      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

      <span className="text-sm font-semibold leading-6 text-gray-700">
        {text}
      </span>

    </div>
  );
}

/* =========================
   Developer Card
========================= */

function DeveloperCard({
  name,
  href,
}: {
  name: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4 transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:bg-white hover:shadow-lg"
    >
      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-600">
          {name.charAt(0)}
        </div>

        <span className="text-sm font-bold text-gray-700 transition group-hover:text-red-600">
          {name}
        </span>

      </div>

      <ArrowRight className="h-4 w-4 text-gray-300 transition group-hover:translate-x-1 group-hover:text-red-600" />
    </a>
  );
}