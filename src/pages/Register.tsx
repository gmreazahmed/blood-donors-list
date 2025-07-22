import { useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { areaData } from "../data/upazila-union";



export default function Register() {
  const [form, setForm] = useState({
    name: "",
    bloodGroup: "",
    upazila: "",
    union: "",
    village: "", 
    phone: "",
    lastDonateDate: ""
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.bloodGroup || !form.upazila || !form.union || !form.phone) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      await addDoc(collection(db, "donors"), {
        ...form,
        createdAt: Timestamp.now()
      });
      setForm({
        name: "",
        bloodGroup: "",
        upazila: "",
        union: "",
        village: "", 
        phone: "",
        lastDonateDate: ""
      });
      setSuccess(true);
    } catch (error) {
      console.error("Error adding donor:", error);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Register as Donor</h2>

      {success && (
        <div className="bg-green-100 text-green-800 p-2 rounded mb-4">
          ✅ Donor successfully registered!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />

        <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className="border p-2 w-full rounded" required>
          <option value="">Select Blood Group</option>
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>

        <select name="upazila" value={form.upazila} onChange={handleChange} className="border p-2 w-full rounded" required>
          <option value="">Select Upazila</option>
          {Object.keys(areaData).map(area => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>

        {form.upazila && (
          <select name="union" value={form.union} onChange={handleChange} className="border p-2 w-full rounded" required>
            <option value="">Select Union</option>
            {areaData[form.upazila].map(union => (
              <option key={union} value={union}>{union}</option>
            ))}
          </select>
        )}

        <input
          type="text"
          name="village"
          value={form.village}
          onChange={handleChange}
          placeholder="Village name"
          className="border p-2 w-full rounded"
          required
        />


        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />

        <input
          type="date"
          name="lastDonateDate"
          value={form.lastDonateDate}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
        >
          Register Donor
        </button>
      </form>
    </div>
  );
}
