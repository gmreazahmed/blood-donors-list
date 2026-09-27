import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Phone,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { db } from "../firebase/config";

type Donor = {
  id: string;
  name: string;
  bloodGroup: string;
  upazila: string;
  union: string;
  village: string;
  phone: string;
  lastDonateDate?: string | Timestamp;
};

type Props = {
  donor: Donor;
};

function getDateValue(
  value?: string | Timestamp
): string {
  if (!value) return "";

  if (value instanceof Timestamp) {
    return value.toDate().toISOString().slice(0, 10);
  }

  return value;
}

function getDaysSinceDonation(date: string): number | null {
  if (!date) return null;

  const donationDate = new Date(`${date}T00:00:00`);
  const today = new Date();

  if (Number.isNaN(donationDate.getTime())) {
    return null;
  }

  donationDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const difference =
    today.getTime() - donationDate.getTime();

  return Math.floor(
    difference / (1000 * 60 * 60 * 24)
  );
}

/**
 * Current availability rule:
 * A donor is considered potentially available
 * after approximately 3 months from the last donation.
 */
function checkAvailability(daysAgo: number | null) {
  if (daysAgo === null) {
    return {
      available: true,
      label: "তথ্য আপডেট প্রয়োজন",
    };
  }

  return {
    available: daysAgo >= 90,
    label: daysAgo >= 90 ? "সম্ভাব্য Available" : "অপেক্ষমাণ",
  };
}

export default function DonorCard({ donor }: Props) {
  const [editDate, setEditDate] = useState(
    getDateValue(donor.lastDonateDate)
  );

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setEditDate(getDateValue(donor.lastDonateDate));
  }, [donor.lastDonateDate]);

  const daysAgo = useMemo(
    () => getDaysSinceDonation(editDate),
    [editDate]
  );

  const availability = useMemo(
    () => checkAvailability(daysAgo),
    [daysAgo]
  );

  const handleUpdate = async () => {
    if (!editDate) {
      setError("সর্বশেষ রক্তদানের তারিখ নির্বাচন করুন।");
      setMessage("");
      return;
    }

    const selectedDate = new Date(
      `${editDate}T00:00:00`
    );

    const today = new Date();

    if (Number.isNaN(selectedDate.getTime())) {
      setError("সঠিক তারিখ নির্বাচন করুন।");
      return;
    }

    if (selectedDate > today) {
      setError(
        "ভবিষ্যতের তারিখ সর্বশেষ রক্তদানের তারিখ হিসেবে দেওয়া যাবে না।"
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const confirmed = window.confirm(
        "জনস্বার্থে সঠিক তথ্য দিন। আপনি কি সর্বশেষ রক্তদানের তারিখটি আপডেট করতে চান?"
      );

      if (!confirmed) {
        return;
      }

      const donorRef = doc(db, "donors", donor.id);

      await updateDoc(donorRef, {
        lastDonateDate: editDate,
      });

      setMessage(
        "সর্বশেষ রক্তদানের তারিখ সফলভাবে আপডেট হয়েছে।"
      );
    } catch (err) {
      console.error(
        "Failed to update donation date:",
        err
      );

      setError(
        "তথ্য আপডেট করা যায়নি। আপনার অনুমতি বা Firebase configuration পরীক্ষা করুন।"
      );
    } finally {
      setSaving(false);
    }
  };

  const location = [
    donor.village,
    donor.union,
    donor.upazila,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className="group relative h-full w-full"
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 group-hover:shadow-xl">
        {/* Top accent */}
        <div className="h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-rose-400" />

        {/* =========================
            HEADER
        ========================== */}
        <div className="relative p-5 pb-4 sm:p-6 sm:pb-4">
          <div className="flex items-start justify-between gap-3">
            {/* Donor identity */}
            <div className="flex min-w-0 items-center gap-3">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-sm font-black text-red-600 ring-4 ring-red-50/70"
                aria-hidden="true"
              >
                {donor.bloodGroup}
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-base font-extrabold text-slate-900 sm:text-lg">
                  {donor.name}
                </h3>

                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                  <ShieldCheck
                    size={13}
                    className="text-green-600"
                    aria-hidden="true"
                  />

                  <span>রক্তদাতা</span>
                </div>
              </div>
            </div>

            {/* Blood group */}
            <span
              className="shrink-0 rounded-full bg-red-600 px-3 py-1.5 text-xs font-black text-white shadow-sm"
              aria-label={`রক্তের গ্রুপ ${donor.bloodGroup}`}
            >
              {donor.bloodGroup}
            </span>
          </div>

          {/* Availability */}
          <div className="mt-5">
            {availability.available ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                <CheckCircle2
                  size={14}
                  aria-hidden="true"
                />

                {daysAgo === null
                  ? "তথ্য প্রয়োজন"
                  : "সম্ভাব্য Available"}
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                <Clock3
                  size={14}
                  aria-hidden="true"
                />

                বর্তমানে অপেক্ষমাণ
              </div>
            )}
          </div>
        </div>

        {/* =========================
            DONOR INFO
        ========================== */}
        <div className="flex-1 px-5 pb-5 sm:px-6">
          {/* Location */}
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm">
                <MapPin
                  size={17}
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-400">
                  অবস্থান
                </p>

                <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">
                  {location || "অবস্থান দেওয়া হয়নি"}
                </p>
              </div>
            </div>
          </div>

          {/* Phone */}
          {donor.phone && (
            <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <Phone
                    size={16}
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-slate-400">
                    যোগাযোগ
                  </p>

                  <p className="truncate text-sm font-bold text-slate-700">
                    {donor.phone}
                  </p>
                </div>
              </div>

              <a
                href={`tel:${donor.phone}`}
                aria-label={`${donor.name}-এর সাথে ফোনে যোগাযোগ করুন`}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-green-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <Phone size={14} aria-hidden="true" />
                কল
              </a>
            </div>
          )}
        </div>

        {/* =========================
            DONATION DATE
        ========================== */}
        <div className="border-t border-slate-100 bg-slate-50/80 p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <CalendarDays
              size={16}
              className="text-red-600"
              aria-hidden="true"
            />

            <label
              htmlFor={`donation-date-${donor.id}`}
              className="text-xs font-extrabold text-slate-700"
            >
              সর্বশেষ রক্তদানের তারিখ
            </label>
          </div>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              id={`donation-date-${donor.id}`}
              type="date"
              value={editDate}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(event) => {
                setEditDate(event.target.value);
                setMessage("");
                setError("");
              }}
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-100 sm:flex-1"
            />

            <button
              type="button"
              onClick={handleUpdate}
              disabled={saving}
              className="min-h-11 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </div>

          {/* Status */}
          {daysAgo !== null && (
            <div
              className={`mt-3 flex items-start gap-2 text-xs leading-5 ${
                availability.available
                  ? "text-green-700"
                  : "text-amber-700"
              }`}
            >
              {availability.available ? (
                <CheckCircle2
                  size={14}
                  className="mt-0.5 shrink-0"
                  aria-hidden="true"
                />
              ) : (
                <XCircle
                  size={14}
                  className="mt-0.5 shrink-0"
                  aria-hidden="true"
                />
              )}

              <span>
                সর্বশেষ রক্তদান থেকে{" "}
                <strong>{Math.max(daysAgo, 0)} দিন</strong>{" "}
                হয়েছে।
                {availability.available
                  ? " বর্তমান availability অবশ্যই ফোনে নিশ্চিত করুন।"
                  : " আবার রক্তদানের আগে প্রয়োজনীয় সময় অপেক্ষা করুন।"}
              </span>
            </div>
          )}

          {/* Success */}
          {message && (
            <p
              role="status"
              className="mt-3 rounded-xl bg-green-50 px-3 py-2 text-xs font-semibold text-green-700"
            >
              ✓ {message}
            </p>
          )}

          {/* Error */}
          {error && (
            <p
              role="alert"
              className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold leading-5 text-red-700"
            >
              {error}
            </p>
          )}
        </div>
      </div>
    </motion.article>
  );
}