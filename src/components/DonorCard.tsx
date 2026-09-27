import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Phone,
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

function getDateValue(value?: string | Timestamp): string {
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

  return Math.floor(
    (today.getTime() - donationDate.getTime()) /
      (1000 * 60 * 60 * 24)
  );
}

function checkAvailability(daysAgo: number | null) {
  if (daysAgo === null) {
    return {
      available: true,
      label: "তথ্য প্রয়োজন",
    };
  }

  return {
    available: daysAgo >= 90,
    label: daysAgo >= 90
      ? "সম্ভাব্য Available"
      : "বর্তমানে অপেক্ষমাণ",
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

  const location = [
    donor.village,
    donor.union,
    donor.upazila,
  ]
    .filter(Boolean)
    .join(", ");

  const handleUpdate = async () => {
    if (!editDate) {
      setError("সর্বশেষ রক্তদানের তারিখ নির্বাচন করুন।");
      setMessage("");
      return;
    }

    const selectedDate = new Date(`${editDate}T00:00:00`);
    const today = new Date();

    if (Number.isNaN(selectedDate.getTime())) {
      setError("সঠিক তারিখ নির্বাচন করুন।");
      setMessage("");
      return;
    }

    if (selectedDate > today) {
      setError(
        "ভবিষ্যতের তারিখ সর্বশেষ রক্তদানের তারিখ হিসেবে দেওয়া যাবে না।"
      );
      setMessage("");
      return;
    }

    const confirmed = window.confirm(
      "জনস্বার্থে সঠিক তথ্য দিন। আপনি কি সর্বশেষ রক্তদানের তারিখটি আপডেট করতে চান?"
    );

    if (!confirmed) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const donorRef = doc(db, "donors", donor.id);

      await updateDoc(donorRef, {
        lastDonateDate: editDate,
      });

      setMessage(
        "সর্বশেষ রক্তদানের তারিখ সফলভাবে আপডেট হয়েছে।"
      );
    } catch (err) {
      console.error("Failed to update donation date:", err);

      setError(
        "তথ্য আপডেট করা যায়নি। আপনার অনুমতি বা Firebase configuration পরীক্ষা করুন।"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <div
        className="
          relative flex h-full flex-col overflow-hidden
          rounded-2xl
          border border-slate-200
          bg-white
          shadow-sm
          transition-shadow duration-200
          hover:shadow-md
        "
      >
        {/* Top accent */}
        <div className="h-1 bg-gradient-to-r from-red-600 to-rose-400" />

        {/* Header */}
        <div className="px-5 pb-4 pt-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              {/* Blood group */}
              <div
                className="
                  flex h-12 w-12 shrink-0
                  items-center justify-center
                  rounded-xl
                  bg-red-50
                  text-sm font-black
                  text-red-600
                "
                aria-hidden="true"
              >
                {donor.bloodGroup}
              </div>

              <div className="min-w-0">
                <h3
                  className="
                    truncate
                    text-[16px] font-extrabold
                    text-slate-900
                    sm:text-[17px]
                  "
                  title={donor.name}
                >
                  {donor.name}
                </h3>

                <p className="mt-0.5 text-xs text-slate-400">
                  রক্তদাতা
                </p>
              </div>
            </div>

            {/* Blood badge */}
            <span
              className="
                shrink-0
                rounded-full
                bg-red-600
                px-3 py-1.5
                text-xs font-black
                text-white
              "
              aria-label={`রক্তের গ্রুপ ${donor.bloodGroup}`}
            >
              {donor.bloodGroup}
            </span>
          </div>

          {/* Availability */}
          <div className="mt-4">
            {availability.available ? (
              <span
                className="
                  inline-flex items-center gap-1.5
                  rounded-full
                  bg-emerald-50
                  px-2.5 py-1
                  text-[11px] font-bold
                  text-emerald-700
                "
              >
                <CheckCircle2
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                />
                {availability.label}
              </span>
            ) : (
              <span
                className="
                  inline-flex items-center gap-1.5
                  rounded-full
                  bg-amber-50
                  px-2.5 py-1
                  text-[11px] font-bold
                  text-amber-700
                "
              >
                <Clock3
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                />
                {availability.label}
              </span>
            )}
          </div>
        </div>

        {/* Information */}
        <div className="px-5">
          {/* Location */}
          <div className="flex items-start gap-3 py-3">
            <MapPin
              className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
              aria-hidden="true"
            />

            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-slate-400">
                অবস্থান
              </p>

              <p className="mt-0.5 text-sm font-semibold leading-5 text-slate-700">
                {location || "অবস্থান দেওয়া হয়নি"}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100" />

          {/* Phone */}
          {donor.phone && (
            <div className="flex items-center justify-between gap-3 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <Phone
                  className="h-4 w-4 shrink-0 text-emerald-600"
                  aria-hidden="true"
                />

                <div className="min-w-0">
                  <p className="text-[10px] font-semibold text-slate-400">
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
                className="
                  inline-flex shrink-0 items-center gap-1.5
                  rounded-lg
                  bg-emerald-600
                  px-3 py-2
                  text-xs font-bold
                  text-white
                  transition
                  hover:bg-emerald-700
                  active:scale-95
                  focus:outline-none
                  focus:ring-2
                  focus:ring-emerald-500
                  focus:ring-offset-2
                "
              >
                <Phone className="h-3.5 w-3.5" />
                কল
              </a>
            </div>
          )}
        </div>

        {/* Donation date */}
        <div
          className="
            mt-1
            border-t border-slate-100
            bg-slate-50/60
            px-5 py-4
          "
        >
          <div className="flex items-center gap-2">
            <CalendarDays
              className="h-4 w-4 text-red-500"
              aria-hidden="true"
            />

            <label
              htmlFor={`donation-date-${donor.id}`}
              className="text-xs font-bold text-slate-700"
            >
              সর্বশেষ রক্তদানের তারিখ
            </label>
          </div>

          <div className="mt-2.5 flex gap-2">
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
              className="
                min-h-11 min-w-0 flex-1
                rounded-lg
                border border-slate-200
                bg-white
                px-3
                text-sm text-slate-700
                outline-none
                transition
                focus:border-red-400
                focus:ring-2
                focus:ring-red-100
              "
            />

            <button
              type="button"
              onClick={handleUpdate}
              disabled={saving}
              className="
                min-h-11 shrink-0
                rounded-lg
                bg-slate-900
                px-4
                text-xs font-bold
                text-white
                transition
                hover:bg-slate-800
                active:scale-95
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {saving ? "..." : "আপডেট"}
            </button>
          </div>

          {/* Days status */}
          {daysAgo !== null && (
            <div
              className={`
                mt-2.5
                flex items-start gap-1.5
                text-[11px]
                leading-5
                ${
                  availability.available
                    ? "text-emerald-700"
                    : "text-amber-700"
                }
              `}
            >
              {availability.available ? (
                <CheckCircle2
                  className="mt-0.5 h-3.5 w-3.5 shrink-0"
                  aria-hidden="true"
                />
              ) : (
                <XCircle
                  className="mt-0.5 h-3.5 w-3.5 shrink-0"
                  aria-hidden="true"
                />
              )}

              <span>
                সর্বশেষ রক্তদান থেকে{" "}
                <strong>{Math.max(daysAgo, 0)} দিন</strong>{" "}
                হয়েছে। বর্তমান availability ফোনে নিশ্চিত করুন।
              </span>
            </div>
          )}

          {/* Success */}
          {message && (
            <p
              role="status"
              className="
                mt-2
                text-[11px] font-semibold
                text-emerald-600
              "
            >
              ✓ {message}
            </p>
          )}

          {/* Error */}
          {error && (
            <p
              role="alert"
              className="
                mt-2
                text-[11px] font-semibold
                leading-5 text-red-600
              "
            >
              {error}
            </p>
          )}
        </div>
      </div>
    </motion.article>
  );
}