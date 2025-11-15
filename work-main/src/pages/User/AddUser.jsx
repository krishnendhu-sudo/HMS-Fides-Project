import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaFileUpload, FaTrashAlt, FaEye, FaEyeSlash } from "react-icons/fa";

const AddUser = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userData = location.state?.user || null;
  const mode = location.state?.mode || "add";        
  const readOnly = mode === "view";
  const token = localStorage.getItem("token");

  const [userType, setUserType] = useState(userData?.user_type || "");
  const [showPassword, setShowPassword] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [errors, setErrors] = useState({});

  // 🔹 Initialize form state
  const [formData, setFormData] = useState({
    name: userData?.name || "",
    gender: userData?.gender || "",
    dob: userData?.dob || "",
    age: userData?.age || "",
    bloodGroup: userData?.blood_group || "",
    contact: userData?.phone || "",
    email: userData?.email || "",
    address: userData?.address || "",
    company: userData?.company_id || "",
    education: userData?.education || "",
    certificates: userData?.certificates || [],
    photo: userData?.photo || null,
    password: "",
    staticIP: userData?.staticIP || "",
    status: !!userData?.is_active,
  });

  // 🔹 Fetch companies dynamically
  useEffect(() => {
  const fetchCompanies = async () => {
    const token = localStorage.getItem("token"); // make sure token exists
    if (!token) return console.error("No auth token found");

    try {
      const res = await fetch("http://127.0.0.1:8000/companies/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch companies");

      const data = await res.json();

      if (!Array.isArray(data)) throw new Error("Companies response is not an array");

      setCompanies(data);
    } catch (err) {
      console.error("Error fetching companies:", err);
      setCompanies([]); // fallback to empty array
    }
  };

  fetchCompanies();
}, []);


  // 🔹 Update form when userData changes (for edit/view)
  useEffect(() => {
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        ...userData,
        bloodGroup: userData.blood_group || "",
        contact: userData.phone || "",
        company: userData.company_id || "",
        status: !!userData.is_active,
      }));
      setUserType(userData.user_type || "");
    }
  }, [userData]);

  // 🔹 Validation logic
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.gender) newErrors.gender = "Gender is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email))
      newErrors.email = "Invalid email format.";

    if (!formData.contact) {
      newErrors.contact = "Phone number is required";
    } else if (!/^\+?\d{0,4}?[-\s()]?\d{6,15}$/.test(formData.contact.replace(/\s+/g, ""))) {
      newErrors.contact = "Enter a valid phone number (with optional +country code, spaces, or dashes)";
    }


    if (!formData.company) newErrors.company = "Please select a company.";

    return newErrors;
  };

  // 🔹 Handle inputs
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "dob") {
      const dob = new Date(value);
      const now = new Date();
      let age = now.getFullYear() - dob.getFullYear();
      const m = now.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
      setFormData((prev) => ({
        ...prev,
        dob: value,
        age: age >= 0 ? age : "",
      }));
      return;
    }

    if (name === "photo") {
      setFormData((prev) => ({ ...prev, photo: files[0] }));
      return;
    }

    if (name === "certificates") {
      setFormData((prev) => ({
        ...prev,
        certificates: [...prev.certificates, ...files],
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleStatus = () =>
    !readOnly && setFormData((prev) => ({ ...prev, status: !prev.status }));

  const removeCertificate = (index) => {
    setFormData((prev) => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index),
    }));
  };

  const checkPasswordStrength = (password) => {
    if (password.length < 6) return "Weak";
    if (password.match(/[A-Z]/) && password.match(/[0-9]/)) return "Strong";
    return "Medium";
  };

  // 🔹 Submit logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      alert("Please fix validation errors.");
      return;
    }

    const uploadFile = async (file) => {
      if (!file) return null;
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("http://127.0.0.1:8000/patients/upload/", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      return data.file_path;
    };

    let photoPath = formData.photo;
    if (formData.photo instanceof File)
      photoPath = await uploadFile(formData.photo);

    const certPaths = [];
    for (const file of formData.certificates || []) {
      if (file instanceof File) {
        const p = await uploadFile(file);
        if (p) certPaths.push(p);
      } else {
        certPaths.push(file);
      }
    }

    const payload = {
      name: formData.name,
      gender: formData.gender,
      dob: formData.dob,
      age: parseInt(formData.age) || null,
      blood_group: formData.bloodGroup,
      phone: formData.contact,
      email: formData.email,
      address: formData.address,
      education: formData.education,
      certificates: certPaths,
      photo: photoPath,
      staticIP: formData.staticIP,
      is_active: formData.status,
      user_type: userType,
      password: formData.password || undefined,
      company_id: parseInt(formData.company),
    };

    const url =
      mode === "edit"
        ? `http://127.0.0.1:8000/users/${userData.id}`
        : "http://127.0.0.1:8000/users/";

    const method = mode === "edit" ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save user");
      alert(`✅ User ${mode === "edit" ? "updated" : "created"} successfully!`);
      navigate("/UserPage");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit form.");
    }
  };

  // 🔹 Handle user type change (redirect for doctors)
  const handleUserTypeChange = (e) => {
    const selected = e.target.value;
    setUserType(selected);
    if (selected === "doctor") navigate("/doctors/add");
  };

  // ✅ JSX layout
  return (
    <div className="p-6 max-w-8xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {mode === "edit"
          ? "Edit User"
          : mode === "view"
          ? "View User"
          : "Add User"}
      </h1>

      {/* Select user type (for Add mode) */}
      {mode === "add" && !userType && (
        <div className="mb-6 w-full md:w-1/2">
          <label className="block mb-2 font-semibold">Select User Type*</label>
          <select
            value={userType}
            onChange={handleUserTypeChange}
            disabled={readOnly}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#7E4363]"
          >
            <option value="">Select</option>
            <option value="admin">Admin</option>
            <option value="receptionist">Receptionist</option>
            <option value="optometrist">Optometrist</option>
            <option value="doctor">Doctor</option>
            <option value="pharmacist">Pharmacist</option>
            <option value="optician">Optician</option>
            <option value="counsellor">Counsellor</option>
            <option value="accountant">Accountant</option>
          </select>
        </div>
      )}
      
      {/* Badge for selected user type */}
      {userType && userType !== "Doctor" && (
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            {/* <h2 className="text-xl font-semibold text-gray-800">User Type:</h2> */}
            <span className="px-8 py-3 bg-[#7E4363] text-white rounded-full text-2xl font-medium shadow">
              {userType}
            </span>
          </div>
          <button
            onClick={() => setUserType("")}
            className="text-sm text-[#7E4363] underline hover:text-[#9b5778]"
          >
            Change User Type
          </button>
        </div>
      )}


      {userType && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#F7DACD] p-6 rounded-xl space-y-8"
        >
          {/* Company */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
  {/* Company */}
  <div>
    <label className="block mb-1 font-medium">Company*</label>
    <select
      name="company"
      value={formData.company}
      onChange={handleChange}
      disabled={readOnly}
      className="w-full border p-3 rounded-lg"
    >
      <option value="">Select Company</option>
      {companies.map(c => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>
    {errors.company && (
      <p className="text-red-500 text-sm mt-1">{errors.company}</p>
    )}
  </div>

  {/* Name */}
  <div>
    <label className="block mb-1 font-medium">Name*</label>
    <input
      type="text"
      name="name"
      value={formData.name}
      onChange={handleChange}
      readOnly={readOnly}
      className="w-full border p-3 rounded-lg"
    />
    {errors.name && (
      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
    )}
  </div>

  {/* Gender */}
  <div>
    <label className="block mb-1 font-medium">Gender*</label>
    <select
      name="gender"
      value={formData.gender}
      onChange={handleChange}
      disabled={readOnly}
      className="w-full border p-3 rounded-lg"
    >
      <option value="">Select</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Others">Others</option>
    </select>
    {errors.gender && (
      <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
    )}
  </div>

  {/* Date of Birth */}
  <div>
    <label className="block mb-1 font-medium">Date of Birth*</label>
    <input
      type="date"
      name="dob"
      value={formData.dob}
      onChange={handleChange}
      readOnly={readOnly}
      className="w-full border p-3 rounded-lg"
    />
  </div>

  {/* Age */}
  <div>
    <label className="block mb-1 font-medium">Age*</label>
    <input
      type="number"
      name="age"
      value={formData.age}
      onChange={handleChange}
      readOnly={readOnly}
      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#7E4363] outline-none"
    />
  </div>

  {/* Blood Group */}
  <div>
    <label className="block mb-1 font-medium">Blood Group</label>
    <input
      type="text"
      name="bloodGroup"
      value={formData.bloodGroup}
      onChange={handleChange}
      readOnly={readOnly}
      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#7E4363] outline-none"
    />
  </div>
</div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-6">
            <div className="space-y-6">
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  readOnly={readOnly} 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#7E4363] outline-none"
                />
                {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Contact Number*
                </label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  readOnly={readOnly} 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#7E4363] outline-none"
                />
                {errors.contact && (
                <p className="text-red-500 text-sm mt-1">{errors.contact}</p>
              )}
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                readOnly={readOnly} 
                rows="4"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#7E4363] outline-none"
              />
            </div>
          </div>

          {/* row 4 */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block mb-1 font-medium">
                Educational Qualification
              </label>
              <input
                type="text"
                name="education"
                value={formData.education}
                onChange={handleChange}
                readOnly={readOnly} 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#7E4363] outline-none"
              />
            </div>

            {/* Certificates Upload */}
            <div>
              <label className="block mb-1 font-medium">Certificates</label>
              <div className="flex items-center gap-2">
                <label className="flex items-center justify-center w-full p-3 border rounded-lg bg-white cursor-pointer hover:bg-gray-100">
                  <FaFileUpload className="mr-2 text-[#7E4363]" />
                  <span>Upload Files</span>
                  <input
                    type="file"
                    name="certificates"
                    multiple
                    onChange={handleChange}
                    readOnly={readOnly} 
                    className="hidden"
                  />
                </label>
              </div>
              {/* Show Uploaded Files */}
              <ul className="mt-2 space-y-1">
                {formData.certificates.map((file, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center text-sm bg-white px-3 py-1 rounded-lg"
                  >
                    {file.name}
                    <FaTrashAlt
                      className="text-red-500 cursor-pointer"
                      onClick={() => removeCertificate(index)}
                    />
                  </li>
                ))}
              </ul>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block mb-1 font-medium">Profile Photo</label>
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                readOnly={readOnly} 
                className="w-full p-2 border rounded-lg bg-white"
              />
            </div>
          </div>

          {/* row 5 */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center w-full">
  {/* Password */}
  <div>
    <label className="block mb-1 font-medium">Password*</label>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        name="password"
        value={formData.password}
        onChange={handleChange}
        readOnly={readOnly}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#7E4363] outline-none pr-10"
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
      readOnly={readOnly}
      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#7E4363] outline-none"
    />
  </div>

  {/* Status Toggle */}
  <div className="flex flex-col gap-2">
    <label className="font-medium">Status:</label>
    <button
      type="button"
      onClick={handleToggleStatus}
      disabled={readOnly}
      className={`relative inline-flex h-6 w-12 items-center rounded-full transition ${
        formData.status ? "bg-[#7E4363]" : "bg-gray-400"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
          formData.status ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
    <span
      className={`text-sm ${
        formData.status ? "text-[#7E4363]" : "text-gray-600"
      }`}
    >
      {formData.status ? "Active" : "Inactive"}
    </span>
  </div>

  {/* Buttons aligned to the right */}
  {!readOnly && (
    <div className="col-span-1 md:col-span-3 flex justify-end mt-6 space-x-4">
      <button
        type="button"
        onClick={() => navigate("/CompanyPage")}
        className="px-4 py-2 bg-[#7E4363] text-white rounded-lg transition"
      >
        Cancel
      </button>

      <button
        type="submit"
        className="px-4 py-2 bg-[#7E4363] text-white rounded-lg transition"
      >
        {userData ? "Update" : "Save"}
      </button>
    </div>
  )}
</div>

        </form>
      )}
    </div>
  );
};

export default AddUser;
