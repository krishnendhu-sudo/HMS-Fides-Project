import React, { useState, useEffect } from "react";
import { FiRefreshCw } from "react-icons/fi";

export default function Refraction({ data = {}, onChange, viewOnly = false }) {
  const eyes = ["od", "os"];
  const rows = ["dist", "near"];
  const fields = ["va", "sph", "cyl", "axis"];

  // Build initial form state dynamically based on schema names
  const initialFormData = {};
  eyes.forEach((eye) => {
    rows.forEach((row) => {
      fields.forEach((field) => {
        initialFormData[`ref_${eye}_${row}_${field}`] = "";
      });
    });
  });

  // Additional fields
  initialFormData.ref_distance = "";
  initialFormData.ref_remarks = "";

  const [formData, setFormData] = useState(initialFormData);

  // Load existing data if editing
  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setFormData((prev) => {
        const isDifferent = Object.keys(data).some(
          (key) => data[key] !== prev[key]
        );
        return isDifferent ? { ...prev, ...data } : prev;
      });
    }
  }, [data]);

  const handleChange = (e) => {
    if (viewOnly) return; // prevent edit in view mode
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    if (onChange) onChange(updated);
  };

  const handleReset = () => {
    if (viewOnly) return; // prevent reset in view mode
    setFormData(initialFormData);
    if (onChange) onChange(initialFormData);
  };

  return (
    <div className="max-w-8xl mx-auto p-4 md:p-6 space-y-6">
      {/* Title + Reset */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="px-4 py-2 bg-[#F7DACD] text-2xl md:text-3xl rounded-full font-bold">
          SUBJECTIVE REFRACTION
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

      {/* OD & OS Tables */}
      <div
        className={`p-6 md:p-8 rounded-xl space-y-6 ${
          viewOnly ? "bg-[#F7DACD]" : "bg-[#F7DACD]"
        }`}
      >
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          {["OD", "OS"].map((eyeLabel, i) => {
            const eye = eyes[i];
            return (
              <div key={eye} className="flex-1 flex flex-col items-center">
                <h3 className="bg-[#7E4363] text-2xl md:text-3xl text-center font-bold py-2 rounded mb-4 w-full max-w-[600px] text-white">
                  {eyeLabel}
                </h3>
                <div className="overflow-x-auto w-full max-w-[600px]">
                  <table className="w-full border-collapse text-center">
                    <thead>
                      <tr className="text-base md:text-lg font-light">
                        <th className="p-2 text-left"></th>
                        {fields.map((field) => (
                          <th key={field} className="p-2">
                            {field.toUpperCase()}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr key={row}>
                          <td className="text-left text-lg md:text-xl p-2 font-semibold">
                            {row.toUpperCase()}
                          </td>
                          {fields.map((field) => (
                            <td key={field} className="px-2 py-2">
                              <input
                                type="text"
                                name={`ref_${eye}_${row}_${field}`}
                                value={formData[`ref_${eye}_${row}_${field}`]}
                                disabled={viewOnly}
                                onChange={handleChange}
                                className={`w-full h-10 md:h-11 px-2 rounded border border-gray-300 text-black ${
                                  viewOnly
                                    ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                                    : "bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                                }`}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Inputs */}
        <div className="flex flex-col md:flex-row gap-6 justify-between">
          <input
            type="text"
            name="ref_distance"
            placeholder="Distance"
            value={formData.ref_distance}
            disabled={viewOnly}
            onChange={handleChange}
            className={`w-full md:w-[580px] ml-24 h-20 p-3 rounded-lg border border-gray-300 shadow-sm outline-none ${
              viewOnly
                ? "bg-gray-100 ml-[30px] text-gray-600 cursor-not-allowed"
                : "bg-white focus:ring-2 focus:ring-[#7E4363]"
            }`}
          />
          <input
            type="text"
            name="ref_remarks"
            placeholder="Remarks"
            value={formData.ref_remarks}
            disabled={viewOnly}
            onChange={handleChange}
            className={`w-full md:ml-[30px] md:w-[580px] mr-7 h-20 p-3 rounded-lg border border-gray-300 shadow-sm outline-none ${
              viewOnly
                ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                : "bg-white focus:ring-2 focus:ring-[#7E4363]"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
