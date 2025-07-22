export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center text-sm py-6 mt-10 border-t">
      <div className="max-w-5xl mx-auto px-4">
        <p className="text-gray-700">
          © {new Date().getFullYear()} Blood Donor Finder. All rights reserved.
        </p>
        <p className="text-gray-500 mt-1">
          Made with ❤️ in Kaliganj, Satkhira
        </p>
      </div>
    </footer>
  );
}
