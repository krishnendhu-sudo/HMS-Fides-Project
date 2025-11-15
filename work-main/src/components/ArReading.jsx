import React, { useState, useEffect } from "react";

export default function ArReading({ data = {}, onChange, viewOnly = false }) {
  const [formData, setFormData] = useState({
    ar_od_sph: "",
    ar_od_cyl: "",
    ar_od_axis: "",
    ar_od_nct: "",
    ar_od_at: "",
    ar_os_sph: "",
    ar_os_cyl: "",
    ar_os_axis: "",
    ar_os_nct: "",
    ar_os_at: "",
  });

  // Mapping backend keys to frontend form keys
  const mapBackendToForm = (backendData) => ({
    ar_od_sph: backendData.ar_od_sph ?? backendData.sph_od ?? "",
    ar_od_cyl: backendData.ar_od_cyl ?? backendData.cyl_od ?? "",
    ar_od_axis: backendData.ar_od_axis ?? backendData.axis_od ?? "",
    ar_od_nct: backendData.ar_od_nct ?? backendData.nct_od ?? "",
    ar_od_at: backendData.ar_od_at ?? backendData.at_od ?? "",
    ar_os_sph: backendData.ar_os_sph ?? backendData.sph_os ?? "",
    ar_os_cyl: backendData.ar_os_cyl ?? backendData.cyl_os ?? "",
    ar_os_axis: backendData.ar_os_axis ?? backendData.axis_os ?? "",
    ar_os_nct: backendData.ar_os_nct ?? backendData.nct_os ?? "",
    ar_os_at: backendData.ar_os_at ?? backendData.at_os ?? "",
  });

  // Prefill form when `data` changes
  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      const mappedData = mapBackendToForm(data);
      setFormData(prev => ({ ...prev, ...mappedData }));
    }
  }, [data]);

  const handleChange = (e) => {
    if (viewOnly) return; // prevent editing in view mode
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    onChange(updated); // send updated form to parent
  };

  const fields = ["sph", "cyl", "axis", "nct", "at"];

  return (
    <div className="max-w-8xl mx-auto p-6 space-y-8">
      <h2 className="text-3xl md:text-4xl font-bold bg-[#F7DACD] text-[#3E1E32] rounded-full px-6 py-2 inline-block shadow-sm">
        AR Readings
      </h2>

      <div className="bg-[#F7DACD] p-6 rounded-2xl shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* OD Section */}
          <div>
            <h3 className="bg-[#7E4363] text-white text-2xl font-semibold text-center py-3 rounded-lg mb-6">
              OD
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-center">
                <thead>
                  <tr className="text-lg text-[#3E1E32] font-semibold">
                    {fields.map((f, idx) => (
                      <th key={idx} className="p-3">{f.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {fields.map((f, idx) => (
                      <td key={idx} className="p-3">
                        <input
                          type="text"
                          name={`ar_od_${f}`}
                          value={formData[`ar_od_${f}`]}
                          onChange={handleChange}
                          disabled={viewOnly}
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

          {/* OS Section */}
          <div>
            <h3 className="bg-[#7E4363] text-white text-2xl font-semibold text-center py-3 rounded-lg mb-6">
              OS
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-center">
                <thead>
                  <tr className="text-lg text-[#3E1E32] font-semibold">
                    {fields.map((f, idx) => (
                      <th key={idx} className="p-3">{f.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {fields.map((f, idx) => (
                      <td key={idx} className="p-3">
                        <input
                          type="text"
                          name={`ar_os_${f}`}
                          value={formData[`ar_os_${f}`]}
                          onChange={handleChange}
                          disabled={viewOnly}
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
      </div>
    </div>
  );
}
