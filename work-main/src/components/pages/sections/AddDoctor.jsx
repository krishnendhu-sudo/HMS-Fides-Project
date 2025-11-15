// src/components/AddDoctor.jsx
import React, { useState, useEffect } from "react";
import { FaUpload, FaChevronDown } from "react-icons/fa";
import Select from "react-select";
import ISO6391 from "iso-639-1";
import { FaFileUpload, FaTrashAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";

export default function AddDoctor() {
  const [showDays, setShowDays] = useState(false);
  const [showTeleconsultation, setShowTeleconsultation] = useState(false);
  const [showOnCall, setShowOnCall] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const languagesList = ISO6391.getAllNames().map((lang) => ({
    value: lang,
    label: lang,
  }));

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    company_id: "",
    fullName: "",
    gender: "",
    dob: "",
    registrationNo: "",
    bloodGroup: "",
    age: "",
    contactNumber: "",
    education: "",
    email: "",
    address: "",
    profilePhoto: [],
    specialization: "",
    licenseNo: "",
    issuingCouncil: "",
    consultationFee: "",
    languages: [],
    certifications: [],
    years: "",
    previous: "",
    Designation: "",
    Duration: "",

    awards: "",
    experienceCertificate: [],
    password: "",
    staticIP: "",

    availableDays: {
      Mon: { active: false, am: false, pm: false },
      Tue: { active: false, am: false, pm: false },
      Wed: { active: false, am: false, pm: false },
      Thurs: { active: false, am: false, pm: false },
      Fri: { active: false, am: false, pm: false },
      Sat: { active: false, am: false, pm: false },
    },
    teleconsultationDays: {
      Mon: { active: false, am: false, pm: false },
      Tue: { active: false, am: false, pm: false },
      Wed: { active: false, am: false, pm: false },
      Thurs: { active: false, am: false, pm: false },
      Fri: { active: false, am: false, pm: false },
      Sat: { active: false, am: false, pm: false },
    },
    onCallDays: {
      Mon: { active: false, am: false, pm: false },
      Tue: { active: false, am: false, pm: false },
      Wed: { active: false, am: false, pm: false },
      Thurs: { active: false, am: false, pm: false },
      Fri: { active: false, am: false, pm: false },
      Sat: { active: false, am: false, pm: false },
    },
  });

  const { mode, id } = useParams(); // mode = "add" | "edit" | "view"

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      // Fetch doctor data by ID
      const fetchDoctor = async () => {
        try {
          const res = await fetch(`http://127.0.0.1:8000/doctors/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ add this
            },
          });
          if (!res.ok) throw new Error("Failed to fetch doctor");
          const data = await res.json();
          setFormData({
            ...formData,
            ...data,
            fullName: data.user?.name,
            contactNumber: data.user?.phone,
            email: data.user?.email,
            profilePhoto: data.user?.photo || null,
            gender: data.user?.gender,
            dob: data.user?.dob,
            registrationNo: data.registration_no,
            bloodGroup: data.user?.blood_group,
            education: data.user?.education,
            age: data.user?.age,
            address: data.user?.address,
            password: data.user?.password,
            specialization: data.specialization,
            certifications: data.certifications || [],
            experienceCertificate: data.experience_certificate || [],
            licenseNo: data.license_no,
            issuingCouncil: data.issuing_council,
            consultationFee: data.consultation_fee,
            languages: data.languages
              ? data.languages.map((lang) => ({ label: lang, value: lang }))
              : [],
            staticIP: data.user?.staticIP,
            years: data.years_of_experience,
            previous: data.previous_employer,
            Designation: data.designation,
            Duration: data.duration,
            awards: data.awards,
            status: data.user?.is_active,
          });
        } catch (err) {
          console.error(err);
        }
      };
      fetchDoctor();
    }
  }, [mode, id]);

  const isReadOnly = mode === "view";
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    // Name
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      newErrors.fullName =
        "Name is required and should be at least 2 characters.";
    }

    // Gender
    if (!formData.gender) {
      newErrors.gender = "Gender is required.";
    }

    // Email
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "Invalid email address.";
    }

    // Contact/Phone
    if (!formData.contactNumber) {
      newErrors.contactNumber = "Contact number is required.";
    } else if (
      !/^\+?\d{0,4}?[-\s()]?\d{6,15}$/.test(
        formData.contactNumber.replace(/\s+/g, "")
      )
    ) {
      newErrors.contactNumber = "Phone must be 10–15 digits.";
    }

    // Certificates (optional but must be files)
    if (formData.certifications.some((file) => !(file instanceof File))) {
      newErrors.certifications = "Certificates must be valid files.";
    }

    // Profile Photo (optional but must be image)

    return newErrors;
  };

  const [companies, setCompanies] = useState([]);
  const fetchCompanies = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/companies/", {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ add this
        },
      });
      if (!response.ok) throw new Error("Failed to fetch companies");
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "certifications" || name === "experienceCertificate") {
      setFormData((prev) => ({
        ...prev,
        [name]: files ? [...prev[name], ...files] : prev[name],
      }));
      return;
    }

    if (name === "company_id") {
      setFormData({ ...formData, [name]: parseInt(value) });
    } else if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
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
    if (files) {
      // Only store the actual File object, not the path
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleToggle = () =>
    setFormData((prev) => ({ ...prev, status: !prev.status }));

  const removeCertificate = (index) => {
    const updatedFiles = formData.certifications.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, certifications: updatedFiles }));
  };

  const toggleTimeSlot = (section, day, field) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [day]: { ...prev[section][day], [field]: !prev[section][day][field] },
      },
    }));
  };

  const checkPasswordStrength = (password) => {
    if (password.length < 6) return "Weak";
    if (password.match(/[A-Z]/) && password.match(/[0-9]/)) return "Strong";
    return "Medium";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      alert("Please fix validation errors before submitting.");
      return;
    }

    // File upload helpers (same as before)
    // Upload a single file
    const uploadFile = async (file) => {
      if (!file) return null;

      const formData = new FormData();
      formData.append("file", file); // ✅ File object

      const res = await fetch("http://127.0.0.1:8000/patients/upload/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ add this
        },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Upload failed: ${res.status} ${text}`);
      }

      const data = await res.json();
      return data.file_path;
    };

    // Upload multiple files
    const uploadMultipleFiles = async (files) => {
      if (!files || files.length === 0) return [];
      const paths = [];

      for (let file of files) {
        const path = await uploadFile(file);
        if (path) paths.push(path);
      }

      return paths;
    };

    const uploadedProfile = await uploadFile(formData.profilePhoto);
    const uploadedCert = await uploadMultipleFiles(formData.certifications);
    const uploadedExpCert = await uploadMultipleFiles(
      formData.experienceCertificate
    );

    // Common payloads
    const userPayload = {
      company_id: parseInt(formData.company_id),
      name: formData.fullName,
      gender: formData.gender,
      dob: formData.dob,
      blood_group: formData.bloodGroup,
      age: formData.age,
      email: formData.email,
      phone: formData.contactNumber,
      education: formData.education,
      address: formData.address,
      staticIP: formData.staticIP,
      user_type: "doctor",
      is_active: formData.status,
      password: formData.password,
      photo: uploadedProfile,
    };

    const doctorPayload = {
      name: formData.fullName,
      registration_no: formData.registrationNo,
      specialization: formData.specialization,
      license_no: formData.licenseNo,
      issuing_council: formData.issuingCouncil,
      consultation_fee: parseInt(formData.consultationFee),
      languages: formData.languages.map((l) => l.label), // ✅ array of strings
      years_of_experience: formData.years,
      previous_employer: formData.previous,
      designation: formData.Designation,
      duration: formData.Duration,
      awards: formData.awards,
      certifications: uploadedCert,
      experience_certificate: uploadedExpCert,
      user: userPayload,
    };

    try {
      if (mode === "edit" && id) {
        // 🔄 Update existing doctor + user
        await fetch(`http://127.0.0.1:8000/users/${formData.user}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ add token here
          },
          body: JSON.stringify(userPayload),
        });

        const doctorRes = await fetch(`http://127.0.0.1:8000/doctors/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ add token here
          },
          body: JSON.stringify(doctorPayload),
        });

        if (!doctorRes.ok) throw new Error("Doctor update failed");
        alert("✅ Doctor updated successfully!");
      } else {
        // 🆕 Create new doctor + user
        const userRes = await fetch("http://127.0.0.1:8000/users/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ add token here
          },
          body: JSON.stringify(userPayload),
        });

        if (!userRes.ok)
          throw new Error(`User creation failed: ${userRes.status}`);
        const userData = await userRes.json();

        const doctorRes = await fetch("http://127.0.0.1:8000/doctors/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ add token here
          },
          body: JSON.stringify({ ...doctorPayload, user: userPayload }),
        });

        if (!doctorRes.ok)
          throw new Error(`Doctor creation failed: ${doctorRes.status}`);
        alert("✅ Doctor created successfully!");
        navigate("/doctors");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Failed to save doctor. Check console for details.");
    }
  };

  // Reusable days dropdown
  const DaysDropdown = ({ label, section, show, setShow }) => (
    <div className="relative">
      <label className="block text-1xl font-poppins text-gray-800 mb-1">
        {label}*
      </label>
      <div
        className="p-2 rounded-lg border w-1/2 h-10 flex items-center justify-between bg-white cursor-pointer"
        onClick={() => setShow(!show)}
      >
        <span>
          {Object.entries(formData[section] || {})
            .filter(([day, val]) => val.active)
            .map(
              ([day, val]) =>
                `${day} ${val.am ? "AM" : ""}${val.pm ? " PM" : ""}`
            )
            .join(", ") || "Select days"}
        </span>
        <FaChevronDown className="text-gray-500" />
      </div>
      {show && (
        <div className="absolute mt-2 bg-[D7EAEB#] border rounded-lg shadow-lg p-3 w-56 z-10">
          {Object.keys(formData[section]).map((day) => (
            <div key={day} className="flex items-center mb-2">
              <button
                type="button"
                onClick={() => toggleTimeSlot(section, day, "active")}
                className={`w-10 h-6 flex items-center rounded-full p-1 mr-2 transition ${
                  formData[section][day].active ? "bg-green-500" : "bg-black"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                    formData[section][day].active
                      ? "translate-x-4"
                      : "translate-x-0"
                  }`}
                />
              </button>
              <span className="mr-2 w-10">{day}</span>
              <label className="flex items-center mr-2">
                <input
                  type="checkbox"
                  checked={formData[section][day].am}
                  disabled={!formData[section][day].active}
                  onChange={() => toggleTimeSlot(section, day, "am")}
                  readOnly={isReadOnly}
                  className="mr-1"
                />
                <span className="text-sm">AM</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData[section][day].pm}
                  disabled={!formData[section][day].active}
                  onChange={() => toggleTimeSlot(section, day, "pm")}
                  readOnly={isReadOnly}
                  className="mr-1"
                />
                <span className="text-sm">PM</span>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-4xl font-bold">Add New Doctor</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Info */}
        <div className="bg-[#F7DACD] p-10 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Row 1: Company, Full Name, Gender, DOB */}
          <div>
            <label className="block mb-1 font-medium">Company</label>
            <select
              name="company_id"
              value={formData.company_id}
              onChange={handleChange}
              disabled={isReadOnly}
              className="w-full h-12 border p-3 rounded-lg"
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
            <label className="block mb-1 font-medium">Full Name*</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              readOnly={isReadOnly}
              className="w-full h-12 p-3 border rounded-lg"
            />
            {errors.fullName && (
              <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Gender*</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={isReadOnly}
              className="w-full h-12 border p-3 rounded-lg"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
              <option value="PreferNotToSay">PreferNotToSay</option>
            </select>
            {errors.gender && (
              <p className="text-red-600 text-sm mt-1">{errors.gender}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Date of Birth*</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              readOnly={isReadOnly}
              className="w-full h-12 p-3 border rounded-lg"
            />
          </div>

          {/* Row 2: Registration No, Blood Group, Age, Contact Number */}
          <div>
            <label className="block mb-1 font-medium">Registration No.*</label>
            <input
              type="text"
              name="registrationNo"
              value={formData.registrationNo}
              onChange={handleChange}
              readOnly={isReadOnly}
              className="w-full h-12 p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Blood Group*</label>
            <input
              type="text"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              readOnly={isReadOnly}
              className="w-full h-12 p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Age*</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              readOnly={isReadOnly}
              className="w-full h-12 p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Contact Number*</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              readOnly={isReadOnly}
              className="w-full h-12 p-3 border rounded-lg"
            />
            {errors.contactNumber && (
              <p className="text-red-600 text-sm mt-1">
                {errors.contactNumber}
              </p>
            )}
          </div>

          {/* Row 3: Education, Email, Address, Profile Photo */}
          <div>
            <label className="block mb-1 font-medium">
              Educational Qualification*
            </label>
            <input
              type="text"
              name="education"
              value={formData.education}
              onChange={handleChange}
              readOnly={isReadOnly}
              className="w-full h-12 p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email Address*</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              readOnly={isReadOnly}
              className="w-full h-12 p-3 border rounded-lg"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Address*</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              readOnly={isReadOnly}
              className="w-full h-12 p-3 border rounded-lg resize-none"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Profile Photo*</label>
            <label className="flex items-center justify-between w-full h-12 px-3 border rounded-lg text-sm text-gray-600 cursor-pointer bg-white hover:bg-gray-100">
              <span>Upload file</span>
              <FaUpload className="text-gray-500" />
              <input
                type="file"
                name="profilePhoto"
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={handleChange}
                className="hidden"
              />
            </label>
            {formData.profilePhoto && (
              <p className="mt-2 text-sm text-gray-600">
                {formData.profilePhoto.name}
              </p>
            )}
          </div>

          {/* Row 4: Password, Static IP, Status */}
          
          <div>
            <label className="block mb-1 font-medium">Password*</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                readOnly={isReadOnly}
                className="w-full h-12 p-3 border rounded-lg focus:ring-2 focus:ring-[#7E4363] outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {formData.password && (
              <p
                className={`mt-1 text-sm ${
                  checkPasswordStrength(formData.password) === "Strong"
                    ? "text-green-600"
                    : checkPasswordStrength(formData.password) === "Medium"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                Password Strength: {checkPasswordStrength(formData.password)}
              </p>
            )}
          </div>

          {/* Static IP */}
          <div>
            <label className="block mb-1 font-medium">Static IP</label>
            <input
              type="text"
              name="staticIP"
              value={formData.staticIP}
              onChange={handleChange}
              readOnly={isReadOnly}
              className="w-full h-12 p-3 border rounded-lg focus:ring-2 focus:ring-[#7E4363] outline-none"
            />
          </div>

          {/* Status Toggle */}
          <div>
            <label className="block mb-1 font-medium">Status</label>
            <button
              type="button"
              onClick={handleToggle}
              className={`relative inline-flex h-6 w-10 items-center rounded-full transition ${
                formData.status ? "bg-green-500" : "bg-gray-400"
              }`}
            >
              <span
                className={`inline-block h-3 w-3 transform rounded-full bg-white transition ${
                  formData.status ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`ml-3 text-sm font-medium ${
                formData.status ? "text-green-700" : "text-gray-600"
              }`}
            >
              {formData.status ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Professional Info */}
        <h2 className="text-4xl font-bold">Professional Information*</h2>
        <div className="bg-[#F7DACD] p-10 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-1xl font-poppins text-gray-800 mb-1">
              Specialization / Department*
            </label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              readOnly={isReadOnly}
              className="w-full h-12 p-2 rounded-lg border text-sm"
            />
          </div>

          {/* Medical Registration Number */}
          <div>
            <label className="block text-1xl font-poppins text-gray-800 mb-1">
              Medical Registration Number*
            </label>
            <input
              type="text"
              name="licenseNo"
              value={formData.licenseNo}
              onChange={handleChange}
              readOnly={isReadOnly}
              className="w-full h-12 p-2 rounded-lg border text-sm"
            />
          </div>

          {/* Issuing Medical Council */}
          <div>
            <label className="block text-1xl font-poppins text-gray-800 mb-1">
              Issuing Medical Council*
            </label>
            <input
              type="text"
              name="issuingCouncil"
              value={formData.issuingCouncil}
              onChange={handleChange}
              readOnly={isReadOnly}
              className="w-full h-12 p-2 rounded-lg border text-sm"
            />
          </div>

          {/* Consultation Fee */}
          <div>
            <label className="block text-1xl font-poppins text-gray-800 mb-1">
              Consultation Fee*
            </label>
            <input
              type="text"
              name="consultationFee"
              value={formData.consultationFee}
              onChange={handleChange}
              readOnly={isReadOnly}
              className="w-full h-12 p-2 rounded-lg border text-sm"
            />
          </div>

          {/* Languages Spoken */}
          <div>
            <label className="block text-1xl font-poppins text-gray-800 mb-1">
              Languages Spoken*
            </label>
            <Select
              isMulti
              name="languages"
              options={languagesList}
              className="w-full text-sm"
              classNamePrefix="select"
              value={formData.languages}
              onChange={(selected) =>
                setFormData({ ...formData, languages: selected })
              }
              disabled={isReadOnly}
              placeholder="Select languages..."
            />
          </div>

          {/* Certifications (BLS/ACLS, etc.) */}
          <div>
            <label className="block text-1xl font-poppins text-gray-800 mb-1">
              Certifications (BLS/ACLS, etc.)*
            </label>
            <label className="flex items-center justify-between w-full h-12 px-3 border rounded text-sm text-gray-600 cursor-pointer bg-white hover:bg-gray-100">
              <span>Upload file</span>
              <FaUpload className="text-gray-500" />
              <input
                type="file"
                name="certifications"
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={handleChange}
                readOnly={isReadOnly}
                className="hidden"
              />
            </label>
            {/* Certifications list */}
            <div className="mt-2 space-y-1">
              {formData.certifications &&
                Array.from(formData.certifications).map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                  >
                    <span className="truncate text-sm text-gray-700">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updatedFiles = Array.from(
                          formData.certifications
                        ).filter((_, i) => i !== index);
                        setFormData((prev) => ({
                          ...prev,
                          certifications: updatedFiles,
                        }));
                      }}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Work Experience */}
        <h2 className="text-4xl font-bold">Work Experience*</h2>
        <div className="bg-[#F7DACD] p-10 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Years of Experience */}
          <div>
            <label className="block text-1xl font-poppins text-gray-800 mb-1">
              Total Years of Experience*
            </label>
            <input
              type="text"
              name="years"
              value={formData.years}
              onChange={handleChange}
              readOnly={isReadOnly}
              className="w-full h-12 p-2 rounded-lg border text-sm"
            />
          </div>

          {/* Previous Hospital / Organization */}
          <div>
            <label className="block text-1xl font-poppins text-gray-800 mb-1">
              Previous Hospital / Organization*
            </label>
            <input
              type="text"
              name="previous"
              value={formData.previous}
              onChange={handleChange}
              readOnly={isReadOnly}
              className="w-full h-12 p-2 rounded-lg border text-sm"
            />
          </div>

          {/* Designation Held */}
          <div>
            <label className="block text-1xl font-poppins text-gray-800 mb-1">
              Designation Held*
            </label>
            <input
              type="text"
              name="Designation"
              value={formData.Designation}
              onChange={handleChange}
              readOnly={isReadOnly}
              className="w-full h-12 p-2 rounded-lg border text-sm"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-1xl font-poppins text-gray-800 mb-1">
              Duration*
            </label>
            <input
              type="text"
              name="Duration"
              value={formData.Duration}
              onChange={handleChange}
              readOnly={isReadOnly}
              className="w-full h-12 p-2 rounded-lg border text-sm"
            />
          </div>

          {/* Awards / Recognitions */}
          <div>
            <label className="block text-1xl font-poppins text-gray-800 mb-1">
              Awards / Recognitions*
            </label>
            <input
              type="text"
              name="awards"
              value={formData.awards}
              onChange={handleChange}
              readOnly={isReadOnly}
              className="w-full h-12 p-2 rounded-lg border text-sm"
            />
          </div>

          {/* Upload Experience Certificate */}
          <div>
            <label className="block text-1xl font-poppins text-gray-800 mb-1">
              Upload Experience Certificate*
            </label>
            <label className="flex items-center justify-between w-full h-12 px-3 border rounded text-sm text-gray-600 cursor-pointer bg-white hover:bg-gray-100">
              <span>Upload file</span>
              <FaUpload className="text-gray-500" />
              <input
                type="file"
                name="experienceCertificate"
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={handleChange}
                readOnly={isReadOnly}
                className="hidden"
              />
            </label>
            {/* Uploaded Files */}
            <div className="mt-2 space-y-1">
              {formData.experienceCertificate &&
                Array.from(formData.experienceCertificate).map(
                  (file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                    >
                      <span className="truncate text-sm text-gray-700">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedFiles = Array.from(
                            formData.experienceCertificate
                          ).filter((_, i) => i !== index);
                          setFormData((prev) => ({
                            ...prev,
                            experienceCertificate: updatedFiles,
                          }));
                        }}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  )
                )}
            </div>
          </div>
        </div>

        {/* Availability */}
        <h2 className="text-4xl font-bold">Availability*</h2>
        <div className="bg-[#F7DACD] p-10 h-40 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4">
          <DaysDropdown
            label="Available Days"
            section="availableDays"
            show={showDays}
            setShow={setShowDays}
          />
          <DaysDropdown
            label="Teleconsultation Availability"
            section="teleconsultationDays"
            show={showTeleconsultation}
            setShow={setShowTeleconsultation}
          />
          <DaysDropdown
            label="On-Call Availability"
            section="onCallDays"
            show={showOnCall}
            setShow={setShowOnCall}
          />
        </div>

        {/* Submit */}
        <div className="flex flex-col items-center gap-4">
          <button
            type="submit"
            className="px-48 py-5 bg-[#2FD770] text-white rounded hover:bg-green-600"
          >
            SUBMIT
          </button>
          <button
            type="button"
            className="px-48 py-5 bg-[#FF0202] text-white rounded hover:bg-red-600"
          >
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
}
