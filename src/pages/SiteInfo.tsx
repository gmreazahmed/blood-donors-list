export default function SiteInfo() {
  return (
    <section id="siteInfoSection" className="bg-red-50 mt-15">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-red-700 mb-6">সাইট সম্পর্কে তথ্য</h1>

        <p className="text-gray-800 text-lg leading-relaxed mb-6">
          এই ওয়েবসাইটটি জনসেবামূলক উদ্দেশ্যে তৈরি করা হয়েছে।  
          আমরা বিশ্বাস করি, রক্তদানের মাধ্যমে অনেক মানুষের জীবন রক্ষা ও বাঁচানো সম্ভব।  
          তাই এই প্ল্যাটফর্মটি সকলের জন্য উন্মুক্ত, এবং সবাইকে অনুরোধ করা হচ্ছে সঠিক তথ্য প্রদান করতে — কারণ এটি সবার কল্যাণের জন্য।
        </p>

        <p className="text-gray-700 text-base mb-6">
          এই সাইটের মাধ্যমে রক্তদাতারা তাদের তথ্য আপডেট করতে পারবেন এবং রক্তপ্রয়োজনকারীরা সহজেই প্রয়োজনীয় রক্তদাতাদের খুঁজে পাবেন।  
          এছাড়া সর্বশেষ রক্তদানের তারিখও উল্লেখ থাকায় সহজে রক্তদাতা বাছাই করতে পারবেন।
        </p>

        <p className="text-gray-700 text-base mb-6">
          বর্তমানে সাইটটি সাতক্ষীরা জেলার কালিগঞ্জ উপজেলার জন্য তৈরি করা হয়েছে। <br />
          ভবিষ্যতে অন্যান্য উপজেলা ও অঞ্চলেও এই সেবাটি সম্প্রসারণের পরিকল্পনা রয়েছে।  
          ফাউন্ডেশন গুলো সহযোগিতা পেলে, অন্যান্য উপজেলার জন্য উন্মুক্ত করে দেওয়া হবে।
        </p>

        <p className="text-gray-700 text-lg font-semibold mb-2">
          তথ্য এবং সার্বিক সহযোগিতায় ছিল যেসব ব্লাড ডোনেট ফাউন্ডেশন:
        </p>
        <ul className="list-disc list-inside font-semibold text-gray-800 text-base space-y-2 mb-6">
          <li>আমার ব্লাড ডোনেট ফাউন্ডেশন</li>
          <li>ব্লাড ডোনেট ফাউন্ডেশন</li>
        </ul>

        <p className="text-gray-700 text-base mb-6">
          আপনার সহযোগিতা আমাদের জন্য অত্যন্ত মূল্যবান এবং এটি আমাদের কাজ চালিয়ে যাওয়ার অনুপ্রেরণা দেয়।  
          আসুন, সবাই মিলে “রক্ত দেই, জীবন বাঁচাই” এই উদ্দেশ্যকে সফল করি।
        </p>

        <p className="text-gray-800 text-base leading-relaxed mb-6">
          এই উদ্যোগের পেছনে ও ওয়েব অ্যাপ্লিকেশনটি ডেভেলপ করেছেন — <br />
          <span className="text-xl font-extrabold  bg-gradient-to-r from-red-600 to-red-900 bg-clip-text text-transparent hover:text-red-800">
            <a href="https://www.facebook.com/gmreazahmed">জিএম রিয়াজ আহমেদ</a></span>, <br />
          <span className="text-xl font-extrabold  bg-gradient-to-r from-red-600 to-red-900 bg-clip-text text-transparent hover:text-red-800">
            <a href="https://www.facebook.com/nasif.rahman.980">নাসিফ উর রহমান</a></span>, <br />
          এবং সার্বিক সহযোগিতায় — <br />
          <span className="text-xl font-extrabold  bg-gradient-to-r from-red-600 to-red-900 bg-clip-text text-transparent hover:text-red-800">
            <a href="https://www.facebook.com/MirMaruf360">মীর মারুফ হোসেন</a></span>।
        </p>

        {/* যোগাযোগ */}
        <div className="border-t pt-6 mt-6 items-center text-center">
          <p className="text-red-500 text-base mb-3">
            *যদি কোনও ভুল তথ্য থাকে বা আপনার কোন পরামর্শ থাকে, অনুগ্রহ করে আমাদের পরামর্শ বক্সে জানান।*
          </p>
          
        </div>
      </div>
    </section>
  );
}
