import { Timestamp } from "firebase/firestore";

export type Donor = {
  id: string;
  name: string;
  bloodGroup: string;
  upazila: string;
  union: string;
  village: string;
  phone: string;
  lastDonateDate?: string | Timestamp; // Firebase Timestamp বা string
};
