import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/config";

export default function FooterCommentsAdmin() {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    const q = query(collection(db, "footerComments"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setComments(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("আপনি কি নিশ্চিতভাবে মুছতে চান?");
    if (!confirm) return;

    await deleteDoc(doc(db, "footerComments", id));
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="p-6 bg-white shadow rounded-lg mt-8">
      <h2 className="text-xl font-semibold mb-4">মন্তব্য তালিকা</h2>
      {loading ? (
        <p>লোড হচ্ছে...</p>
      ) : comments.length === 0 ? (
        <p>কোন মন্তব্য পাওয়া যায়নি।</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="border border-gray-200 p-4 rounded-md shadow-sm flex justify-between items-start"
            >
              <div>
                <p className="font-bold text-gray-800">{comment.name}</p>
                <p className="text-gray-600 mt-1 whitespace-pre-line">{comment.comment}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {comment.createdAt?.toDate?.().toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(comment.id)}
                className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-xs px-3 py-1 rounded transition"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
