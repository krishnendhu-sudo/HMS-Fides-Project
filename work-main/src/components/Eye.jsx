import React from "react";
import { FiRefreshCw } from "react-icons/fi";

const Eye = ({ data = {}, onChange }) => {
  const testRows = [
    { label: "PUPIL", od: "pupil_od", os: "pupil_os" },
    { label: "CR", od: "cr_od", os: "cr_os" },
    { label: "COVER TEST", od: "cover_od", os: "cover_os" },
    { label: "OM", od: "om_od", os: "om_os" },
    { label: "CONFRONTATION", od: "confrontation_od", os: "confrontation_os" },
    { label: "CONVERGENCE", od: "covergence_od", os: "covergence_os" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleReset = () => {
    const emptyData = {};
    testRows.forEach((row) => {
      emptyData[row.od] = "";
      emptyData[row.os] = "";
    });
    ["pmt", "dialated", "duochrome", "wfdt"].forEach(
      (field) => (emptyData[field] = "")
    );
    onChange(emptyData);
  };

  return (
    <div className="p-6 space-y-6 relative max-w-8xl mx-auto">
      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="absolute top-4 right-4 flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded-md shadow-md"
      >
        <FiRefreshCw size={18} />
        Reset
      </button>

      {/* OD/OS Table */}
      <div className="bg-[#F7DACD] mt-10 p-6 rounded-xl shadow-md relative overflow-x-auto">
        {/* Column Headings */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <h2 className="text-xl md:w-[770px] sm:mr-9 sm:w-[350px] font-bold text-center bg-[#7E4363] text-white py-2 rounded-md">
            OD
          </h2>
          <h2 className="text-xl md:ml-24 sm:w-[300px] md:w-[590px] font-bold text-center bg-[#7E4363] text-white py-2 rounded-md">
            OS
          </h2>
        </div>

        {/* Rows */}
        <div className="grid grid-cols-[150px_1fr_1fr] gap-4 w-full">
          {testRows.map((row) => (
            <React.Fragment key={row.label}>
              <div className="bg-[#7E4363] text-white font-semibold px-2 py-2 rounded-full text-center">
                {row.label}
              </div>

              <input
                type="text"
                name={row.od}
                value={data[row.od] || ""}
                onChange={handleChange}
                className="w-full p-2 rounded focus:ring-2 focus:ring-[#7E4363] outline-none"
              />

              <input
                type="text"
                name={row.os}
                value={data[row.os] || ""}
                onChange={handleChange}
                className="w-full p-2  rounded focus:ring-2 focus:ring-[#7E4363] outline-none"
              />
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Lower Input Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 mt-10 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
            <div className="font-semibold px-2 py-2 rounded-full">PMT Needed:</div>
            <input
              type="text"
              name="pmt"
              value={data.pmt || ""}
              onChange={handleChange}
              className="w-full p-2 text-gray-400 rounded focus:ring-2 focus:ring-[#7E4363] outline-none"
            />
          </div>

          <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
            <div className="font-semibold px-2 py-2 rounded-full">Dialated:</div>
            <input
              type="text"
              name="dialated"
              value={data.dialated || ""}
              onChange={handleChange}
              className="w-full p-2 text-gray-400  rounded focus:ring-2 focus:ring-[#7E4363] outline-none"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
            <div className="font-semibold px-2 py-2 rounded-full">DuoChrome Test:</div>
            <input
              type="text"
              name="duochrome"
              value={data.duochrome || ""}
              onChange={handleChange}
              className="w-full p-2 text-gray-400  rounded focus:ring-2 focus:ring-[#7E4363] outline-none"
            />
          </div>

          <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
            <div className="font-semibold px-2 py-2 rounded-full">WFDT:</div>
            <input
              type="text"
              name="wfdt"
              value={data.wfdt || ""}
              onChange={handleChange}
              className="w-full p-2 text-gray-400 rounded focus:ring-2 focus:ring-[#7E4363] outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eye;
