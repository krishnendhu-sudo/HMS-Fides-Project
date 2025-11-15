import React from "react";
import { FiRefreshCw } from "react-icons/fi";
import axios from "axios";

const Dialated = ({ data = {}, onChange, appointmentId, viewOnly = false }) => {
  // Reset handler
  const handleReset = () => {
    if (viewOnly) return;
    const resetData = { dia_od: "", dia_os: "" };
    if (onChange) onChange(resetData);
  };

  // Input handler
  const handleChange = (e) => {
    if (viewOnly) return;
    const { name, value } = e.target;
    onChange({ ...data, [name]: value }); 
  };

  // Submit handler
  const handleSubmit = async () => {
    if (viewOnly) return;
    try {
      const payload = {
        appointment_id: appointmentId || data?.appointment_id,
        ...data,
      };

      const response = await axios.post("/api/exam", payload);
      console.log("Saved successfully:", response.data);
      alert("Dilated data saved!");
    } catch (error) {
      console.error("Error saving dilated data:", error);
      alert("Failed to save data");
    }
  };

  return (
    <div className="max-w-8xl mx-auto p-6 space-y-6">
      {/* Header + Reset */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl md:text-3xl font-bold bg-[#F7DACD] px-4 py-2 rounded-full">
          DILATED ACCEPTANCE
        </h1>

        {!viewOnly && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition"
          >
            <FiRefreshCw size={20} />
            Reset
          </button>
        )}
      </div>

      {/* Inputs */}
      <div
        className={`grid grid-cols-2 gap-4 p-10 rounded-lg ${
          viewOnly ? "bg-[#F7DACD]" : "bg-[#F7DACD]"
        }`}
      >
        {/* OD */}
        <div className="flex flex-col gap-2">
          <div className="bg-[#7E4363] text-white text-center font-bold py-2 rounded">
            OD
          </div>
          <input
            type="text"
            name="dia_od"
            value={data?.dia_od || ""}
            onChange={handleChange}
            placeholder="Enter OD"
            disabled={viewOnly}
            className={`h-[59px] px-3 rounded-lg border text-black ${
              viewOnly
                ? "bg-gray-100 text-gray-600 cursor-not-allowed border-gray-300"
                : "bg-white border-gray-300 focus:ring-2 focus:ring-[#7E4363]"
            }`}
          />
        </div>

        {/* OS */}
        <div className="flex flex-col gap-2">
          <div className="bg-[#7E4363] text-white text-center font-bold py-2 rounded">
            OS
          </div>
          <input
            type="text"
            name="dia_os"
            value={data?.dia_os || ""}
            onChange={handleChange}
            placeholder="Enter OS"
            disabled={viewOnly}
            className={`h-[59px] px-3 rounded-lg border text-black ${
              viewOnly
                ? "bg-gray-100 text-gray-600 cursor-not-allowed border-gray-300"
                : "bg-white border-gray-300 focus:ring-2 focus:ring-[#7E4363]"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default Dialated;
