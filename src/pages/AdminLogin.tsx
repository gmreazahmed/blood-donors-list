import { useState } from "react"; 
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const plainPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (!plainPassword) {
      setError("⚠️ .env ফাইল থেকে পাসওয়ার্ড লোড হয়নি।");
      return;
    }

    if (password === plainPassword) {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin");
    } else {
      setError("❌ ভুল পাসওয়ার্ড!");
    }
  };

  return (
    <div className="mt-20 flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Admin Login
        </h2>

        <input
          type="password"
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
          placeholder="Admin পাসওয়ার্ড লিখুন"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold mt-5 py-3 rounded-md shadow transition"
        >
          লগইন করুন
        </button>

        {error && (
          <p className="mt-4 text-center text-red-600 font-medium select-none">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
