import React, { useState } from "react";

const AddSupplierForm = () => {
  const [formData, setFormData] = useState({
    "Full Name": "",
    Gender: "",
    "Date of Birth*": "",
    "Registration No.*": "",
    "Blood Group*": "",
    "Age*": "",
    "Contact Number*": "",
    "Email Address*": "",
    "Address*": "",
    "Upload Aadhaar Card*": "",
    "Upload Driving License*": "",
  });

    const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false); // state for popup

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

    // Validate all fields
    Object.keys(formData).forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = "This field is required";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Show popup instead of alert
    setShowPopup(true);
  };

  // Handle cancel
  const handleCancel = () => {
    const resetData = {};
    Object.keys(formData).forEach((key) => (resetData[key] = ""));
    setFormData(resetData);
    setErrors({});
  };

  return (
    <div className="p-6 max-w-8xl mx-auto">
      <h1 className="text-3xl font-bold  mb-6">Add Supplier</h1>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-[#CBDCEB] p-10">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block font-medium">Full Name*</label>
            <input
              type="text"
              name="Full Name"
              value={formData["Full Name"]}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors["Full Name"] && (
              <p className="text-red-500 text-sm">{errors["Full Name"]}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Gender*</label>
            <select
              name="Gender"
              value={formData.Gender}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.Gender && (
              <p className="text-red-500 text-sm">{errors.Gender}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Date of Birth*</label>
            <input
              type="date"
              name="Date of Birth*"
              value={formData["Date of Birth*"]}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors["Date of Birth*"] && (
              <p className="text-red-500 text-sm">{errors["Date of Birth*"]}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Registration No.*</label>
            <input
              type="text"
              name="Registration No.*"
              value={formData["Registration No.*"]}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors["Registration No.*"] && (
              <p className="text-red-500 text-sm">
                {errors["Registration No.*"]}
              </p>
            )}
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block font-medium">Blood Group*</label>
            <input
              type="text"
              name="Blood Group*"
              value={formData["Blood Group*"]}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors["Blood Group*"] && (
              <p className="text-red-500 text-sm">{errors["Blood Group*"]}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Age*</label>
            <input
              type="number"
              name="Age*"
              value={formData["Age*"]}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors["Age*"] && (
              <p className="text-red-500 text-sm">{errors["Age*"]}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Contact Number*</label>
            <input
              type="text"
              name="Contact Number*"
              value={formData["Contact Number*"]}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors["Contact Number*"] && (
              <p className="text-red-500 text-sm">{errors["Contact Number*"]}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Email Address*</label>
            <input
              type="email"
              name="Email Address*"
              value={formData["Email Address*"]}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors["Email Address*"] && (
              <p className="text-red-500 text-sm">{errors["Email Address*"]}</p>
            )}
          </div>
        </div>

        {/* Row 3 - Single full width */}
        <div>
          <label className="block font-medium">Address*</label>
          <textarea
            name="Address*"
            value={formData["Address*"]}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            rows="3"
          />
          {errors["Address*"] && (
            <p className="text-red-500 text-sm">{errors["Address*"]}</p>
          )}
        </div>

       {/* Row 4 - Left side 2 file uploads */}
         {/* Row 4 - Left side 2 file uploads */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full md:w-1/2">
  {/* Aadhaar Card Upload */}
  <div>
    <label className="block font-medium mb-1">Upload Aadhaar Card*</label>
    <label className="flex flex-col items-center justify-center border border-gray-300 rounded-lg px-3 py-6 cursor-pointer bg-white hover:bg-gray-50 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 text-gray-400 mb-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v6m0 0l-3-3m3 3l3-3M12 4v8" />
      </svg>
      <span className="text-gray-500 text-sm">File upload (PDF/JPG/PNG)</span>
      <input
        type="file"
        name="Upload Aadhaar Card*"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) =>
          handleChange({
            target: { name: "Upload Aadhaar Card*", value: e.target.files[0]?.name || "" }
          })
        }
        className="hidden"
      />
    </label>
    {errors["Upload Aadhaar Card*"] && (
      <p className="text-red-500 text-sm mt-1">{errors["Upload Aadhaar Card*"]}</p>
    )}
  </div>

  {/* Driving License Upload */}
  <div>
    <label className="block font-medium mb-1">Upload Driving License*</label>
    <label className="flex flex-col items-center justify-center border border-gray-300 rounded-lg px-3 py-6 cursor-pointer bg-white hover:bg-gray-50 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 text-gray-400 mb-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v6m0 0l-3-3m3 3l3-3M12 4v8" />
      </svg>
      <span className="text-gray-500 text-sm">File upload (PDF/JPG/PNG)</span>
      <input
        type="file"
        name="Upload Driving License*"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) =>
          handleChange({
            target: { name: "Upload Driving License*", value: e.target.files[0]?.name || "" }
          })
        }
        className="hidden"
      />
    </label>
    {errors["Upload Driving License*"] && (
      <p className="text-red-500 text-sm mt-1">{errors["Upload Driving License*"]}</p>
    )}
  </div>
</div>



        
      </form>

      
      {/* Centered Submit and Cancel buttons in 2 lines */}
      <div className="flex flex-col items-center gap-4 mt-4">
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-green-400 text-white w-[600px] px-8 py-3 rounded-lg font-semibold hover:bg-[#5679a8] text-[40px] transition h-[74px] text-center"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="bg-red-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-500 transition w-[600px] text-[40px] h-[74px] text-center"
        >
          Cancel
        </button>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 relative flex flex-col items-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/845/845646.png" // Example image
              alt="Success"
              className="w-40 h-40 mb-4"
            />
            <p className="text-xl font-semibold mb-4">Supplier Added Successfully!</p>
            <button
              onClick={() => setShowPopup(false)}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AddSupplierForm;
