import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
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
};

export default function FooterCommentsAdmin() {
  const [comments, setComments] = useState<CommentDoc[]>([]);
  const [loading, setLoading] = useState(true);

  // for editing / replying
  const [editingId, setEditingId] = useState<string | null>(null);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [form, setForm] = useState({ user: "", text: "" });
  const [replyText, setReplyText] = useState("");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // toast
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const normalizeDoc = (docData: any, id: string): CommentDoc => {
    // Accept multiple possible field names: { name/comment } or { user/text }
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
    };
  };

  const fetchComments = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "footerComments"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => normalizeDoc(d.data(), d.id));
      setComments(data);
    } catch (err) {
      console.error("fetchComments error", err);
      showToast("error", "কমেন্ট লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Add or update comment (from the admin form)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.user || !form.text) {
      showToast("error", "নাম ও মন্তব্য দিন");
      return;
    }

    try {
      if (editingId) {
        // update existing
        await updateDoc(doc(db, "footerComments", editingId), {
          name: form.user,
          user: form.user,
          comment: form.text,
          text: form.text,
        });
        setComments((prev) => prev.map((c) => (c.id === editingId ? { ...c, user: form.user, text: form.text } : c)));
        setEditingId(null);
        showToast("success", "মন্তব্য আপডেট হয়েছে");
      } else {
        // add new
        const newRef = doc(collection(db, "footerComments"));
        await setDoc(newRef, {
          user: form.user,
          text: form.text,
          name: form.user,
          comment: form.text,
          createdAt: serverTimestamp(),
          seen: true,
          seenAt: serverTimestamp(),
        });
        // Prepend local copy (createdAt will show after server)
        setComments((prev) => [{ id: newRef.id, user: form.user, text: form.text, seen: true, createdAt: new Date() }, ...prev]);
        showToast("success", "নতুন মন্তব্য যুক্ত হয়েছে");
      }
      setForm({ user: "", text: "" });
    } catch (err) {
      console.error(err);
      showToast("error", "অপস! চেষ্টা আবার করুন");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি মন্তব্য মুছে ফেলতে চান?")) return;
    try {
      await deleteDoc(doc(db, "footerComments", id));
      setComments((p) => p.filter((c) => c.id !== id));
      showToast("success", "মন্তব্য মুছে দেয়া হয়েছে");
    } catch (err) {
      console.error(err);
      showToast("error", "ডিলেট করা গেল না");
    }
  };

  const toggleSeen = async (c: CommentDoc) => {
    try {
      const ref = doc(db, "footerComments", c.id);
      if (c.seen) {
        await updateDoc(ref, { seen: false, seenAt: null });
        setComments((prev) => prev.map((it) => (it.id === c.id ? { ...it, seen: false, seenAt: undefined } : it)));
        showToast("success", "Seen UNSET করা হলো");
      } else {
        await updateDoc(ref, { seen: true, seenAt: serverTimestamp() });
        setComments((prev) => prev.map((it) => (it.id === c.id ? { ...it, seen: true, seenAt: new Date() } : it)));
        showToast("success", "Seen করা হলো");
      }
    } catch (err) {
      console.error(err);
      showToast("error", "Seen toggle করতে সমস্যা হয়েছে");
    }
  };

  const startEdit = (c: CommentDoc) => {
    setEditingId(c.id);
    setForm({ user: c.user, text: c.text });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startReply = (c: CommentDoc) => {
    setReplyingId(c.id);
    setReplyText(c.reply ?? "");
  };

  const submitReply = async (id: string) => {
    if (!replyText.trim()) {
      showToast("error", "প্রথমে রিপ্লাই লিখুন");
      return;
    }
    try {
      const ref = doc(db, "footerComments", id);
      await updateDoc(ref, {
        reply: replyText,
        repliedAt: serverTimestamp(),
        replier: "Admin",
        seen: true,
        seenAt: serverTimestamp(),
      });
      setComments((prev) => prev.map((c) => (c.id === id ? { ...c, reply: replyText, repliedAt: new Date(), seen: true } : c)));
      setReplyingId(null);
      setReplyText("");
      showToast("success", "রিপ্লাই করা হয়েছে");
    } catch (err) {
      console.error(err);
      showToast("error", "রিপ্লাই করা গেল না");
    }
  };

  // Pagination helpers
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentComments = comments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(comments.length / itemsPerPage);

  return (
    <div className="p-6 bg-white shadow rounded-lg mt-8">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed right-4 top-6 z-50 px-4 py-2 rounded shadow ${
            toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Footer Comments (Admin)</h2>

      {/* Admin add/edit form */}
      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          value={form.user}
          onChange={(e) => setForm((p) => ({ ...p, user: e.target.value }))}
          placeholder="নাম"
          className="px-3 py-2 border rounded"
        />
        <input
          value={form.text}
          onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
          placeholder="মন্তব্য"
          className="px-3 py-2 border rounded"
        />
        <div className="flex gap-2">
          <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded">
            {editingId ? "Update" : "Add Comment"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ user: "", text: "" });
              }}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              fetchComments();
              showToast("success", "রিফ্রেশ করা হল");
            }}
            className="ml-auto px-4 py-2 border rounded"
          >
            Refresh
          </button>
        </div>
      </form>

      {loading ? (
        <p>লোড হচ্ছে...</p>
      ) : comments.length === 0 ? (
        <p>কোন মন্তব্য পাওয়া যায়নি।</p>
      ) : (
        <>
          <ul className="space-y-4">
            {currentComments.map((c) => (
              <li key={c.id} className="border border-gray-200 p-4 rounded-md flex flex-col md:flex-row md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-gray-800">{c.user}</p>
                      <p className="text-gray-700 whitespace-pre-line mt-1">{c.text}</p>
                      {c.reply && (
                        <div className="mt-3 p-3 bg-gray-50 border rounded">
                          <p className="text-sm font-medium text-gray-800">Admin Reply:</p>
                          <p className="text-gray-700">{c.reply}</p>
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {c.createdAt ? (c.createdAt.toDate ? c.createdAt.toDate().toLocaleString() : new Date(c.createdAt).toLocaleString()) : ""}
                        {c.seen ? ` • Seen` : ""}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="mb-2">
                        <button
                          onClick={() => toggleSeen(c)}
                          className={`text-xs px-3 py-1 rounded ${c.seen ? "bg-green-100 text-green-700 border border-green-200" : "bg-yellow-100 text-yellow-800 border border-yellow-200"}`}
                        >
                          {c.seen ? "Seen" : "Unseen"}
                        </button>
                      </div>
                      <div className="text-xs text-gray-500">ID: {c.id}</div>
                    </div>
                  </div>
                </div>

                {/* actions */}
                <div className="flex flex-col gap-2 md:items-end">
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(c)} className="text-xs px-3 py-1 border rounded text-blue-600">Edit</button>
                    <button onClick={() => handleDelete(c.id)} className="text-xs px-3 py-1 border rounded text-red-600">Delete</button>
                    <button onClick={() => startReply(c)} className="text-xs px-3 py-1 border rounded text-green-600">Reply</button>
                  </div>

                  {/* reply box */}
                  {replyingId === c.id && (
                    <div className="mt-2 w-full md:w-[300px]">
                      <textarea className="w-full border p-2 rounded" rows={3} value={replyText} onChange={(e) => setReplyText(e.target.value)} />
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => submitReply(c.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm">Send Reply</button>
                        <button onClick={() => { setReplyingId(null); setReplyText(""); }} className="px-3 py-1 border rounded text-sm">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-3 py-1 rounded ${currentPage === idx + 1 ? "bg-red-600 text-white" : "bg-white border"}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
