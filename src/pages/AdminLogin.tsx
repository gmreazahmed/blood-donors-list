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
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Admin Login</h2>
      <input
        type="password"
        className="border p-2 rounded w-full"
        placeholder="Enter admin password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="bg-red-600 text-white px-4 py-2 mt-4 rounded hover:bg-red-700"
      >
        Login
      </button>

      {error && (
        <p className="text-red-600 mt-3 font-medium">{error}</p>
      )}
    </div>
  );
}
