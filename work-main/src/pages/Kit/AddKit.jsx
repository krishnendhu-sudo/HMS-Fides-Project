import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

export default function AddKit() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company_id: "",
    companyName : "",
    kitId: "",
    kitName: "",
    reason: "",
  });

  const [medicines, setMedicines] = useState([]);
  const [medicineForm, setMedicineForm] = useState({
    medicine_id: "",
    dosage: "",
    frequency: "",
    duration: "",
    route: "",
    medQuantity: "",
  });

  const [companies, setCompanies] = useState([]);
  const [availableMedicines, setAvailableMedicines] = useState([]);

  // ✅ Fetch companies and medicines on component mount
  useEffect(() => {
  const token = localStorage.getItem("token");

  fetch("http://127.0.0.1:8000/companies", {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  })
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data)) setCompanies(data);
      else setCompanies([]);
    })
    .catch((err) => {
      console.error("Failed to fetch companies:", err);
      setCompanies([]);
    });

  fetch("http://127.0.0.1:8000/medicines", {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  })
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data)) setAvailableMedicines(data);
      else setAvailableMedicines([]);
    })
    .catch((err) => {
      console.error("Failed to fetch medicines:", err);
      setAvailableMedicines([]);
    });
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMedicineChange = (e) => {
    const { name, value } = e.target;
    setMedicineForm({ ...medicineForm, [name]: value });
  };

  const handleAddMedicine = () => {
    const requiredFields = [
      "medicine_id",
      "dosage",
      "frequency",
      "duration",
      "route",
      "medQuantity",
    ];
    for (let field of requiredFields) {
      if (!medicineForm[field]) {
        alert("Please fill all medicine fields before adding!");
        return;
      }
    }

    setMedicines([...medicines, medicineForm]);
    setMedicineForm({
      medicine_id: "",
      dosage: "",
      frequency: "",
      duration: "",
      route: "",
      medQuantity: "",

    });
  };

  const handleDeleteMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
  if (!formData.company_id || !formData.kitId || !formData.kitName || !formData.reason) {
    alert("Please fill all kit details!");
    return;
  }
  if (medicines.length === 0) {
    alert("Please add minimum two medicine!");
    return;
  }

  // Add medicine names from availableMedicines
  const medicinesWithNames = medicines.map((med) => {
    const medObj = availableMedicines.find(
      (m) => m.id === parseInt(med.medicine_id)
    );
    return {
      ...med,
      name: medObj?.name || "", // add name field
    };
  });

  const payload = {
    ...formData,
    medicines: medicinesWithNames,
  };

  try {
    const token = localStorage.getItem("token");
    const res = await fetch("http://127.0.0.1:8000/kits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    console.log("Saved Kit:", data);
    alert("Kit and medicines saved successfully!");
    navigate("/kitpage");
  } catch (err) {
    console.error("Save error:", err);
    alert("Failed to save kit: " + err.message);
  }
};


  const handleCancel = () => navigate("/kitpage");

  return (
    <div className="max-w-8xl mx-auto p-8 mt-10">
      <h2 className="text-3xl font-bold mb-6">Add New Medicine Kit</h2>

      {/* Kit Info */}
      <div className="bg-[#F7DACD] p-6 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p>Company</p>
          <select
            name="company_id"
            value={formData.company_id}
            onChange={handleChange}
            className="w-full p-2 rounded"
          >
            <option value="">Select Company</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p>Kit ID</p>
          <input
            name="kitId"
            value={formData.kitId}
            onChange={handleChange}
            placeholder="Kit ID"
            className="w-full p-2 rounded"
          />
        </div>
        <div>
          <p>Kit Name</p>
          <input
            name="kitName"
            value={formData.kitName}
            onChange={handleChange}
            placeholder="Kit Name"
            className="w-full p-2 rounded"
          />
        </div>
        <div>
          <p>Reason</p>
          <input
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Reason"
            className="w-full p-2 rounded"
          />
        </div>
      </div>

      {/* Medicine Inputs */}
      <div className="bg-[#F7DACD] p-6 mt-6 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <p>Medicine</p>
          <select
            name="medicine_id"
            value={medicineForm.medicine_id}
            onChange={handleMedicineChange}
            className="w-full p-2 rounded"
          >
            <option value="">Select Medicine</option>
            {availableMedicines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p>Dosage</p>
          <input
            name="dosage"
            value={medicineForm.dosage}
            onChange={handleMedicineChange}
            className="w-full p-2 rounded"
          />
        </div>
        <div>
          <p>Frequency</p>
          <input
            name="frequency"
            value={medicineForm.frequency}
            onChange={handleMedicineChange}
            className="w-full p-2 rounded"
          />
        </div>
        <div>
          <p>Duration</p>
          <input
            name="duration"
            value={medicineForm.duration}
            onChange={handleMedicineChange}
            className="w-full p-2 rounded"
          />
        </div>
        <div>
          <p>Route</p>
          <input
            name="route"
            value={medicineForm.route}
            onChange={handleMedicineChange}
            className="w-full p-2 rounded"
          />
        </div>
        <div>
          <p>Quantity</p>
          <input
            name="medQuantity"
            type="number"
            value={medicineForm.medQuantity}
            onChange={handleMedicineChange}
            className="w-full p-2 rounded"
          />
        </div>

      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-4">
        <button onClick={handleAddMedicine} className="bg-gray-500 text-white px-6 py-2 rounded">
          Add Medicine
        </button>
        <button onClick={handleSave} className="bg-green-600 text-white px-6 py-2 rounded">
          Save Kit
        </button>
        <button onClick={handleCancel} className="bg-red-600 text-white px-6 py-2 rounded">
          Cancel
        </button>
      </div>

      {/* Medicine Table */}
      {medicines.length > 0 && (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full border border-gray-300 rounded">
            <thead className="bg-black text-white">
              <tr>
                {["Medicine", "Dosage", "Frequency", "Duration", "Route", "Quantity", "Start", "End", "Action"].map((h) => (
                  <th key={h} className="px-2 py-1">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {medicines.map((med, idx) => {
                const medObj = availableMedicines.find((m) => m.id === parseInt(med.medicine_id));
                return (
                  <tr key={idx} className="bg-white border-b">
                    <td className="px-2 py-1">{medObj?.name}</td>
                    <td className="px-2 py-1">{med.dosage}</td>
                    <td className="px-2 py-1">{med.frequency}</td>
                    <td className="px-2 py-1">{med.duration}</td>
                    <td className="px-2 py-1">{med.route}</td>
                    <td className="px-2 py-1">{med.medQuantity}</td>
                    <td className="px-2 py-1 text-center">
                      <button onClick={() => handleDeleteMedicine(idx)} className="text-red-600 hover:text-red-800">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
