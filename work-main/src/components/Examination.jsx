import React, { useState } from "react";

export default function Examination() {
  const rows = [
    "ORBIT",
    "LIDS_AND_ADNEXA",
    "CONJUNCTIVA",
    "SCLERA",
    "CORNEA",
    "ANTERIOR_CHAMBER",
    "PUPIL",
    "IRIS",
    "LENS",
    "IOP",
    "FUNDUS",
    "EOM",
    "DUCT",
    "OTHER_FINDINGS",
    "BP",
    "FBS",
    "PPBS",
    "HBA1C",
    "Nutrition_Health", // special row
    "Axial_Length", // special row
  ];

  // ✅ Predefined formData keys (explicit like your odDry model)
  const [formData, setFormData] = useState({
    // Common rows: each has OD & OS
    ORBIT_OD: "",
    ORBIT_OS: "",
    LIDS_AND_ADNEXA_OD: "",
    LIDS_AND_ADNEXA_OS: "",
    CONJUNCTIVA_OD: "",
    CONJUNCTIVA_OS: "",
    SCLERA_OD: "",
    SCLERA_OS: "",
    CORNEA_OD: "",
    CORNEA_OS: "",
    ANTERIOR_CHAMBER_OD: "",
    ANTERIOR_CHAMBER_OS: "",
    PUPIL_OD: "",
    PUPIL_OS: "",
    IRIS_OD: "",
    IRIS_OS: "",
    LENS_OD: "",
    LENS_OS: "",
    IOP_OD: "",
    IOP_OS: "",
    FUNDUS_OD: "",
    FUNDUS_OS: "",
    EOM_OD: "",
    EOM_OS: "",
    DUCT_OD: "",
    DUCT_OS: "",
    OTHER_FINDINGS_OD: "",
    OTHER_FINDINGS_OS: "",
    BP_OD: "",
    BP_OS: "",
    FBS_OD: "",
    FBS_OS: "",
    PPBS_OD: "",
    PPBS_OS: "",
    HBA1C_OD: "",
    HBA1C_OS: "",

    // Special rows
    Nutrition_Health_height: "",
    Nutrition_Health_weight: "",
    Axial_Length_RE: "",
    Axial_Length_LE: "",
  });

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div className="max-w-full md:max-w-8xl mx-auto p-4 md:p-6 space-y-6">
        {/* Title and Buttons Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold text-[#14416D] bg-[#CBDCEB] rounded-full px-4 py-2">
            Examination
          </h2>

          <div className="flex flex-wrap gap-2 md:gap-3 mt-2 md:mt-0">
            {["OD", "OS", "OU", "NORMAL"].map((btn, i) => (
              <button
                key={`btn-${i}`}
                className="px-4 sm:px-6 py-1 sm:py-2 text-lg sm:text-2xl md:text-2xl rounded-full bg-gray-200 hover:bg-green-500 hover:text-white transition"
              >
                {btn}
              </button>
            ))}
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-[#CBDCEB] p-4 md:p-6 rounded-xl overflow-x-auto">
          <table className="w-full mt-6 border-collapse text-center min-w-[600px]">
            <thead>
              <tr>
                <th className="w-1/3 text-center p-2 sm:p-3"></th>
                <th className="bg-[#6D94C5] text-lg sm:text-2xl md:text-[32px] py-2 px-4 sm:px-6 rounded-t font-bold">
                  OD
                </th>
                <th className="w-6" aria-hidden="true"></th>
                <th className="bg-[#6D94C5] text-lg sm:text-2xl md:text-[32px] py-2 px-4 sm:px-6 rounded-t font-bold">
                  OS
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) =>
                row === "Nutrition_Health" ? (
                  <tr key={`row-${idx}`}>
                    <td className="text-left text-lg sm:text-2xl md:text-3xl p-2 sm:p-3">
                      Nutrition Health
                    </td>
                    <td className="p-2">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm sm:text-base font-medium text-left">
                          Height
                        </label>
                        <input
                          type="text"
                          name="Nutrition_Health_height"
                          value={formData.Nutrition_Health_height}
                          onChange={handleChange}
                          className="w-full h-10 sm:h-12 p-2 rounded-full bg-white text-black"
                        />
                      </div>
                    </td>
                    <td aria-hidden="true"></td>
                    <td className="p-2">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm sm:text-base font-medium text-left">
                          Weight
                        </label>
                        <input
                          type="text"
                          name="Nutrition_Health_weight"
                          value={formData.Nutrition_Health_weight}
                          onChange={handleChange}
                          className="w-full h-10 sm:h-12 p-2 rounded-full bg-white text-black"
                        />
                      </div>
                    </td>
                  </tr>
                ) : row === "Axial_Length" ? (
                  <tr key={`row-${idx}`}>
                    <td className="text-left text-lg sm:text-2xl md:text-3xl p-2 sm:p-3">
                      Axial Length
                    </td>
                    <td className="p-2">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm sm:text-base font-medium text-left">
                          RE
                        </label>
                        <input
                          type="text"
                          name="Axial_Length_RE"
                          value={formData.Axial_Length_RE}
                          onChange={handleChange}
                          className="w-full h-10 sm:h-12 p-2 rounded-full bg-white text-black"
                        />
                      </div>
                    </td>
                    <td aria-hidden="true"></td>
                    <td className="p-2">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm sm:text-base font-medium text-left">
                          LE
                        </label>
                        <input
                          type="text"
                          name="Axial_Length_LE"
                          value={formData.Axial_Length_LE}
                          onChange={handleChange}
                          className="w-full h-10 sm:h-12 p-2 rounded-full bg-white text-black"
                        />
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={`row-${idx}`}>
                    <td className="text-left text-lg sm:text-2xl md:text-3xl p-2 sm:p-3">
                      {row.replace(/_/g, " ")}
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        name={`${row}_OD`}
                        value={formData[`${row}_OD`]}
                        onChange={handleChange}
                        className="w-full h-10 sm:h-12 p-2 rounded-full bg-white text-black"
                      />
                    </td>
                    <td aria-hidden="true"></td>
                    <td className="p-2">
                      <input
                        type="text"
                        name={`${row}_OS`}
                        value={formData[`${row}_OS`]}
                        onChange={handleChange}
                        className="w-full h-10 sm:h-12 p-2 rounded-full bg-white text-black"
                      />
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
