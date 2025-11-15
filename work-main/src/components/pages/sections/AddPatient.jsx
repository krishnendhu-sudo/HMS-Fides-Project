// src/components/AddPatient.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function AddPatient() {
  const location = useLocation();
  const { patient, mode } = location.state || {};
  const isView = mode === "view";
  const isEdit = mode === "edit";

  const [companies, setCompanies] = useState([]);
  const readOnly = mode === "view";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dob: "",
    age: "",
    bloodGroup: "",
    contactNumber: "",
    email: "",
    address: "",
    profilePhoto: null,
    emergencyContactNumber: "",
    emergencyContactPerson: "",
    knownAllergies: "",
    chronicIllnesses: "",
    pastMedicalHistory: "",
    currentMedications: "",
    familyDoctor: "",
    custom_id: "",
    aadhaar: "",
    city: "",
    state: "",
    pincode: "",
    company_id: "",
  });

  const [errors, setErrors] = useState({});

  const API_BASE = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000";

  useEffect(() => {
    if (patient) {
      setFormData({
        fullName: patient.name,
        gender: patient.gender,
        dob: patient.dob,
        age: patient.age,
        bloodGroup: patient.blood_group,
        contactNumber: patient.phone_number,
        email: patient.email_id,
        address: patient.address,
        familyDoctor: patient.reference_doctor,
        profilePhoto: patient.profilePhoto || null,
        emergencyContactNumber: patient.e_contact || "",
        emergencyContactPerson: patient.e_person || "",
        knownAllergies: patient.allergies || "",
        chronicIllnesses: patient.c_illness || "",
        pastMedicalHistory: patient.med_history || "",
        currentMedications: patient.currentMedications || "",
        custom_id: patient.custom_id || "",
        aadhaar: patient.aadhaar || "",
        city: patient.city || "",
        state: patient.state || "",
        pincode: patient.pincode || "",
        company_id: patient.company_id || "",
      });
    }
  }, [patient]);

  useEffect(() => {
  const fetchCompanies = async () => {
    try {
      const response = await fetch(`${API_BASE}/companies/`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});
      if (!response.ok) throw new Error("Failed to fetch companies");
      const data = await response.json();
      setCompanies(data);
    } catch (err) {
      console.error("Error fetching companies:", err);
      setError("Failed to load companies");
    }
  };

  fetchCompanies();
}, []);



  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData((s) => ({ ...s, [name]: files[0] }));
      return;
    }

    if (name === "dob") {
      let ageVal = "";
      if (value) {
        const dobDate = new Date(value);
        const now = new Date();
        let age = now.getFullYear() - dobDate.getFullYear();
        const m = now.getMonth() - dobDate.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < dobDate.getDate())) age--;
        ageVal = age >= 0 ? age.toString() : "";
      }
      setFormData((s) => ({ ...s, dob: value, age: ageVal }));
      return;
    }

    setFormData((s) => ({ ...s, [name]: value }));
  };

  const validateForm = () => {
  const newErrors = {};
  if (!formData.fullName || formData.fullName.trim().length < 2)
    newErrors.fullName = "Name is required and should be at least 2 characters.";
  if (!formData.gender) newErrors.gender = "Gender is required.";
  if (!formData.company_id) newErrors.company_id = "Company is required."; // ✅ Add this
  if (!formData.email) newErrors.email = "Email is required.";
  else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email))
    newErrors.email = "Invalid email address.";
  if (!formData.contactNumber) newErrors.contactNumber = "Contact number is required.";
  else if (!/^\d{10,15}$/.test(formData.contactNumber))
    newErrors.contactNumber = "Phone must be 10–15 digits.";
  return newErrors;
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setSuccess(null);

  const validationErrors = validateForm();
  setErrors(validationErrors);
  if (Object.keys(validationErrors).length > 0) {
    setLoading(false);
    return;
  }

  try {
    let uploadedPath = null;
    if (formData.profilePhoto instanceof File) {
      const uploadFd = new FormData();
      uploadFd.append("file", formData.profilePhoto);
      const uploadRes = await fetch(`${API_BASE}/patients/upload/`, { 
        method: "POST", 
        body: uploadFd 
      });
      if (!uploadRes.ok) throw new Error("Image upload failed");
      const uploadJson = await uploadRes.json();
      uploadedPath = uploadJson.file_path || uploadJson.file;
    }

    const payload = {
      name: formData.fullName,
      gender: formData.gender,
      dob: formData.dob,
      age: Number(formData.age),
      blood_group: formData.bloodGroup,
      phone_number: formData.contactNumber,
      email_id: formData.email,
      address: formData.address,
      reference_doctor: formData.familyDoctor,
      allergies: formData.knownAllergies,
      c_illness: formData.chronicIllnesses,
      med_history: formData.pastMedicalHistory,
      e_contact: formData.emergencyContactNumber,
      e_person: formData.emergencyContactPerson,
      aadhaar: formData.aadhaar,
      city: formData.city,
      state: formData.state,
      currentMedications: formData.currentMedications,
      pincode: formData.pincode,
      company_id: Number(formData.company_id), // ✅ Convert to integer
      // ❌ Remove company_name - not needed for creation
    };

    if (uploadedPath) payload.image = uploadedPath; // Use 'image' field

    const url = isEdit 
      ? `${API_BASE}/patients/${patient.id}` 
      : `${API_BASE}/patients/`;
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}` // Add auth
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.detail || `Server responded ${res.status}`);
    }
    
    const data = await res.json();
    setSuccess(isEdit ? "Patient updated successfully!" : "Patient created successfully!");
    
    // Optionally redirect after success
    // setTimeout(() => navigate('/patients'), 2000);
    
  } catch (err) {
    setError(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-4xl font-bold">Personal Details</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-[#CBDCEB] p-10 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
  <label className="block mb-1 font-medium">Company*</label>
  <select
    name="company_id"
    value={formData.company_id}
    onChange={handleChange}
    disabled={readOnly}
    className="w-full border p-3 rounded-lg"
  >
    <option value="">Select Company</option>
    {Array.isArray(companies) &&
      companies.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
  </select>
  {errors.company_id && (
    <p className="text-red-500 text-sm mt-1">{errors.company_id}</p>
  )}
</div>

          <div>
            <label>Full Name*</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} disabled={isView} className="p-2 rounded-lg border w-full"/>
            {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
          </div>
          <div>
            <label>Gender*</label>
            <select name="gender" value={formData.gender} onChange={handleChange} disabled={isView} className="p-2 rounded-lg border w-full">
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
            {errors.gender && <p className="text-red-600 text-sm mt-1">{errors.gender}</p>}
          </div>
          <div>
            <label>Date of Birth*</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} disabled={isView} className="p-2 rounded-lg border w-full"/>
          </div>
          <div>
            <label>Registration No.*</label>
            <input type="text" name="custom_id" value={formData.custom_id} disabled className="p-2 rounded-lg border w-full bg-gray-200"/>
          </div>
          <div>
            <label>Blood Group*</label>
            <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} disabled={isView} className="p-2 rounded-lg border w-full"/>
          </div>
          <div>
            <label>Age*</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} disabled={isView} className="p-2 rounded-lg border w-full"/>
          </div>
          <div>
            <label>Contact Number*</label>
            <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} disabled={isView} className="p-2 rounded-lg border w-full"/>
          </div>
          <div>
            <label>Profile Photo</label>
            <input type="file" name="profilePhoto" onChange={handleChange} disabled={isView} accept="image/*" className="p-2 rounded-lg border w-full"/>
          </div>
          <div>
            <label>Aadhaar*</label>
            <input type="text" name="aadhaar" value={formData.aadhaar} onChange={handleChange} disabled={isView} className="p-2 rounded-lg border w-full"/>
          </div>
          <div>
            <label>Email Address*</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={isView} className="p-2 rounded-lg border w-full"/>
          </div>
          <div>
            <label>Address*</label>
            <textarea name="address" value={formData.address} onChange={handleChange} disabled={isView} className="w-full h-20 p-2 rounded-lg border text-sm resize-none"/>
          </div>
          <div>
            <label>City</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} disabled={isView} className="p-2 rounded-lg border w-full"/>          </div>
          <div>
            <label>State</label>
            <input type="text" name="state" value={formData.state} onChange={handleChange} disabled={isView} className="p-2 rounded-lg border w-full"/>
          </div>
          <div>
            <label>Pincode</label>
            <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} disabled={isView} className="p-2 rounded-lg border w-full"/>
          </div>
        </div>

        <h2 className="text-4xl font-bold">Medical Information</h2>
        <div className="bg-[#CBDCEB] p-10 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label>Known Allergies</label>
            <input type="text" name="knownAllergies" value={formData.knownAllergies} onChange={handleChange} disabled={isView} className="w-60 h-10 p-2 rounded-lg border text-sm"/>
          </div>
          <div>
            <label>Chronic Illnesses</label>
            <input type="text" name="chronicIllnesses" value={formData.chronicIllnesses} onChange={handleChange} disabled={isView} className="w-60 h-10 p-2 rounded-lg border text-sm"/>
          </div>
          <div>
            <label>Past Medical History</label>
            <input type="text" name="pastMedicalHistory" value={formData.pastMedicalHistory} onChange={handleChange} disabled={isView} className="w-60 h-10 p-2 rounded-lg border text-sm"/>
          </div>
          <div>
            <label>Current Medications</label>
            <input type="text" name="currentMedications" value={formData.currentMedications} onChange={handleChange} disabled={isView} className="w-60 h-10 p-2 rounded-lg border text-sm"/>
          </div>
          <div>
            <label>Family Doctor / Referring Doctor</label>
            <input type="text" name="familyDoctor" value={formData.familyDoctor} onChange={handleChange} disabled={isView} className="w-60 h-10 p-2 rounded-lg border text-sm"/>
          </div>
          <div>
            <label>Emergency Contact No</label>
            <input type="text" name="emergencyContactNumber" value={formData.emergencyContactNumber} onChange={handleChange} disabled={isView} className="w-60 h-10 p-2 rounded-lg border text-sm"/>
          </div>
          <div>
            <label>Emergency Contact Person</label>
            <input type="text" name="emergencyContactPerson" value={formData.emergencyContactPerson} onChange={handleChange} disabled={isView} className="w-60 h-10 p-2 rounded-lg border text-sm"/>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          {error && <p className="text-red-600">{error}</p>}
          {success && <p className="text-green-600">{success}</p>}
          {!isView && (
            <button type="submit" disabled={loading} className={`px-48 py-5 ${loading ? 'bg-gray-400' : 'bg-[#2FD770]'} text-white rounded`}>
              {loading ? "Submitting..." : isEdit ? "UPDATE" : "SUBMIT"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
