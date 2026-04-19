export default function SiteInfo() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-red-50 via-white to-red-50 py-10">
      <div className="max-w-4xl mx-auto px-4 space-y-10">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600">
            সাইট সম্পর্কে
          </h1>
          <p className="text-gray-500 mt-2">
            RoktoData — একটি জনসেবামূলক উদ্যোগ
          </p>
        </div>

        {/* Card 1 */}
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <p className="text-gray-700 leading-relaxed">
            এই ওয়েবসাইটটি জনসেবামূলক উদ্দেশ্যে তৈরি করা হয়েছে। আমরা বিশ্বাস করি, রক্তদানের মাধ্যমে অনেক মানুষের জীবন রক্ষা ও বাঁচানো সম্ভব। তাই এই প্ল্যাটফর্মটি সকলের জন্য উন্মুক্ত, এবং সবাইকে অনুরোধ করা হচ্ছে সঠিক তথ্য প্রদান করতে — কারণ এটি সবার কল্যাণের জন্য।
          </p>
          
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <h2 className="text-xl font-semibold text-red-600">
            কীভাবে কাজ করে -
          </h2>

          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>রক্তদাতারা সহজে তথ্য যোগ করতে পারেন</li>
            <li>রক্তপ্রয়োজনকারীরা দ্রুত donor খুঁজে পান</li>
            <li>সর্বশেষ রক্তদানের তথ্য দেখা যায়</li>
          </ul>
          <p className="text-gray-700">
            এই সাইটটি বর্তমানে সাতক্ষীরা জেলার কালিগঞ্জ উপজেলার জন্য চালু রয়েছে।
            ভবিষ্যতে অন্যান্য অঞ্চলেও এই সেবা সম্প্রসারণের পরিকল্পনা রয়েছে।
          </p>

        </div>

        {/* Foundation */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-red-600 mb-3">
            তথ্য এবং সার্বিক সহযোগিতায় ছিল যেসব ব্লাড ডোনেট ফাউন্ডেশন -
          </h2>

          <ul className="space-y-2 text-gray-700 font-medium">
            <li>✔ আমার ব্লাড ডোনেট ফাউন্ডেশন</li>
            <li>✔ রায়পুর নিজদেবপুর ব্লাড ফাউন্ডেশন</li>
            <li>✔ Hope Blood Donate Foundation</li>
          </ul>
        </div>

        {/* Developers */}
        <div className="bg-white rounded-2xl shadow-md p-6 text-center space-y-3">
          <h2 className="text-xl font-semibold text-red-600">
            এই উদ্যোগের পেছনে ও ওয়েব অ্যাপ্লিকেশনটি ডেভেলপ করেছেন -
          </h2>

          <p className="text-gray-700">
            <a href="https://www.facebook.com/gmreazahmed" className="text-red-600 font-semibold">
              জিএম রিয়াজ আহমেদ
            </a>
          </p>

          <p className="text-gray-700">
            <a href="https://www.facebook.com/nasif.rahman.980" className="text-red-600 font-semibold">
              নাসিফ উর রহমান
            </a>
          </p>

          <p className="text-gray-700">
            <a href="https://www.facebook.com/MirMaruf360" className="text-red-600 font-semibold">
              মীর মারুফ হোসেন
            </a>
          </p>
        </div>

        {/* Agency */}
        <div className="bg-red-100 border border-red-200 rounded-2xl p-6 space-y-2">
          <h2 className="text-lg font-semibold text-red-700">
            🏢 Bamboo Coders
          </h2>

          <p className="text-gray-800">
            ফোন: <a href="tel:+8801700837307" className="text-red-600">+8801700837307</a>
          </p>

          <p className="text-gray-800">
            ইমেইল: <a href="mailto:bamboocodersbd@gimail.com" className="text-red-600">bamboocodersbd@gimail.com</a>
          </p>
        </div>

        {/* Footer Note */}
        <div className="text-center text-sm text-gray-500">
          *যদি কোনও ভুল তথ্য থাকে বা আপনার কোন পরামর্শ থাকে, অনুগ্রহ করে আমাদের পরামর্শ বক্সে জানান।*
        </div>

      </div>
    </section>
  );
}