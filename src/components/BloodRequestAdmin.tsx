import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  AlertCircle,
  Check,
  Clock3,
  Edit3,
  Heart,
  MapPin,
  Phone,
  RefreshCw,
  Save,
  Trash2,
  User,
  X,
} from "lucide-react";
import { db } from "../firebase/config";

interface BloodRequest {
  id: string;
  name: string;
  phone: string;
  bloodGroup: string;
  hospital: string;
  reason: string;
  fulfilled: boolean;
  createdAt?: Timestamp;
}

type EditForm = Omit<BloodRequest, "id" | "createdAt">;

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const emptyForm: EditForm = {
  name: "",
  phone: "",
  bloodGroup: "",
  hospital: "",
  reason: "",
  fulfilled: false,
};

export default function BloodRequestAdmin() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const q = query(
        collection(db, "bloodRequests"),
        orderBy("createdAt", "desc"),
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((item) => {
        const raw = item.data();

        return {
          id: item.id,
          name: String(raw.name ?? ""),
          phone: String(raw.phone ?? ""),
          bloodGroup: String(raw.bloodGroup ?? ""),
          hospital: String(raw.hospital ?? ""),
          reason: String(raw.reason ?? ""),
          fulfilled: Boolean(raw.fulfilled),
          createdAt: raw.createdAt as Timestamp | undefined,
        };
      });

      setRequests(data);
    } catch (err) {
      console.error(err);
      setError(
        "রক্তের অনুরোধগুলো লোড করা যায়নি। Firebase সংযোগ বা Firestore index পরীক্ষা করুন।",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    if (!success && !error) return;

    const timer = window.setTimeout(() => {
      setSuccess("");
      setError("");
    }, 4500);

    return () => window.clearTimeout(timer);
  }, [success, error]);

  const stats = useMemo(() => {
    const fulfilled = requests.filter((request) => request.fulfilled).length;

    return {
      total: requests.length,
      pending: requests.length - fulfilled,
      fulfilled,
    };
  }, [requests]);

  const handleEditClick = (request: BloodRequest) => {
    setError("");
    setSuccess("");

    setEditingId(request.id);

    setEditForm({
      name: request.name,
      phone: request.phone,
      bloodGroup: request.bloodGroup,
      hospital: request.hospital,
      reason: request.reason,
      fulfilled: request.fulfilled,
    });
  };

  const handleEditChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = event.target;

    if (type === "checkbox") {
      const checked = (event.target as HTMLInputElement).checked;

      setEditForm((previous) => ({
        ...previous,
        [name]: checked,
      }));

      return;
    }

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const name = editForm.name.trim();
    const phone = editForm.phone.replace(/\s+/g, "");
    const hospital = editForm.hospital.trim();

    if (!name || !phone || !editForm.bloodGroup || !hospital) {
      setError("নাম, ফোন, রক্তের গ্রুপ এবং হাসপাতালের তথ্য প্রয়োজন।");
      return false;
    }

    if (!/^01[0-9]{9}$/.test(phone)) {
      setError("সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন।");
      return false;
    }

    return true;
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    setError("");
    setSuccess("");

    if (!validateForm()) return;

    const updatedData = {
      name: editForm.name.trim(),
      phone: editForm.phone.replace(/\s+/g, ""),
      bloodGroup: editForm.bloodGroup,
      hospital: editForm.hospital.trim(),
      reason: editForm.reason.trim(),
      fulfilled: editForm.fulfilled,
    };

    try {
      setSaving(true);

      await updateDoc(
        doc(db, "bloodRequests", editingId),
        updatedData,
      );

      setEditingId(null);
      setEditForm(emptyForm);

      await fetchRequests();

      setSuccess("রক্তের অনুরোধ সফলভাবে আপডেট হয়েছে।");
    } catch (err) {
      console.error(err);
      setError("অনুরোধ আপডেট করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const request = requests.find((item) => item.id === id);

    if (!request) return;

    const confirmed = window.confirm(
      `"${request.name}"-এর রক্তের অনুরোধটি মুছে ফেলতে চান?`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await deleteDoc(doc(db, "bloodRequests", id));

      if (editingId === id) {
        setEditingId(null);
        setEditForm(emptyForm);
      }

      await fetchRequests();

      setSuccess("রক্তের অনুরোধ সফলভাবে মুছে ফেলা হয়েছে।");
    } catch (err) {
      console.error(err);
      setError("অনুরোধটি মুছে ফেলা যায়নি।");
    } finally {
      setDeletingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(emptyForm);
  };

  const formatDate = (timestamp?: Timestamp) => {
    if (!timestamp) return "তারিখ পাওয়া যায়নি";

    try {
      return timestamp.toDate().toLocaleString("bn-BD", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return "তারিখ পাওয়া যায়নি";
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-100";

  return (
    <>
      <Helmet>
        <title>Blood Request Admin | RoktoData</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <section className="space-y-6">
        {/* Header */}
        <div className="rounded-3xl bg-gradient-to-br from-red-700 via-red-600 to-red-500 p-5 text-white shadow-xl shadow-red-600/15 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                <Heart className="h-6 w-6 fill-current" />
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                রক্তের অনুরোধ
              </h2>

              <p className="mt-1.5 max-w-xl text-sm leading-6 text-red-100">
                ব্যবহারকারীদের পাঠানো রক্তের অনুরোধগুলো এখান থেকে
                পর্যালোচনা ও পরিচালনা করুন।
              </p>
            </div>

            <button
              type="button"
              onClick={fetchRequests}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/20 disabled:opacity-60 sm:self-auto"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              রিফ্রেশ
            </button>
          </div>
        </div>

        {/* Alerts */}
        {(success || error) && (
          <div
            role="status"
            className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 ${
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

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat
            label="মোট অনুরোধ"
            value={stats.total}
            icon={Heart}
          />

          <Stat
            label="অপেক্ষমাণ"
            value={stats.pending}
            icon={Clock3}
          />

          <Stat
            label="সম্পন্ন"
            value={stats.fulfilled}
            icon={Check}
          />
        </div>

        {/* Loading */}
        {loading ? (
          <LoadingState />
        ) : requests.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {requests.map((request) =>
              editingId === request.id ? (
                <EditRequestCard
                  key={request.id}
                  form={editForm}
                  inputClass={inputClass}
                  saving={saving}
                  onChange={handleEditChange}
                  onSave={handleUpdate}
                  onCancel={cancelEdit}
                />
              ) : (
                <RequestCard
                  key={request.id}
                  request={request}
                  deleting={deletingId === request.id}
                  formatDate={formatDate}
                  onEdit={() => handleEditClick(request)}
                  onDelete={() => handleDelete(request.id)}
                />
              ),
            )}
          </div>
        )}
      </section>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Stats                                                                       */
/* -------------------------------------------------------------------------- */

function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Heart;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
          <Icon className="h-5 w-5" />
        </div>

        <span className="text-2xl font-extrabold text-slate-900">
          {value}
        </span>
      </div>

      <p className="mt-4 text-sm font-bold text-slate-500">{label}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Request Card                                                                */
/* -------------------------------------------------------------------------- */

function RequestCard({
  request,
  deleting,
  formatDate,
  onEdit,
  onDelete,
}: {
  request: BloodRequest;
  deleting: boolean;
  formatDate: (timestamp?: Timestamp) => string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Status strip */}
      <div
        className={`h-1.5 ${
          request.fulfilled ? "bg-emerald-500" : "bg-amber-500"
        }`}
      />

      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          {/* Main info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <User className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {request.name}
                  </h3>

                  <span className="rounded-xl bg-red-50 px-3 py-1 text-xs font-extrabold text-red-600">
                    {request.bloodGroup || "N/A"}
                  </span>

                  <span
                    className={`rounded-xl px-3 py-1 text-xs font-bold ${
                      request.fulfilled
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {request.fulfilled ? "সম্পন্ন" : "অপেক্ষমাণ"}
                  </span>
                </div>

                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock3 className="h-3.5 w-3.5" />
                  {formatDate(request.createdAt)}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <InfoRow
                icon={Phone}
                label="যোগাযোগ"
                value={request.phone}
              />

              <InfoRow
                icon={MapPin}
                label="হাসপাতাল"
                value={request.hospital}
              />
            </div>

            {request.reason && (
              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <p className="mb-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  অনুরোধের কারণ
                </p>

                <p className="text-sm leading-6 text-slate-700">
                  {request.reason}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex shrink-0 gap-2 xl:flex-col">
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 xl:min-w-[110px]"
            >
              <Edit3 className="h-4 w-4" />
              Edit
            </button>

            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 xl:min-w-[110px]"
            >
              {deleting ? (
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

/* -------------------------------------------------------------------------- */
/* Edit Card                                                                   */
/* -------------------------------------------------------------------------- */

function EditRequestCard({
  form,
  inputClass,
  saving,
  onChange,
  onSave,
  onCancel,
}: {
  form: EditForm;
  inputClass: string;
  saving: boolean;
  onChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-red-100 bg-white shadow-sm">
      <div className="h-1.5 bg-red-600" />

      <div className="p-5 sm:p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <Edit3 className="h-5 w-5" />
          </div>

          <div>
            <h3 className="font-extrabold text-slate-900">
              অনুরোধ সম্পাদনা
            </h3>

            <p className="text-xs text-slate-400">
              প্রয়োজনীয় তথ্য পরিবর্তন করে সংরক্ষণ করুন।
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="নাম">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              className={inputClass}
              placeholder="নাম"
            />
          </FormField>

          <FormField label="মোবাইল নম্বর">
            <input
              type="tel"
              name="phone"
              inputMode="numeric"
              value={form.phone}
              onChange={onChange}
              className={inputClass}
              placeholder="01XXXXXXXXX"
            />
          </FormField>

          <FormField label="রক্তের গ্রুপ">
            <select
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={onChange}
              className={inputClass}
            >
              <option value="">রক্তের গ্রুপ নির্বাচন করুন</option>

              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="হাসপাতাল">
            <input
              type="text"
              name="hospital"
              value={form.hospital}
              onChange={onChange}
              className={inputClass}
              placeholder="হাসপাতালের নাম"
            />
          </FormField>

          <div className="sm:col-span-2">
            <FormField label="কারণ">
              <textarea
                name="reason"
                value={form.reason}
                onChange={onChange}
                rows={4}
                className={`${inputClass} resize-y`}
                placeholder="রক্তের প্রয়োজনের কারণ"
              />
            </FormField>
          </div>

          <div className="sm:col-span-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white">
              <input
                type="checkbox"
                name="fulfilled"
                checked={form.fulfilled}
                onChange={onChange}
                className="h-5 w-5 rounded border-slate-300 text-red-600 focus:ring-red-500"
              />

              <div>
                <p className="text-sm font-bold text-slate-800">
                  অনুরোধটি সম্পন্ন হয়েছে
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  রক্তের প্রয়োজন মিটে গেলে এটি নির্বাচন করুন।
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            বাতিল
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/15 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}

            {saving ? "সংরক্ষণ হচ্ছে..." : "পরিবর্তন সংরক্ষণ করুন"}
          </button>
        </div>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

function FormField({
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

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-slate-400" />

        <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </span>
      </div>

      <p className="mt-1.5 truncate text-sm font-semibold text-slate-700">
        {value || "তথ্য নেই"}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="rounded-3xl border border-slate-200 bg-white p-6"
        >
          <div className="animate-pulse space-y-4">
            <div className="flex gap-3">
              <div className="h-12 w-12 rounded-2xl bg-slate-100" />

              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 rounded bg-slate-100" />
                <div className="h-3 w-28 rounded bg-slate-100" />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="h-16 rounded-2xl bg-slate-100" />
              <div className="h-16 rounded-2xl bg-slate-100" />
            </div>

            <div className="h-12 rounded-2xl bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Heart className="h-7 w-7" />
      </div>

      <h3 className="mt-5 font-extrabold text-slate-800">
        কোনো রক্তের অনুরোধ নেই
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
        বর্তমানে bloodRequests collection-এ কোনো রক্তের অনুরোধ পাওয়া
        যায়নি।
      </p>
    </div>
  );
}