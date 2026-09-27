import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Heart,
  LockKeyhole,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("isAdmin") === "true") {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const handleLogin = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    setError("");

    const plainPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (!plainPassword) {
      setError("অ্যাডমিন পাসওয়ার্ড কনফিগার করা হয়নি।");
      return;
    }

    if (!password.trim()) {
      setError("পাসওয়ার্ড লিখুন।");
      return;
    }

    setIsLoading(true);

    // Keep the existing frontend login flow.
    if (password === plainPassword) {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin", { replace: true });
      return;
    }

    setIsLoading(false);
    setError("পাসওয়ার্ড সঠিক নয়। আবার চেষ্টা করুন।");
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | RoktoData</title>

        <meta
          name="description"
          content="RoktoData admin login — অনুমোদিত ব্যবহারকারীদের জন্য প্রশাসনিক প্রবেশাধিকার।"
        />

        <meta name="robots" content="noindex, nofollow" />

        <link
          rel="canonical"
          href="https://roktodata.vercel.app/admin-login"
        />
      </Helmet>

      <main className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 sm:px-6 lg:py-16">
        {/* Background decoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-red-100/70 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-red-100/60 blur-3xl" />

          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-100/60" />
          <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-100/40" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Back link */}
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-red-700 focus:outline-none focus:ring-4 focus:ring-red-100"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>মূল পাতায় ফিরে যান</span>
          </Link>

          {/* Login card */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.10)]">
            {/* Top accent */}
            <div className="h-1.5 bg-gradient-to-r from-red-700 via-red-600 to-red-500" />

            <div className="p-6 sm:p-8">
              {/* Logo */}
              <div className="mb-7 flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-8 ring-red-50/70">
                  <LockKeyhole className="h-7 w-7" />
                </div>

                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 fill-red-600 text-red-600" />

                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                    Admin Login
                  </h1>
                </div>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  RoktoData-এর প্রশাসনিক প্যানেলে প্রবেশের জন্য অনুমোদিত
                  ব্যবহারকারীদের পাসওয়ার্ড প্রয়োজন।
                </p>
              </div>

              {/* Security notice */}
              <div className="mb-6 flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                <div>
                  <p className="text-sm font-bold text-emerald-800">
                    নিরাপদ প্রশাসনিক প্রবেশ
                  </p>

                  <p className="mt-1 text-xs leading-5 text-emerald-700">
                    এই পেজটি শুধুমাত্র অনুমোদিত ব্যবহারের জন্য।
                  </p>
                </div>
              </div>

              <form onSubmit={handleLogin} noValidate>
                {/* Password */}
                <div>
                  <label
                    htmlFor="admin-password"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    অ্যাডমিন পাসওয়ার্ড
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        if (error) setError("");
                      }}
                      placeholder="পাসওয়ার্ড লিখুন"
                      autoComplete="current-password"
                      autoFocus
                      disabled={isLoading}
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? "admin-login-error" : undefined}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      disabled={isLoading}
                      aria-label={
                        showPassword
                          ? "পাসওয়ার্ড লুকান"
                          : "পাসওয়ার্ড দেখান"
                      }
                      className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:opacity-50"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div
                    id="admin-login-error"
                    role="alert"
                    className="mt-4 flex items-start gap-2.5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />

                    <span>{error}</span>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition duration-200 hover:bg-red-700 hover:shadow-red-600/30 focus:outline-none focus:ring-4 focus:ring-red-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <span
                        aria-hidden="true"
                        className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                      />
                      যাচাই করা হচ্ছে...
                    </>
                  ) : (
                    <>
                      <LockKeyhole className="h-4 w-4" />
                      লগইন করুন
                    </>
                  )}
                </button>
              </form>

              {/* Footer note */}
              <div className="mt-6 border-t border-slate-100 pt-5 text-center">
                <p className="text-xs leading-5 text-slate-400">
                  অনুমতি ছাড়া প্রশাসনিক প্যানেলে প্রবেশের চেষ্টা করবেন না।
                </p>
              </div>
            </div>
          </div>

          {/* Brand */}
          <p className="mt-6 text-center text-xs font-medium text-slate-400">
            © {new Date().getFullYear()} RoktoData
          </p>
        </div>
      </main>
    </>
  );
}