import React, { useState } from "react";

export default function Ark() {
  const [formData, setFormData] = useState({
    od_k1_1: "", od_r1_1: "", od_axis_1: "", od_axl_1: "", od_pciol_1: "",
    od_k1_2: "", od_r1_2: "", od_axis_2: "", od_axl_2: "", od_pciol_2: "",
    os_k1_1: "", os_r1_1: "", os_axis_1: "", os_axl_1: "", os_pciol_1: "",
    os_k1_2: "", os_r1_2: "", os_axis_2: "", os_axl_2: "", os_pciol_2: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Rows for mapping
  const rows = [
    { label: "First Row", suffix: 1 },
    { label: "Second Row", suffix: 2 },
  ];

  const fields = [
    { label: "K1", key: "k1" },
    { label: "R1", key: "r1" },
    { label: "AXIS", key: "axis" },
    { label: "AXL", key: "axl" },
    { label: "PCIOL", key: "pciol" },
  ];

  const eyes = ["od", "os"];

  return (
    <div>
      {/* Tabs */}
      <div className="flex text-3xl gap-3 mb-4 flex-wrap">
        <h1 className="px-4 py-2 bg-[#CBDCEB] rounded-full font-bold">
          ARK / MANUAL K
        </h1>
        <h1 className="px-4 py-2 bg-[#CBDCEB] rounded-full text-gray-500 font-bold">
          TOP K
        </h1>
        <h1 className="px-4 py-2 bg-[#CBDCEB] rounded-full text-gray-500 font-bold">
          OPTICAL K
        </h1>
      </div>

      <div className="max-w-8xl mx-auto p-6 bg-[#CBDCEB] rounded-lg shadow-md">
        {/* Toggle ARK / Manual K */}
        <div className="flex items-center gap-3 mb-6">
          <span className="font-semibold text-3xl">ARK</span>
          <div className="relative w-12 h-6 bg-green-500 rounded-full cursor-pointer">
            <div className="absolute left-6 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
          </div>
          <span className="font-semibold text-3xl">Manual K</span>
        </div>

        {/* OD / OS Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {eyes.map((eye) => (
            <div key={`eye-${eye}`} className="border-gray-400 rounded overflow-hidden">
              <h3 className="bg-[#4D6C9D] h-[61px] text-[32px] text-center py-2 font-bold">
                {eye.toUpperCase()}
              </h3>

              <div className="p-4">
                {rows.map((row) => (
                  <div key={`row-${eye}-${row.suffix}`} className="grid grid-cols-5 gap-3 text-sm mb-2">
                    {fields.map((field) => (
                      <div key={`input-${eye}-${row.suffix}-${field.key}`}>
                        <label className="block text-xl text-gray-700 mb-1">{field.label}</label>
                        <input
                          name={`${eye}_${field.key}_${row.suffix}`}
                          value={formData[`${eye}_${field.key}_${row.suffix}`]}
                          onChange={handleChange}
                          className="p-2 rounded bg-[#FFFFFFE0] w-full"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
