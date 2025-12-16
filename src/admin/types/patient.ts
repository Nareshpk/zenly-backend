export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email?: string;
  address: string;
  bloodGroup: string;
  createdAt: string;
}
