import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const AddCompany = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const existingCompany = location.state?.company || null;
  const viewOnly = location.state?.viewOnly || false;

  const [formData, setFormData] = useState({
    name: existingCompany?.name || "",
    address: existingCompany?.address || "",
    logo: existingCompany?.logo || null,
    website: existingCompany?.website || "",
    email: existingCompany?.email || "",
    phone: existingCompany?.phone || "",
    abbreviation: existingCompany?.abbreviation || "",
    admin: existingCompany?.admin || "",
    status: existingCompany?.status || "INACTIVE",
    gstnumber: existingCompany?.gstnumber || "",
  });

  const [logoPreview, setLogoPreview] = useState(existingCompany?.logo || null);
  const [errors, setErrors] = useState({});

  const isEdit = !!existingCompany && !viewOnly;

  const { id } = useParams();
useEffect(() => {
  if (id) {
    fetch(`http://127.0.0.1:8000/companies/${id}`)
      .then(res => res.json())
      .then(data => {
        setFormData(data);
        if (data.logo) setLogoPreview(data.logo);
      });
  }
}, [id]);


  useEffect(() => {
    if (existingCompany) {
      setFormData(existingCompany);
      if (existingCompany.logo) setLogoPreview(existingCompany.logo);
    }
  }, [existingCompany]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "abbreviation") {
      const cleanValue = value.replace(/[^a-zA-Z0-9]/g, "");
      setFormData((prev) => ({ ...prev, abbreviation: cleanValue }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle logo upload
  const handleLogoChange = (e) => {
    if (viewOnly) return;
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, logo: file }));
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Toggle active/inactive
  const handleToggle = () => {
    if (viewOnly) return;
    setFormData((prev) => ({
      ...prev,
      status: prev.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
    }));
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

if (!formData.phone) {
  newErrors.phone = "Phone number is required";
} else if (!/^\+?\d{0,4}?[-\s()]?\d{6,15}$/.test(formData.phone.replace(/\s+/g, ""))) {
  newErrors.phone = "Enter a valid phone number (with optional +country code, spaces, or dashes)";
}


    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email))
      newErrors.email = "Invalid email address";

    if (formData.website) {
      try {
        new URL(formData.website);
      } catch {
        newErrors.website = "Invalid website URL";
      }
    }

    return newErrors;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (viewOnly) return;

    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      alert("Please fix validation errors before submitting!");
      return;
    }

    let logoPath = formData.logo;

    // Upload logo if it's a File
    if (formData.logo && typeof formData.logo !== "string") {
      const fd = new FormData();
      fd.append("file", formData.logo);
      const uploadRes = await fetch("http://127.0.0.1:8000/patients/upload/", {
        method: "POST",
        body: fd,
      });
      if (uploadRes.ok) {
        const data = await uploadRes.json();
        logoPath = data.file_path;
      }
    }

    const payload = { ...formData, logo: logoPath };

    try {
      const url = existingCompany
        ? `http://127.0.0.1:8000/companies/${existingCompany.id}`
        : "http://127.0.0.1:8000/companies/";
      const method = existingCompany ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to submit");

      await response.json();
      alert(existingCompany ? "✅Company updated!" : "Company created!");
      navigate("/CompanyPage");
    } catch (err) {
      console.error(err);
      alert("Failed to submit form");
    }
  };

  return (
    <div className="p-6 min-h-screen flex flex-col bg-gray-50">
      <h2 className="text-4xl font-semibold mb-8 text-gray-800">
        {viewOnly
          ? "View Company"
          : existingCompany
          ? "Edit Company"
          : "Add New Company"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-[#F7DACD] p-8 rounded-xl shadow-md w-full max-w-8xl space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-gray-600 mb-1">Company Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={viewOnly}
                className="w-full border rounded-lg p-2"
                required
              />
            </div>

            {/* Logo */}
<div>
  <label className="block text-gray-600 mb-1">Company Logo</label>

  <div className="flex items-center border rounded-lg p-2 cursor-pointer bg-white">
    {!viewOnly ? (
      <input
        type="file"
        accept="image/*"
        onChange={handleLogoChange}
        className="w-full outline-none"
      />
    ) : (
      logoPreview && (
        <img
          src={logoPreview}
          alt="Logo Preview"
          className="h-16 w-16 object-cover rounded-full border mt-2"
        />
      )
    )}
  </div>
</div>

          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-600 mb-1">Address*</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={viewOnly}
              className="w-full border rounded-lg p-2"
              rows="5"
              required
            />
          </div>
        </div>

        {/* Row 2: Website, Phone, Email */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-600 mb-1">Phone*</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={viewOnly}
              className="w-full border rounded-lg p-2"
              required
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Email*</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={viewOnly}
              className="w-full border rounded-lg p-2"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Website</label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              disabled={viewOnly}
              className="w-full border rounded-lg p-2"
            />
            {errors.website && (
              <p className="text-red-500 text-sm">{errors.website}</p>
            )}
          </div>
        </div>

        {/* Row 3: Admin, Abbreviation, GST, Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div>
            <label className="block text-gray-600 mb-1">Admin*</label>
            <select disabled
              name="admin"
              value={formData.admin}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            >
              <option value="">Select Admin</option>
              <option value="John Doe">John Doe</option>
              <option value="Sarah Lee">Sarah Lee</option>
              <option value="Amit Kumar">Amit Kumar</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Abbreviation*</label>
            <input
              type="text"
              name="abbreviation"
              value={formData.abbreviation}
              onChange={handleChange}
              disabled={viewOnly}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">GST Number</label>
            <input
              type="text"
              name="gstnumber"
              value={formData.gstnumber}
              onChange={handleChange}
              disabled={viewOnly}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col ">
            <label className="block text-gray-700  mb-1">
              Status
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.status === "ACTIVE"}
                disabled={viewOnly}
                onChange={() =>
                  setFormData((prev) => ({
                    ...prev,
                    status: prev.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                  }))
                }
              />
              <div
                className={`relative w-11 h-6 bg-gray-200 rounded-full peer-focus:ring-2 peer-focus:ring-[#7E4363]
        peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px]
        after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
        peer-checked:bg-[#7E4363]
        ${viewOnly ? "opacity-50 cursor-not-allowed" : ""}`}
              ></div>
              <span className="ml-2 text-sm text-gray-700">
                {formData.status === "ACTIVE" ? "Active" : "Inactive"}
              </span>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-6 space-x-4">
          <button
            type="button"
            onClick={() => navigate("/CompanyPage")}
            className="px-4 py-2 border bg-[#7E4363] rounded-lg text-white hover:bg-gray-100"
          >
            Cancel
          </button>
          {!viewOnly && (
            <button
              type="submit"
              className="px-4 py-2 bg-[#7E4363] text-white rounded-lg hover:bg-[#9b5778]"
            >
              {existingCompany ? "Update" : "Save"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddCompany;