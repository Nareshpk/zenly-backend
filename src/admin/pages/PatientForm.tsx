import React, { useEffect, useState } from "react";
import { Patient } from "../types/patient";

interface Props {
  onSave: (patient: Patient) => void;
  selectedPatient?: Patient | null;
}

const PatientForm: React.FC<Props> = ({ onSave, selectedPatient }) => {
  const [form, setForm] = useState<Patient>({
    id: "",
    name: "",
    age: 0,
    gender: "Male",
    phone: "",
    email: "",
    address: "",
    bloodGroup: "",
    createdAt: "",
  });

  useEffect(() => {
    if (selectedPatient) {
      setForm(selectedPatient);
    }
  }, [selectedPatient]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.phone) {
      alert("Name and Phone required");
      return;
    }

    onSave({
      ...form,
      id: form.id || crypto.randomUUID(),
      createdAt: form.createdAt || new Date().toISOString(),
    });

    setForm({
      id: "",
      name: "",
      age: 0,
      gender: "Male",
      phone: "",
      email: "",
      address: "",
      bloodGroup: "",
      createdAt: "",
    });
  };

  return (
    <div style={{ padding: 16, border: "1px solid #ccc", borderRadius: 8 }}>
      <h3>{selectedPatient ? "Edit Patient" : "Add Patient"}</h3>

      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} />

      <select name="gender" value={form.gender} onChange={handleChange}>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>

      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input name="bloodGroup" placeholder="Blood Group" value={form.bloodGroup} onChange={handleChange} />
      <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />

      <br />
      <button onClick={handleSubmit}>
        {selectedPatient ? "Update" : "Save"}
      </button>
    </div>
  );
};

export default PatientForm;
