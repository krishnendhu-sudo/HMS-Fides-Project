// EditPrescription.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditPrescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    prescriptionId: id,
    patientName: "John Doe",
    date: "2025-09-17",
    doctor: "Dr. Smith",
    status: "Unpaid",
    medicineStatus: "Available",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Updated Data:", formData);
    navigate("/");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Prescription</h1>

      <form className="grid gap-4 bg-gray-100 p-6 rounded-lg shadow">
        <label>
          Prescription ID
          <input type="text" name="prescriptionId" value={formData.prescriptionId} disabled className="w-full p-2 border rounded" />
        </label>

        <label>
          Patient Name
          <input type="text" name="patientName" value={formData.patientName} onChange={handleChange} className="w-full p-2 border rounded" />
        </label>

        <label>
          Date
          <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 border rounded" />
        </label>

        <label>
          Doctor Name
          <input type="text" name="doctor" value={formData.doctor} onChange={handleChange} className="w-full p-2 border rounded" />
        </label>

        <label>
          Payment Status
          <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded">
            <option>Unpaid</option>
            <option>Paid</option>
          </select>
        </label>

        <label>
          Medicine Availability
          <select name="medicineStatus" value={formData.medicineStatus} onChange={handleChange} className="w-full p-2 border rounded">
            <option>Available</option>
            <option>Out of Stock (Buy from another shop)</option>
          </select>
        </label>

        <div className="flex justify-between mt-4">
          <button type="button" onClick={() => navigate(-1)} className="bg-gray-400 text-white px-4 py-2 rounded">
            Cancel
          </button>
          <button type="button" onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPrescription;
