import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import {
  Check,
  CheckCircle2,
  Edit3,
  MessageCircle,
  RefreshCw,
  Reply,
  Send,
  Trash2,
  UserRound,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

import { db } from "../firebase/config";

type CommentDoc = {
  id: string;
  user: string;
  text: string;
  createdAt?: any;
  seen?: boolean;
  seenAt?: any;
  reply?: string;
  repliedAt?: any;
  replier?: string;
};

type Toast = {
  type: "success" | "error";
  msg: string;
};

const ITEMS_PER_PAGE = 6;

export default function FooterCommentsAdmin() {
  const [comments, setComments] = useState<CommentDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [replyingId, setReplyingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    user: "",
    text: "",
  });

  const [replyText, setReplyText] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [toast, setToast] = useState<Toast | null>(null);

  const [saving, setSaving] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);

  /* =========================
     Toast
  ========================== */

  const showToast = (type: Toast["type"], msg: string) => {
    setToast({ type, msg });

    window.setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  /* =========================
     Normalize Firebase data
  ========================== */

  const normalizeDoc = (
    docData: Record<string, any>,
    id: string
  ): CommentDoc => {
    const user = docData.user ?? docData.name ?? "Anonymous";
    const text = docData.text ?? docData.comment ?? "";

    return {
      id,
      user,
      text,
      createdAt: docData.createdAt,
      seen: docData.seen ?? false,
      seenAt: docData.seenAt,
      reply: docData.reply,
      repliedAt: docData.repliedAt,
      replier: docData.replier,
    };
  };

  /* =========================
     Fetch comments
  ========================== */

  const fetchComments = async () => {
    setLoading(true);

    try {
      const commentsRef = collection(db, "footerComments");

      const q = query(
        commentsRef,
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);

      const data = snap.docs.map((item) =>
        normalizeDoc(item.data(), item.id)
      );

      setComments(data);

      const maxPage = Math.max(
        1,
        Math.ceil(data.length / ITEMS_PER_PAGE)
      );

      setCurrentPage((page) =>
        Math.min(page, maxPage)
      );
    } catch (error) {
      console.error("fetchComments error:", error);

      showToast(
        "error",
        "কমেন্ট লোড করতে সমস্যা হয়েছে।"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  /* =========================
     Statistics
  ========================== */

  const stats = useMemo(() => {
    const total = comments.length;

    const seen = comments.filter(
      (comment) => comment.seen
    ).length;

    const unseen = total - seen;

    const replied = comments.filter(
      (comment) => Boolean(comment.reply)
    ).length;

    return {
      total,
      seen,
      unseen,
      replied,
    };
  }, [comments]);

  /* =========================
     Add / Edit comment
  ========================== */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const user = form.user.trim();
    const text = form.text.trim();

    if (!user || !text) {
      showToast(
        "error",
        "নাম ও মন্তব্য দিন।"
      );
      return;
    }

    if (user.length > 100) {
      showToast(
        "error",
        "নাম সর্বোচ্চ ১০০ অক্ষরের হতে পারে।"
      );
      return;
    }

    if (text.length > 1000) {
      showToast(
        "error",
        "মন্তব্য সর্বোচ্চ ১০০০ অক্ষরের হতে পারে।"
      );
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        await updateDoc(
          doc(db, "footerComments", editingId),
          {
            name: user,
            user,
            comment: text,
            text,
          }
        );

        setComments((prev) =>
          prev.map((comment) =>
            comment.id === editingId
              ? {
                  ...comment,
                  user,
                  text,
                }
              : comment
          )
        );

        setEditingId(null);

        showToast(
          "success",
          "মন্তব্য সফলভাবে আপডেট হয়েছে।"
        );
      } else {
        const newRef = await addDoc(
          collection(db, "footerComments"),
          {
            user,
            text,
            name: user,
            comment: text,
            createdAt: serverTimestamp(),
            seen: true,
            seenAt: serverTimestamp(),
          }
        );

        setComments((prev) => [
          {
            id: newRef.id,
            user,
            text,
            seen: true,
            createdAt: new Date(),
          },
          ...prev,
        ]);

        setCurrentPage(1);

        showToast(
          "success",
          "নতুন মন্তব্য যুক্ত হয়েছে।"
        );
      }

      setForm({
        user: "",
        text: "",
      });
    } catch (error) {
      console.error(
        "Comment save error:",
        error
      );

      showToast(
        "error",
        "মন্তব্য সংরক্ষণ করা যায়নি।"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     Delete
  ========================== */

  const handleDelete = async (
    id: string
  ) => {
    const confirmed = window.confirm(
      "আপনি কি নিশ্চিতভাবে এই মন্তব্যটি মুছে ফেলতে চান?"
    );

    if (!confirmed) return;

    try {
      await deleteDoc(
        doc(db, "footerComments", id)
      );

      setComments((prev) =>
        prev.filter(
          (comment) => comment.id !== id
        )
      );

      showToast(
        "success",
        "মন্তব্য মুছে দেওয়া হয়েছে।"
      );
    } catch (error) {
      console.error(
        "Delete error:",
        error
      );

      showToast(
        "error",
        "মন্তব্য মুছে ফেলা যায়নি।"
      );
    }
  };

  /* =========================
     Seen / Unseen
  ========================== */

  const toggleSeen = async (
    comment: CommentDoc
  ) => {
    try {
      const ref = doc(
        db,
        "footerComments",
        comment.id
      );

      if (comment.seen) {
        await updateDoc(ref, {
          seen: false,
          seenAt: null,
        });

        setComments((prev) =>
          prev.map((item) =>
            item.id === comment.id
              ? {
                  ...item,
                  seen: false,
                  seenAt: undefined,
                }
              : item
          )
        );

        showToast(
          "success",
          "মন্তব্যটি Unseen করা হয়েছে।"
        );
      } else {
        await updateDoc(ref, {
          seen: true,
          seenAt: serverTimestamp(),
        });

        setComments((prev) =>
          prev.map((item) =>
            item.id === comment.id
              ? {
                  ...item,
                  seen: true,
                  seenAt: new Date(),
                }
              : item
          )
        );

        showToast(
          "success",
          "মন্তব্যটি Seen করা হয়েছে।"
        );
      }
    } catch (error) {
      console.error(
        "Seen toggle error:",
        error
      );

      showToast(
        "error",
        "Seen status পরিবর্তন করা যায়নি।"
      );
    }
  };

  /* =========================
     Edit
  ========================== */

  const startEdit = (
    comment: CommentDoc
  ) => {
    setEditingId(comment.id);

    setForm({
      user: comment.user,
      text: comment.text,
    });

    setReplyingId(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);

    setForm({
      user: "",
      text: "",
    });
  };

  /* =========================
     Reply
  ========================== */

  const startReply = (
    comment: CommentDoc
  ) => {
    setReplyingId(comment.id);
    setReplyText(comment.reply ?? "");
    setEditingId(null);
  };

  const cancelReply = () => {
    setReplyingId(null);
    setReplyText("");
  };

  const submitReply = async (
    id: string
  ) => {
    const reply = replyText.trim();

    if (!reply) {
      showToast(
        "error",
        "প্রথমে রিপ্লাই লিখুন।"
      );
      return;
    }

    if (reply.length > 1000) {
      showToast(
        "error",
        "রিপ্লাই সর্বোচ্চ ১০০০ অক্ষরের হতে পারে।"
      );
      return;
    }

    setReplyLoading(true);

    try {
      const ref = doc(
        db,
        "footerComments",
        id
      );

      await updateDoc(ref, {
        reply,
        repliedAt: serverTimestamp(),
        replier: "Admin",
        seen: true,
        seenAt: serverTimestamp(),
      });

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === id
            ? {
                ...comment,
                reply,
                repliedAt: new Date(),
                replier: "Admin",
                seen: true,
              }
            : comment
        )
      );

      setReplyingId(null);
      setReplyText("");

      showToast(
        "success",
        "রিপ্লাই সফলভাবে পাঠানো হয়েছে।"
      );
    } catch (error) {
      console.error(
        "Reply error:",
        error
      );

      showToast(
        "error",
        "রিপ্লাই পাঠানো যায়নি।"
      );
    } finally {
      setReplyLoading(false);
    }
  };

  /* =========================
     Pagination
  ========================== */

  const totalPages = Math.max(
    1,
    Math.ceil(
      comments.length / ITEMS_PER_PAGE
    )
  );

  const indexOfLast =
    currentPage * ITEMS_PER_PAGE;

  const indexOfFirst =
    indexOfLast - ITEMS_PER_PAGE;

  const currentComments =
    comments.slice(
      indexOfFirst,
      indexOfLast
    );

  /* =========================
     Date formatter
  ========================== */

  const formatDate = (
    value: any
  ) => {
    if (!value) return "";

    try {
      const date =
        typeof value?.toDate === "function"
          ? value.toDate()
          : new Date(value);

      if (Number.isNaN(date.getTime())) {
        return "";
      }

      return date.toLocaleString("bn-BD", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return "";
    }
  };

  return (
    <section className="relative mt-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl shadow-gray-200/40">

      {/* =========================
          Toast
      ========================== */}

      {toast && (
        <div
          role="alert"
          className="fixed right-4 top-5 z-[100] flex max-w-sm items-start gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-2xl"
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
          ) : (
            <X className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          )}

          <p className="text-sm font-medium text-gray-700">
            {toast.msg}
          </p>
        </div>
      )}

      {/* =========================
          Header
      ========================== */}

      <div className="border-b border-gray-100 bg-gradient-to-r from-red-50 via-white to-red-50 px-5 py-6 sm:px-7">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-lg shadow-red-200">
                <MessageCircle className="h-5 w-5" />
              </div>

              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                ADMIN
              </span>
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
              Footer Comments
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Visitor comments, replies এবং feedback পরিচালনা করুন।
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              fetchComments();
              showToast(
                "success",
                "কমেন্ট তালিকা রিফ্রেশ করা হচ্ছে।"
              );
            }}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-red-200 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loading ? "animate-spin" : ""
              }`}
            />

            Refresh
          </button>

        </div>

        {/* =========================
            Statistics
        ========================== */}

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">

          <StatCard
            label="মোট"
            value={stats.total}
            icon={<MessageCircle className="h-4 w-4" />}
          />

          <StatCard
            label="Unseen"
            value={stats.unseen}
            icon={<EyeOff className="h-4 w-4" />}
          />

          <StatCard
            label="Seen"
            value={stats.seen}
            icon={<Eye className="h-4 w-4" />}
          />

          <StatCard
            label="Replied"
            value={stats.replied}
            icon={<Reply className="h-4 w-4" />}
          />

        </div>
      </div>

      {/* =========================
          Add / Edit Form
      ========================== */}

      <div className="border-b border-gray-100 p-5 sm:p-7">

        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-gray-900">
              {editingId
                ? "মন্তব্য Edit করুন"
                : "নতুন মন্তব্য যোগ করুন"}
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Admin থেকে comment manually add বা edit করতে পারবেন।
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-red-200 hover:text-red-600"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-3 lg:grid-cols-[220px_1fr_auto]"
        >

          <div className="relative">
            <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              value={form.user}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  user: e.target.value,
                }))
              }
              placeholder="নাম"
              maxLength={100}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100"
            />
          </div>

          <input
            value={form.text}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                text: e.target.value,
              }))
            }
            placeholder="মন্তব্য লিখুন..."
            maxLength={1000}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100"
          />

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-200 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : editingId ? (
              <Check className="h-4 w-4" />
            ) : (
              <MessageCircle className="h-4 w-4" />
            )}

            {saving
              ? "Saving..."
              : editingId
              ? "Update"
              : "Add Comment"}
          </button>

        </form>
      </div>

      {/* =========================
          Comments
      ========================== */}

      <div className="p-5 sm:p-7">

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-gray-100 p-5"
              >
                <div className="h-4 w-32 rounded bg-gray-200" />
                <div className="mt-3 h-3 w-3/4 rounded bg-gray-100" />
                <div className="mt-2 h-3 w-1/2 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-12 text-center">
            <MessageCircle className="mx-auto h-10 w-10 text-gray-300" />

            <h3 className="mt-4 font-bold text-gray-700">
              কোনো মন্তব্য পাওয়া যায়নি
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Visitor feedback এখানে দেখা যাবে।
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {currentComments.map((comment) => (
                <article
                  key={comment.id}
                  className={`rounded-2xl border p-5 transition ${
                    comment.seen
                      ? "border-gray-200 bg-white"
                      : "border-yellow-200 bg-yellow-50/30"
                  }`}
                >

                  {/* Top */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                          <UserRound className="h-4 w-4" />
                        </div>

                        <div>
                          <p className="font-bold text-gray-900">
                            {comment.user}
                          </p>

                          <p className="text-xs text-gray-400">
                            {formatDate(comment.createdAt)}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            comment.seen
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {comment.seen
                            ? "Seen"
                            : "Unseen"}
                        </span>
                      </div>

                      {/* Comment */}
                      <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-700">
                        {comment.text}
                      </p>

                      {/* Reply */}
                      {comment.reply && (
                        <div className="mt-4 rounded-xl border border-red-100 bg-red-50/60 p-4">

                          <div className="flex items-center gap-2">
                            <Reply className="h-4 w-4 text-red-600" />

                            <span className="text-xs font-bold uppercase tracking-wide text-red-700">
                              {comment.replier ||
                                "Admin"}{" "}
                              Reply
                            </span>
                          </div>

                          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700">
                            {comment.reply}
                          </p>

                          {comment.repliedAt && (
                            <p className="mt-2 text-[11px] text-gray-400">
                              {formatDate(
                                comment.repliedAt
                              )}
                            </p>
                          )}
                        </div>
                      )}

                    </div>

                    {/* Status */}
                    <button
                      type="button"
                      onClick={() =>
                        toggleSeen(comment)
                      }
                      className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition ${
                        comment.seen
                          ? "border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                          : "border border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                      }`}
                    >
                      {comment.seen ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}

                      {comment.seen
                        ? "Seen"
                        : "Mark Seen"}
                    </button>

                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">

                    <button
                      type="button"
                      onClick={() =>
                        startEdit(comment)
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:border-blue-200 hover:bg-blue-50"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        startReply(comment)
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-green-600 transition hover:border-green-200 hover:bg-green-50"
                    >
                      <Reply className="h-3.5 w-3.5" />
                      Reply
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(comment.id)
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>

                    <span className="ml-auto hidden text-[10px] text-gray-300 sm:block">
                      ID: {comment.id}
                    </span>

                  </div>

                  {/* Reply box */}
                  {replyingId === comment.id && (
                    <div className="mt-4 rounded-2xl border border-green-100 bg-green-50/50 p-4">

                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Reply className="h-4 w-4 text-green-600" />

                          <span className="text-sm font-bold text-gray-800">
                            Admin Reply
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={cancelReply}
                          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-white hover:text-red-600"
                          aria-label="Cancel reply"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <textarea
                        value={replyText}
                        onChange={(e) =>
                          setReplyText(
                            e.target.value
                          )
                        }
                        placeholder="আপনার রিপ্লাই লিখুন..."
                        maxLength={1000}
                        rows={4}
                        className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-green-400 focus:ring-4 focus:ring-green-100"
                      />

                      <div className="mt-3 flex flex-wrap justify-end gap-2">

                        <button
                          type="button"
                          onClick={cancelReply}
                          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-600 transition hover:text-red-600"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            submitReply(
                              comment.id
                            )
                          }
                          disabled={replyLoading}
                          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {replyLoading ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}

                          {replyLoading
                            ? "Sending..."
                            : "Send Reply"}
                        </button>

                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>

            {/* =========================
                Pagination
            ========================== */}

            {totalPages > 1 && (
              <div className="mt-7 flex flex-wrap items-center justify-center gap-2">

                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.max(1, page - 1)
                    )
                  }
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-red-200 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ←
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    type="button"
                    key={page}
                    onClick={() =>
                      setCurrentPage(page)
                    }
                    className={`h-9 min-w-9 rounded-xl px-3 text-xs font-bold transition ${
                      currentPage === page
                        ? "bg-red-600 text-white shadow-md shadow-red-200"
                        : "border border-gray-200 bg-white text-gray-600 hover:border-red-200 hover:text-red-600"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={
                    currentPage === totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.min(
                          totalPages,
                          page + 1
                        )
                    )
                  }
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-red-200 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  →
                </button>

              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

/* =========================
   Statistics Card
========================== */

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-gray-500">
          {label}
        </span>

        <span className="text-red-500">
          {icon}
        </span>
      </div>

      <p className="mt-2 text-2xl font-extrabold text-gray-900">
        {value}
      </p>
    </div>
  );
}