import React, { useState, useEffect } from "react";

export default function Visual({ data = {}, onChange, viewOnly = false }) {
  const [formData, setFormData] = useState({
    va_od_distant: "",
    va_od_ph: "",
    va_od_near: "",
    va_od_color: "",
    va_os_distant: "",
    va_os_ph: "",
    va_os_near: "",
    va_os_color: "",
  });

  // Safely merge incoming data
  useEffect(() => {
    setFormData(prev => ({ ...prev, ...data }));
  }, [data]);

  const handleChange = (e) => {
    if (viewOnly) return;
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    if (onChange) onChange(updated);
  };

  const odFields = [
    ["va_od_distant", "Distance"],
    ["va_od_ph", "PH"],
    ["va_od_near", "Near"],
    ["va_od_color", "ColorVision"],
  ];

  const osFields = [
    ["va_os_distant", "Distance"],
    ["va_os_ph", "PH"],
    ["va_os_near", "Near"],
    ["va_os_color", "ColorVision"],
  ];

  return (
    <div className="max-w-8xl mx-auto p-6 space-y-8">
      <h2 className="text-3xl md:text-4xl font-bold bg-[#F7DACD] text-[#3E1E32] rounded-full px-6 py-2 inline-block shadow-sm">
        Visual Acuity
      </h2>

      <div className="bg-[#F7DACD] p-6 rounded-2xl shadow-md grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* OD */}
        <div>
          <h3 className="bg-[#7E4363] text-white text-2xl font-semibold text-center py-3 rounded-lg mb-4">
            OD
          </h3>

          <table className="w-full text-center">
            <thead>
              <tr>
                {odFields.map(([_, label], idx) => (
                  <th key={idx} className="p-3">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {odFields.map(([key], idx) => (
                  <td key={idx} className="p-3">
                    <input
                      type="text"
                      name={key}
                      value={formData[key] || ""}
                      disabled={viewOnly}
                      onChange={handleChange}
                     className={`w-full h-11 p-2 rounded-md border text-center ${
  viewOnly
    ? "bg-gray-200 text-gray-700 cursor-not-allowed"
    : "bg-gray-50 text-black border-gray-200 focus:ring-2 focus:ring-[#7E4363] outline-none"
}`}

                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* OS */}
        <div>
          <h3 className="bg-[#7E4363] text-white text-2xl font-semibold text-center py-3 rounded-lg mb-4">
            OS
          </h3>

          <table className="w-full text-center">
            <thead>
              <tr>
                {osFields.map(([_, label], idx) => (
                  <th key={idx} className="p-3">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {osFields.map(([key], idx) => (
                  <td key={idx} className="p-3">
                    <input
                      type="text"
                      name={key}
                      value={formData[key] || ""}
                      disabled={viewOnly}
                      onChange={handleChange}
                      className={`w-full h-11 p-2 rounded-md border text-center ${
                        viewOnly
                          ? "bg-gray-200 text-gray-700 cursor-not-allowed"
                          : "bg-gray-50 text-black border-gray-200 focus:ring-2 focus:ring-[#7E4363] outline-none"
                      }`}
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
