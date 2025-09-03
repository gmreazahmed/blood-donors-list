import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";

interface CommentData {
  id: string;
  text: string;
  user: string;
  createdAt?: Timestamp;
}

export default function FooterCommentsAdmin() {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ user: "", text: "" });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchComments = async () => {
    const q = query(
      collection(db, "footerComments"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);

    const data: CommentData[] = snapshot.docs.map((doc) => {
      const docData = doc.data() as {
        text: string;
        user: string;
        createdAt?: Timestamp;
      };
      return {
        id: doc.id,
        text: docData.text,
        user: docData.user,
        createdAt: docData.createdAt,
      };
    });

    setComments(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("আপনি কি নিশ্চিতভাবে মুছতে চান?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "footerComments", id));
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const handleEdit = (comment: CommentData) => {
    setEditingId(comment.id);
    setForm({ user: comment.user, text: comment.text });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.user || !form.text) {
      alert("সব ফিল্ড পূরণ করুন।");
      return;
    }

    if (editingId) {
      // Update existing comment
      await updateDoc(doc(db, "footerComments", editingId), {
        user: form.user,
        text: form.text,
      });
      setComments((prev) =>
        prev.map((c) =>
          c.id === editingId ? { ...c, user: form.user, text: form.text } : c
        )
      );
      setEditingId(null);
    } else {
      // Add new comment
      const newDocRef = doc(collection(db, "footerComments"));
      const timestamp = Timestamp.now();
      await setDoc(newDocRef, {
        user: form.user,
        text: form.text,
        createdAt: timestamp,
      });
      setComments((prev) => [
        {
          id: newDocRef.id,
          user: form.user,
          text: form.text,
          createdAt: timestamp,
        },
        ...prev,
      ]);
    }

    setForm({ user: "", text: "" });
  };

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentComments = comments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(comments.length / itemsPerPage);

  return (
    <div className="p-6 bg-white shadow rounded-lg mt-8">
      <h2 className="text-xl font-semibold mb-4">মন্তব্য তালিকা</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="নাম"
          value={form.user}
          onChange={(e) => setForm({ ...form, user: e.target.value })}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <textarea
          placeholder="মন্তব্য"
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          {editingId ? "Update" : "Add Comment"}
        </button>
      </form>

      {loading ? (
        <p>লোড হচ্ছে...</p>
      ) : comments.length === 0 ? (
        <p>কোন মন্তব্য পাওয়া যায়নি।</p>
      ) : (
        <>
          <ul className="space-y-4">
            {currentComments.map((comment) => (
              <li
                key={comment.id}
                className="border border-gray-200 p-4 rounded-md shadow-sm flex justify-between items-start"
              >
                <div>
                  <p className="font-bold text-gray-800">{comment.user}</p>
                  <p className="text-gray-600 mt-1 whitespace-pre-line">
                    {comment.text}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {comment.createdAt
                      ? comment.createdAt.toDate().toLocaleString()
                      : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(comment)}
                    className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white text-xs px-3 py-1 rounded transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-xs px-3 py-1 rounded transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1
                      ? "bg-red-500 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
