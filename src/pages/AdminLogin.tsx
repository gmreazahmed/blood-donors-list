import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const plainPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (!plainPassword) {
      setError("⚠️ পাসওয়ার্ড লোড হয়নি");
      return;
    }

    if (password === plainPassword) {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin");
    } else {
      setError("❌ ভুল পাসওয়ার্ড");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100 px-4">

      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-red-600">
              🔐 Admin Login
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              শুধুমাত্র অনুমোদিত ব্যবহারকারীদের জন্য
            </p>
          </div>

          {/* Input */}
          <input
            type="password"
            placeholder="পাসওয়ার্ড লিখুন"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
          />

          {/* Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg mt-4 font-medium transition"
          >
            লগইন করুন
          </button>

          {/* Error */}
          {error && (
            <p className="mt-4 text-center text-red-600 text-sm">
              {error}
            </p>
          )}

        </div>

      </div>
    </section>
  );
}