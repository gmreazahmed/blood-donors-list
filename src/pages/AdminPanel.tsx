import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Check,
  Edit3,
  Heart,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import BloodRequestAdmin from "../components/BloodRequestAdmin";
import FooterCommentsAdmin from "../components/FooterCommentsAdmin";
import { areaData } from "../data/upazila-union";
import { db } from "../firebase/config";

interface Donor {
  id?: string;
  name: string;
  bloodGroup: string;
  phone: string;
  upazila: string;
  union: string;
  village: string;
}

type ActiveSection = "dashboard" | "donors" | "requests" | "comments";

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const emptyDonor: Donor = {
  name: "",
  bloodGroup: "",
  phone: "",
  upazila: "",
  union: "",
  village: "",
};

export default function AdminPanel() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Donor>>({});
  const [newDonor, setNewDonor] = useState<Donor>(emptyDonor);

  const [active, setActive] = useState<ActiveSection>("dashboard");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [mobileSidebar, setMobileSidebar] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (!isAdmin) {
      navigate("/admin-login", { replace: true });
      return;
    }

    fetchDonors();
  }, [navigate]);

  useEffect(() => {
    if (success || error) {
      const timer = window.setTimeout(() => {
        setSuccess("");
        setError("");
      }, 4500);

      return () => window.clearTimeout(timer);
    }
  }, [success, error]);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      setError("");

      const snap = await getDocs(collection(db, "donors"));

      const donorData = snap.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as Donor[];

      setDonors(donorData);
    } catch (err) {
      console.error(err);
      setError("ডোনার তালিকা লোড করা যায়নি। Firebase সংযোগ পরীক্ষা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const getUnions = (upazila: string) => areaData[upazila] || [];

  const normalizePhone = (phone: string) => phone.replace(/\s+/g, "");

  const isValidPhone = (phone: string) =>
    /^01[0-9]{9}$/.test(normalizePhone(phone));

  const handleAdd = async (event?: FormEvent) => {
    event?.preventDefault();

    setError("");
    setSuccess("");

    const donor = {
      ...newDonor,
      name: newDonor.name.trim(),
      phone: normalizePhone(newDonor.phone),
      village: newDonor.village.trim(),
    };

    if (
      !donor.name ||
      !donor.phone ||
      !donor.bloodGroup ||
      !donor.upazila ||
      !donor.union ||
      !donor.village
    ) {
      setError("ডোনারের সব তথ্য পূরণ করুন।");
      return;
    }

    if (!isValidPhone(donor.phone)) {
      setError("সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন।");
      return;
    }

    const duplicate = donors.some(
      (item) => normalizePhone(item.phone) === donor.phone,
    );

    if (duplicate) {
      setError("এই মোবাইল নম্বরের একজন ডোনার ইতোমধ্যে তালিকায় আছে।");
      return;
    }

    try {
      setSaving(true);

      await addDoc(collection(db, "donors"), donor);

      setNewDonor(emptyDonor);
      await fetchDonors();

      setSuccess("নতুন ডোনার সফলভাবে যোগ হয়েছে।");
    } catch (err) {
      console.error(err);
      setError("ডোনার যোগ করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (donor: Donor) => {
    setError("");
    setSuccess("");
    setEditingId(donor.id || null);
    setEditData({ ...donor });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    setError("");
    setSuccess("");

    const updatedDonor = {
      name: String(editData.name || "").trim(),
      bloodGroup: String(editData.bloodGroup || ""),
      phone: normalizePhone(String(editData.phone || "")),
      upazila: String(editData.upazila || ""),
      union: String(editData.union || ""),
      village: String(editData.village || "").trim(),
    };

    if (
      !updatedDonor.name ||
      !updatedDonor.phone ||
      !updatedDonor.bloodGroup ||
      !updatedDonor.upazila ||
      !updatedDonor.union ||
      !updatedDonor.village
    ) {
      setError("ডোনারের সব তথ্য পূরণ করুন।");
      return;
    }

    if (!isValidPhone(updatedDonor.phone)) {
      setError("সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন।");
      return;
    }

    const duplicate = donors.some(
      (item) =>
        item.id !== editingId &&
        normalizePhone(item.phone) === updatedDonor.phone,
    );

    if (duplicate) {
      setError("এই মোবাইল নম্বরটি অন্য একজন ডোনারের সাথে যুক্ত।");
      return;
    }

    try {
      setSaving(true);

      await updateDoc(doc(db, "donors", editingId), updatedDonor);

      cancelEdit();
      await fetchDonors();

      setSuccess("ডোনারের তথ্য আপডেট হয়েছে।");
    } catch (err) {
      console.error(err);
      setError("ডোনারের তথ্য আপডেট করা যায়নি।");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const donor = donors.find((item) => item.id === id);

    if (!donor) return;

    const confirmed = window.confirm(
      `"${donor.name}"-কে ডোনার তালিকা থেকে মুছে ফেলতে চান?`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await deleteDoc(doc(db, "donors", id));

      if (editingId === id) {
        cancelEdit();
      }

      await fetchDonors();

      setSuccess("ডোনার সফলভাবে মুছে ফেলা হয়েছে।");
    } catch (err) {
      console.error(err);
      setError("ডোনার মুছে ফেলা যায়নি।");
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin-login", { replace: true });
  };

  const filteredDonors = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return donors;

    return donors.filter((donor) => {
      return (
        donor.name.toLowerCase().includes(query) ||
        donor.phone.toLowerCase().includes(query) ||
        donor.bloodGroup.toLowerCase().includes(query) ||
        donor.upazila.toLowerCase().includes(query) ||
        donor.union.toLowerCase().includes(query) ||
        donor.village.toLowerCase().includes(query)
      );
    });
  }, [donors, searchTerm]);

  const stats = useMemo(() => {
    const groups = bloodGroups.reduce<Record<string, number>>(
      (result, group) => {
        result[group] = donors.filter(
          (donor) => donor.bloodGroup === group,
        ).length;

        return result;
      },
      {},
    );

    return {
      total: donors.length,
      groups,
    };
  }, [donors]);

  const changeSection = (section: ActiveSection) => {
    setActive(section);
    setMobileSidebar(false);
    cancelEdit();
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-100";

  const menuItems: {
    id: ActiveSection;
    label: string;
    icon: typeof Users;
  }[] = [
    {
      id: "dashboard",
      label: "ড্যাশবোর্ড",
      icon: LayoutDashboard,
    },
    {
      id: "donors",
      label: "ডোনার",
      icon: Users,
    },
    {
      id: "requests",
      label: "রক্তের অনুরোধ",
      icon: Heart,
    },
    {
      id: "comments",
      label: "মন্তব্য",
      icon: MessageSquare,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Panel | RoktoData</title>

        <meta
          name="description"
          content="RoktoData প্রশাসনিক প্যানেল। ডোনার, রক্তের অনুরোধ এবং মন্তব্য ব্যবস্থাপনা।"
        />

        <meta name="robots" content="noindex, nofollow" />

        <link
          rel="canonical"
          href="https://roktodata.vercel.app/admin"
        />
      </Helmet>

      <div className="min-h-screen bg-slate-50 text-slate-800">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur lg:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <button
              type="button"
              onClick={() => setMobileSidebar(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-red-100"
              aria-label="অ্যাডমিন মেনু খুলুন"
            >
              <span className="text-xl">☰</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Heart className="h-5 w-5 fill-current" />
              </div>

              <span className="font-extrabold text-slate-900">
                RoktoData
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-4 focus:ring-red-100"
              aria-label="লগআউট"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Mobile overlay */}
        {mobileSidebar && (
          <button
            type="button"
            aria-label="মেনু বন্ধ করুন"
            onClick={() => setMobileSidebar(false)}
            className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 lg:translate-x-0 lg:shadow-none ${
            mobileSidebar ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-20 items-center justify-between border-b border-slate-100 px-5">
            <Link
              to="/"
              className="flex items-center gap-3"
              onClick={() => setMobileSidebar(false)}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/20">
                <Heart className="h-6 w-6 fill-current" />
              </div>

              <div>
                <p className="text-lg font-extrabold text-slate-900">
                  RoktoData
                </p>

                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Admin Panel
                </p>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setMobileSidebar(false)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 lg:hidden"
              aria-label="মেনু বন্ধ করুন"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="mb-3 px-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Management
            </div>

            <nav className="space-y-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => changeSection(item.id)}
                    className={`group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-bold transition ${
                      isActive
                        ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                        : "text-slate-600 hover:bg-red-50 hover:text-red-700"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-red-600"
                      }`}
                    />

                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-slate-100 p-4">
            <div className="mb-3 rounded-2xl bg-slate-50 p-3.5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                <ShieldCheck className="h-4 w-4" />
                Admin session active
              </div>

              <p className="mt-1 text-[11px] leading-5 text-slate-400">
                অনুমোদিত প্রশাসনিক ব্যবহারের জন্য।
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-100"
            >
              <LogOut className="h-4 w-4" />
              লগআউট
            </button>
          </div>
        </aside>

        {/* Main area */}
        <main className="min-h-screen lg:pl-[280px]">
          <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {/* Desktop header */}
            <div className="mb-7 hidden items-center justify-between lg:flex">
              <div>
                <p className="mb-1 text-sm font-semibold text-red-600">
                  RoktoData Administration
                </p>

                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  {active === "dashboard" && "ড্যাশবোর্ড"}
                  {active === "donors" && "ডোনার ম্যানেজমেন্ট"}
                  {active === "requests" && "রক্তের অনুরোধ"}
                  {active === "comments" && "মন্তব্য ব্যবস্থাপনা"}
                </h1>
              </div>

              <Link
                to="/"
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-red-200 hover:text-red-600"
              >
                সাইট দেখুন
              </Link>
            </div>

            {/* Mobile heading */}
            <div className="mb-6 lg:hidden">
              <p className="text-xs font-bold uppercase tracking-wider text-red-600">
                RoktoData Admin
              </p>

              <h1 className="mt-1 text-2xl font-extrabold text-slate-900">
                {active === "dashboard" && "ড্যাশবোর্ড"}
                {active === "donors" && "ডোনার ম্যানেজমেন্ট"}
                {active === "requests" && "রক্তের অনুরোধ"}
                {active === "comments" && "মন্তব্য ব্যবস্থাপনা"}
              </h1>
            </div>

            {/* Alerts */}
            {(success || error) && (
              <div
                role="status"
                className={`mb-6 flex items-start gap-3 rounded-2xl border px-4 py-3.5 ${
                  success
                    ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                    : "border-red-100 bg-red-50 text-red-700"
                }`}
              >
                {success ? (
                  <Check className="mt-0.5 h-5 w-5 shrink-0" />
                ) : (
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                )}

                <span className="text-sm font-semibold">
                  {success || error}
                </span>
              </div>
            )}

            {/* Dashboard */}
            {active === "dashboard" && (
              <section>
                <div className="mb-6 rounded-3xl bg-gradient-to-br from-red-700 via-red-600 to-red-500 p-6 text-white shadow-xl shadow-red-600/15 sm:p-8">
                  <div className="max-w-2xl">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                      <Heart className="h-6 w-6 fill-current" />
                    </div>

                    <h2 className="text-2xl font-extrabold sm:text-3xl">
                      RoktoData Admin Dashboard
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-red-100 sm:text-base">
                      কালীগঞ্জের রক্তদাতা, রক্তের অনুরোধ এবং সাইটের
                      মন্তব্যগুলো এখান থেকে পরিচালনা করুন।
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard
                    label="মোট ডোনার"
                    value={stats.total}
                    icon={Users}
                    onClick={() => changeSection("donors")}
                  />

                  {bloodGroups.slice(0, 3).map((group) => (
                    <StatCard
                      key={group}
                      label={`${group} ডোনার`}
                      value={stats.groups[group] || 0}
                      icon={Heart}
                      onClick={() => {
                        setSearchTerm(group);
                        changeSection("donors");
                      }}
                    />
                  ))}
                </div>

                <div className="mt-6 grid gap-6 xl:grid-cols-2">
                  <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <h3 className="font-extrabold text-slate-900">
                          রক্তের গ্রুপ
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                          বর্তমান ডোনার সংখ্যা
                        </p>
                      </div>

                      <Heart className="h-5 w-5 text-red-500" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {bloodGroups.map((group) => (
                        <button
                          key={group}
                          type="button"
                          onClick={() => {
                            setSearchTerm(group);
                            changeSection("donors");
                          }}
                          className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left transition hover:border-red-100 hover:bg-red-50"
                        >
                          <div className="text-lg font-extrabold text-red-600">
                            {group}
                          </div>

                          <div className="mt-1 text-xs font-semibold text-slate-500">
                            {stats.groups[group] || 0} জন
                          </div>
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <ShieldCheck className="h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="font-extrabold text-slate-900">
                          প্রশাসনিক নোট
                        </h3>

                        <p className="text-xs text-slate-400">
                          RoktoData management
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm leading-6 text-slate-600">
                      <p>
                        ডোনারের ব্যক্তিগত তথ্য শুধুমাত্র প্রয়োজনীয়
                        প্রশাসনিক কাজে ব্যবহার করুন।
                      </p>

                      <p>
                        ডোনার মুছে ফেলা বা তথ্য পরিবর্তনের আগে তথ্যটি
                        যাচাই করে নিন।
                      </p>

                      <p className="font-semibold text-red-600">
                        Firebase Security Rules অবশ্যই সঠিকভাবে কনফিগার করা
                        থাকা উচিত।
                      </p>
                    </div>
                  </section>
                </div>
              </section>
            )}

            {/* Donors */}
            {active === "donors" && (
              <section>
                {/* Add donor */}
                <div className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                        <UserPlus className="h-5 w-5" />
                      </div>

                      <div>
                        <h2 className="font-extrabold text-slate-900">
                          নতুন ডোনার যোগ করুন
                        </h2>

                        <p className="text-xs text-slate-400">
                          ডোনারের তথ্য সঠিকভাবে পূরণ করুন
                        </p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleAdd} className="p-5 sm:p-6">
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      <Field label="নাম">
                        <input
                          className={inputClass}
                          placeholder="ডোনারের নাম"
                          value={newDonor.name}
                          onChange={(event) =>
                            setNewDonor({
                              ...newDonor,
                              name: event.target.value,
                            })
                          }
                        />
                      </Field>

                      <Field label="মোবাইল নম্বর">
                        <input
                          className={inputClass}
                          type="tel"
                          inputMode="numeric"
                          placeholder="01XXXXXXXXX"
                          value={newDonor.phone}
                          onChange={(event) =>
                            setNewDonor({
                              ...newDonor,
                              phone: event.target.value,
                            })
                          }
                        />
                      </Field>

                      <Field label="রক্তের গ্রুপ">
                        <select
                          className={inputClass}
                          value={newDonor.bloodGroup}
                          onChange={(event) =>
                            setNewDonor({
                              ...newDonor,
                              bloodGroup: event.target.value,
                            })
                          }
                        >
                          <option value="">রক্তের গ্রুপ নির্বাচন করুন</option>
                          {bloodGroups.map((group) => (
                            <option key={group} value={group}>
                              {group}
                            </option>
                          ))}
                        </select>
                      </Field>

                      <Field label="উপজেলা">
                        <select
                          className={inputClass}
                          value={newDonor.upazila}
                          onChange={(event) =>
                            setNewDonor({
                              ...newDonor,
                              upazila: event.target.value,
                              union: "",
                            })
                          }
                        >
                          <option value="">উপজেলা নির্বাচন করুন</option>

                          {Object.keys(areaData).map((upazila) => (
                            <option key={upazila} value={upazila}>
                              {upazila}
                            </option>
                          ))}
                        </select>
                      </Field>

                      <Field label="ইউনিয়ন">
                        <select
                          className={inputClass}
                          value={newDonor.union}
                          disabled={!newDonor.upazila}
                          onChange={(event) =>
                            setNewDonor({
                              ...newDonor,
                              union: event.target.value,
                            })
                          }
                        >
                          <option value="">ইউনিয়ন নির্বাচন করুন</option>

                          {getUnions(newDonor.upazila).map((union) => (
                            <option key={union} value={union}>
                              {union}
                            </option>
                          ))}
                        </select>
                      </Field>

                      <Field label="গ্রাম / এলাকা">
                        <input
                          className={inputClass}
                          placeholder="গ্রাম বা এলাকার নাম"
                          value={newDonor.village}
                          onChange={(event) =>
                            setNewDonor({
                              ...newDonor,
                              village: event.target.value,
                            })
                          }
                        />
                      </Field>
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/15 transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          সংরক্ষণ হচ্ছে...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          ডোনার যোগ করুন
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Search */}
                <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="নাম, ফোন, রক্তের গ্রুপ, ইউনিয়ন বা গ্রাম দিয়ে খুঁজুন..."
                      className="w-full rounded-xl border border-transparent bg-slate-50 py-3.5 pl-12 pr-12 text-sm outline-none transition focus:border-red-200 focus:bg-white focus:ring-4 focus:ring-red-50"
                    />

                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => setSearchTerm("")}
                        className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        aria-label="সার্চ পরিষ্কার করুন"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Donor table */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                      <h2 className="font-extrabold text-slate-900">
                        ডোনার তালিকা
                      </h2>

                      <p className="mt-1 text-xs text-slate-400">
                        {searchTerm
                          ? `${filteredDonors.length} জন পাওয়া গেছে`
                          : `মোট ${donors.length} জন ডোনার`}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={fetchDonors}
                      disabled={loading}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-600 transition hover:border-red-200 hover:text-red-600 disabled:opacity-50"
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                      />
                      রিফ্রেশ
                    </button>
                  </div>

                  {loading ? (
                    <DonorTableSkeleton />
                  ) : filteredDonors.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <Users className="h-6 w-6" />
                      </div>

                      <h3 className="mt-4 font-bold text-slate-800">
                        কোনো ডোনার পাওয়া যায়নি
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        {searchTerm
                          ? "অন্য কোনো নাম, ফোন বা রক্তের গ্রুপ দিয়ে চেষ্টা করুন।"
                          : "এখনও কোনো ডোনার যোগ করা হয়নি।"}
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Desktop table */}
                      <div className="hidden overflow-x-auto lg:block">
                        <table className="w-full min-w-[950px] text-left text-sm">
                          <thead className="bg-slate-50 text-xs font-extrabold uppercase tracking-wide text-slate-500">
                            <tr>
                              <th className="px-5 py-4">ডোনার</th>
                              <th className="px-5 py-4">রক্ত</th>
                              <th className="px-5 py-4">ফোন</th>
                              <th className="px-5 py-4">উপজেলা</th>
                              <th className="px-5 py-4">ইউনিয়ন</th>
                              <th className="px-5 py-4">গ্রাম / এলাকা</th>
                              <th className="px-5 py-4 text-right">
                                অ্যাকশন
                              </th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-slate-100">
                            {filteredDonors.map((donor) => (
                              <DonorTableRow
                                key={donor.id}
                                donor={donor}
                                editingId={editingId}
                                editData={editData}
                                setEditData={setEditData}
                                getUnions={getUnions}
                                inputClass={inputClass}
                                saving={saving}
                                deletingId={deletingId}
                                onEdit={handleEdit}
                                onSave={handleUpdate}
                                onCancel={cancelEdit}
                                onDelete={handleDelete}
                              />
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile cards */}
                      <div className="divide-y divide-slate-100 lg:hidden">
                        {filteredDonors.map((donor) => (
                          <MobileDonorCard
                            key={donor.id}
                            donor={donor}
                            editingId={editingId}
                            editData={editData}
                            setEditData={setEditData}
                            getUnions={getUnions}
                            inputClass={inputClass}
                            saving={saving}
                            deletingId={deletingId}
                            onEdit={handleEdit}
                            onSave={handleUpdate}
                            onCancel={cancelEdit}
                            onDelete={handleDelete}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {!loading && filteredDonors.length > 0 && (
                    <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-3 text-xs font-semibold text-slate-500">
                      মোট প্রদর্শিত: {filteredDonors.length} জন
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Requests */}
            {active === "requests" && (
              <section>
                <BloodRequestAdmin />
              </section>
            )}

            {/* Comments */}
            {active === "comments" && (
              <section>
                <FooterCommentsAdmin />
              </section>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Helper components                                                           */
/* -------------------------------------------------------------------------- */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-slate-600">
        {label}
      </span>

      {children}
    </label>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  onClick,
}: {
  label: string;
  value: number;
  icon: typeof Users;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-red-100 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600 transition group-hover:bg-red-600 group-hover:text-white">
          <Icon className="h-5 w-5" />
        </div>

        <span className="text-xs font-bold text-slate-400">
          View
        </span>
      </div>

      <div className="mt-5">
        <p className="text-3xl font-extrabold tracking-tight text-slate-900">
          {value}
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-500">
          {label}
        </p>
      </div>
    </button>
  );
}

function DonorTableSkeleton() {
  return (
    <div className="space-y-0">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 border-b border-slate-100 px-5 py-5"
        >
          <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />

          <div className="flex-1 space-y-2">
            <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
            <div className="h-2.5 w-24 animate-pulse rounded bg-slate-100" />
          </div>

          <div className="hidden h-8 w-16 animate-pulse rounded-xl bg-slate-100 sm:block" />
          <div className="hidden h-8 w-24 animate-pulse rounded-xl bg-slate-100 md:block" />
          <div className="h-8 w-20 animate-pulse rounded-xl bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

function DonorTableRow({
  donor,
  editingId,
  editData,
  setEditData,
  getUnions,
  inputClass,
  saving,
  deletingId,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: {
  donor: Donor;
  editingId: string | null;
  editData: Partial<Donor>;
  setEditData: React.Dispatch<React.SetStateAction<Partial<Donor>>>;
  getUnions: (upazila: string) => string[];
  inputClass: string;
  saving: boolean;
  deletingId: string | null;
  onEdit: (donor: Donor) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
}) {
  const isEditing = editingId === donor.id;

  if (isEditing) {
    return (
      <tr className="bg-red-50/30 align-top">
        <td className="px-4 py-4">
          <input
            className={inputClass}
            value={editData.name || ""}
            onChange={(event) =>
              setEditData({
                ...editData,
                name: event.target.value,
              })
            }
          />
        </td>

        <td className="px-4 py-4">
          <select
            className={inputClass}
            value={editData.bloodGroup || ""}
            onChange={(event) =>
              setEditData({
                ...editData,
                bloodGroup: event.target.value,
              })
            }
          >
            {bloodGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </td>

        <td className="px-4 py-4">
          <input
            className={inputClass}
            value={editData.phone || ""}
            onChange={(event) =>
              setEditData({
                ...editData,
                phone: event.target.value,
              })
            }
          />
        </td>

        <td className="px-4 py-4">
          <select
            className={inputClass}
            value={editData.upazila || ""}
            onChange={(event) =>
              setEditData({
                ...editData,
                upazila: event.target.value,
                union: "",
              })
            }
          >
            {Object.keys(areaData).map((upazila) => (
              <option key={upazila} value={upazila}>
                {upazila}
              </option>
            ))}
          </select>
        </td>

        <td className="px-4 py-4">
          <select
            className={inputClass}
            value={editData.union || ""}
            onChange={(event) =>
              setEditData({
                ...editData,
                union: event.target.value,
              })
            }
          >
            <option value="">ইউনিয়ন</option>

            {getUnions(editData.upazila || "").map((union) => (
              <option key={union} value={union}>
                {union}
              </option>
            ))}
          </select>
        </td>

        <td className="px-4 py-4">
          <input
            className={inputClass}
            value={editData.village || ""}
            onChange={(event) =>
              setEditData({
                ...editData,
                village: event.target.value,
              })
            }
          />
        </td>

        <td className="px-4 py-4">
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              <Check className="h-3.5 w-3.5" />
              Save
            </button>

            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-300 disabled:opacity-50"
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="transition hover:bg-slate-50/80">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-sm font-extrabold text-red-600">
            {donor.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="font-bold text-slate-800">{donor.name}</p>
            <p className="mt-0.5 text-xs text-slate-400">
              Donor ID: {donor.id?.slice(0, 7)}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <span className="inline-flex min-w-11 justify-center rounded-xl bg-red-50 px-2.5 py-1.5 text-xs font-extrabold text-red-600">
          {donor.bloodGroup}
        </span>
      </td>

      <td className="px-5 py-4 font-medium text-slate-600">
        {donor.phone}
      </td>

      <td className="px-5 py-4 text-slate-600">{donor.upazila}</td>
      <td className="px-5 py-4 text-slate-600">{donor.union}</td>
      <td className="px-5 py-4 text-slate-600">{donor.village}</td>

      <td className="px-5 py-4">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onEdit(donor)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit
          </button>

          <button
            type="button"
            onClick={() => donor.id && onDelete(donor.id)}
            disabled={deletingId === donor.id}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
          >
            {deletingId === donor.id ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

function MobileDonorCard({
  donor,
  editingId,
  editData,
  setEditData,
  getUnions,
  inputClass,
  saving,
  deletingId,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: {
  donor: Donor;
  editingId: string | null;
  editData: Partial<Donor>;
  setEditData: React.Dispatch<React.SetStateAction<Partial<Donor>>>;
  getUnions: (upazila: string) => string[];
  inputClass: string;
  saving: boolean;
  deletingId: string | null;
  onEdit: (donor: Donor) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
}) {
  const isEditing = editingId === donor.id;

  if (isEditing) {
    return (
      <div className="space-y-4 bg-red-50/30 p-5">
        <Field label="নাম">
          <input
            className={inputClass}
            value={editData.name || ""}
            onChange={(event) =>
              setEditData({
                ...editData,
                name: event.target.value,
              })
            }
          />
        </Field>

        <Field label="রক্তের গ্রুপ">
          <select
            className={inputClass}
            value={editData.bloodGroup || ""}
            onChange={(event) =>
              setEditData({
                ...editData,
                bloodGroup: event.target.value,
              })
            }
          >
            {bloodGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </Field>

        <Field label="মোবাইল নম্বর">
          <input
            className={inputClass}
            value={editData.phone || ""}
            onChange={(event) =>
              setEditData({
                ...editData,
                phone: event.target.value,
              })
            }
          />
        </Field>

        <Field label="উপজেলা">
          <select
            className={inputClass}
            value={editData.upazila || ""}
            onChange={(event) =>
              setEditData({
                ...editData,
                upazila: event.target.value,
                union: "",
              })
            }
          >
            {Object.keys(areaData).map((upazila) => (
              <option key={upazila} value={upazila}>
                {upazila}
              </option>
            ))}
          </select>
        </Field>

        <Field label="ইউনিয়ন">
          <select
            className={inputClass}
            value={editData.union || ""}
            onChange={(event) =>
              setEditData({
                ...editData,
                union: event.target.value,
              })
            }
          >
            <option value="">ইউনিয়ন</option>

            {getUnions(editData.upazila || "").map((union) => (
              <option key={union} value={union}>
                {union}
              </option>
            ))}
          </select>
        </Field>

        <Field label="গ্রাম / এলাকা">
          <input
            className={inputClass}
            value={editData.village || ""}
            onChange={(event) =>
              setEditData({
                ...editData,
                village: event.target.value,
              })
            }
          />
        </Field>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            Save
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-200 px-4 py-3 text-sm font-bold text-slate-700 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <article className="p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 font-extrabold text-red-600">
          {donor.name.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900">
                {donor.name}
              </h3>

              <p className="mt-0.5 text-xs text-slate-400">
                {donor.phone}
              </p>
            </div>

            <span className="shrink-0 rounded-xl bg-red-50 px-3 py-1.5 text-sm font-extrabold text-red-600">
              {donor.bloodGroup}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <InfoItem label="উপজেলা" value={donor.upazila} />
            <InfoItem label="ইউনিয়ন" value={donor.union} />
            <InfoItem label="গ্রাম / এলাকা" value={donor.village} />
            <InfoItem
              label="ID"
              value={donor.id?.slice(0, 8) || "—"}
            />
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => onEdit(donor)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700"
            >
              <Edit3 className="h-4 w-4" />
              Edit
            </button>

            <button
              type="button"
              onClick={() => donor.id && onDelete(donor.id)}
              disabled={deletingId === donor.id}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 disabled:opacity-50"
            >
              {deletingId === donor.id ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2.5">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-0.5 truncate font-semibold text-slate-700">
        {value || "—"}
      </p>
    </div>
  );
}