import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";


type Donor = {
  id: string;
  name: string;
  bloodGroup: string;
  upazila: string;
  union: string;
  phone: string;
  lastDonateDate?: string;
};

export default function DonorCard({ donor }: { donor: Donor }) {
    const [editDate, setEditDate] = useState(donor.lastDonateDate || "");

    const handleUpdate = async () => {
    if (!editDate) return;
    const ref = doc(db, "donors", donor.id);
    await updateDoc(ref, { lastDonateDate: editDate });
    alert("Last donate date updated.");
    };

  return (
    <div className="border p-4 rounded shadow-sm bg-white">
      <h3 className="font-bold text-lg">{donor.name}</h3>
      <p><span className="font-semibold">Blood:</span> {donor.bloodGroup}</p>
      <p><span className="font-semibold">Area:</span> {donor.union}, {donor.upazila}</p>
      <p><span className="font-semibold">Phone:</span> {donor.phone}</p>
      {/* {donor.lastDonateDate && <p><span className="font-semibold">Last Donated:</span> {donor.lastDonateDate}</p>} */}
      <div className="mt-2">
            <label className="block mb-1">Last Donate Date:</label>
            
            <input
                type="date"
                value={editDate}
                onChange={e => setEditDate(e.target.value)}
                className="border p-1 rounded mr-2"
            />
            <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm"
            >
                Update Date
            </button>
        </div>

    </div>
  );
}
