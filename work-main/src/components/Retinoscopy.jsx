import React, { useState, useEffect } from "react";
import { FiRefreshCw } from "react-icons/fi";

export default function Retinoscopy({ data = {}, onChange, viewOnly = false }) {
  const rows = [
    { key: "dry", label: "Dry Retinoscopy" },
    { key: "wet", label: "Wet Retinoscopy" },
  ];

  const eyes = ["od", "os"];

  // Initialize form data
  const initialFormData = {};
  eyes.forEach((eye) => {
    rows.forEach((row) => {
      initialFormData[`ret_${eye}_${row.key}`] = "";
    });
  });

  const [formData, setFormData] = useState(initialFormData);

  // Load existing data if editing
  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setFormData(data);
    }
  }, [data]);

  const handleChange = (e) => {
    if (viewOnly) return; // prevent editing
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    if (onChange) onChange(updated);
  };

  const handleReset = () => {
    if (viewOnly) return; // prevent reset
    setFormData(initialFormData);
    if (onChange) onChange(initialFormData);
  };

  return (
    <div className="max-w-8xl mx-auto p-4 md:p-6 space-y-6">
      {/* Title + Reset */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="px-4 py-2 bg-[#F7DACD] text-2xl md:text-3xl rounded-full font-bold">
          RETINOSCOPY
        </h1>

        {!viewOnly && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md"
          >
            <FiRefreshCw size={20} />
            Reset
          </button>
        )}
      </div>

      {/* OD & OS Sections */}
      <div
        className={`flex flex-col md:flex-row gap-6 p-4 md:p-6 rounded-xl ${
          viewOnly ? "bg-[#F7DACD]" : "bg-[#F7DACD]"
        }`}
      >
        {eyes.map((eye) => (
          <div key={eye} className="flex-1 p-6 rounded-xl">
            <h3 className="bg-[#7E4363] text-white py-2 rounded text-xl md:text-2xl text-center font-bold mb-4">
              {eye.toUpperCase()}
            </h3>
            <div className="space-y-4">
              {rows.map((row) => (
                <div key={row.key} className="flex items-center gap-3">
                  <span className="w-40 font-semibold text-lg md:text-xl">
                    {row.label}
                  </span>
                  <input
                    type="text"
                    name={`ret_${eye}_${row.key}`}
                    value={formData[`ret_${eye}_${row.key}`]}
                    disabled={viewOnly}
                    onChange={handleChange}
                    placeholder="Value"
                    className={`flex-1 h-12 px-2 rounded border border-gray-300 text-black ${
                      viewOnly
                        ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                        : "bg-white focus:ring-2 focus:ring-blue-400"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
