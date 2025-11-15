import React from "react";
import { FiRefreshCw } from "react-icons/fi";

const Keratometry = ({ data = {}, onChange, viewOnly = false }) => {
  const handleChange = (e) => {
    if (viewOnly) return; // prevent editing
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleReset = () => {
    if (viewOnly) return;
    onChange({
      k1_od: "",
      k2_od: "",
      k1_os: "",
      k2_os: "",
    });
  };

  return (
    <div className="max-w-8xl rounded-lg mx-auto p-6 space-y-8">
      {/* Title + Reset */}
      <div className="flex justify-between items-center">
        <h1 className="px-6 py-2 bg-[#F7DACD] rounded-full font-bold text-2xl md:text-3xl">
          KERATOMETRY
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

      {/* OD & OS Sections */}
      <div
        className={`grid grid-cols-1 rounded-lg md:grid-cols-2 gap-6 p-6 ${
          viewOnly ? "bg-[#F7DACD]" : "bg-[#F7DACD]"
        }`}
      >
        {/* OD */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-center bg-[#7E4363] text-white py-2 rounded-md mb-4">
            OD
          </h2>
          <div className="flex flex-col space-y-4">
            <div className="flex gap-3">
              <label htmlFor="k1_od" className="block font-semibold">
                K1
              </label>
              <input
                id="k1_od"
                type="text"
                name="k1_od"
                value={data?.k1_od || ""}
                onChange={handleChange}
                placeholder="K1 Value"
                disabled={viewOnly}
                className={`w-1/2 p-2 rounded border text-black ${
                  viewOnly
                    ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                    : "border-gray-300 focus:ring-2 focus:ring-[#7E4363] bg-white"
                }`}
              />
              <label htmlFor="k2_od" className="block font-semibold">
                K2
              </label>
              <input
                id="k2_od"
                type="text"
                name="k2_od"
                value={data?.k2_od || ""}
                onChange={handleChange}
                placeholder="K2 Value"
                disabled={viewOnly}
                className={`w-1/2 p-2 rounded border text-black ${
                  viewOnly
                    ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                    : "border-gray-300 focus:ring-2 focus:ring-[#7E4363] bg-white"
                }`}
              />
            </div>
          </div>
        </div>

        {/* OS */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-center bg-[#7E4363] text-white py-2 rounded-md mb-4">
            OS
          </h2>
          <div className="flex flex-col space-y-4">
            <div className="flex gap-3">
              <label htmlFor="k1_os" className="block font-semibold">
                K1
              </label>
              <input
                id="k1_os"
                type="text"
                name="k1_os"
                value={data?.k1_os || ""}
                onChange={handleChange}
                placeholder="K1 Value"
                disabled={viewOnly}
                className={`w-1/2 p-2 rounded border text-black ${
                  viewOnly
                    ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                    : "border-gray-300 focus:ring-2 focus:ring-[#7E4363] bg-white"
                }`}
              />
              <label htmlFor="k2_os" className="block font-semibold">
                K2
              </label>
              <input
                id="k2_os"
                type="text"
                name="k2_os"
                value={data?.k2_os || ""}
                onChange={handleChange}
                placeholder="K2 Value"
                disabled={viewOnly}
                className={`w-1/2 p-2 rounded border text-black ${
                  viewOnly
                    ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                    : "border-gray-300 focus:ring-2 focus:ring-[#7E4363] bg-white"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Keratometry;
