import React, { useState, useEffect } from "react";

export default function FollowUp({ onChange }) {
  const [formData, setFormData] = useState({
    nextVisit: "",
    date: "",
    usagePerDay: "",
    transferOutside: false,
    outsideDetails: "",
    dilatation: false,
    rerefraction: false,
    highRiskPatient: false,
    fileClose: false,
    additionalRemarks: "",
    highRiskRemarks: "",
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    if (typeof onChange === "function") {
      onChange(formData);
    }
  }, [formData]); // safe dependency

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-start inline-block bg-[#F7DACD] px-4 py-2 rounded-full mb-6">
        FOLLOW UP
      </h1>

      <div className="flex justify-center items-center py-10">
        <div className="w-full bg-[#F7DACD] p-6 rounded-lg shadow-md">
          {/* Next Visit Info */}
          <div className="grid grid-cols-4 gap-4 text-xl text-start mb-6">
            <h3 className="font-semibold">NEXT VISIT</h3>
            <h3 className="font-semibold">DATE</h3>
            <h3 className="font-semibold col-span-2">USAGE A DAY</h3>

            <input
              type="text"
              name="nextVisit"
              value={formData.nextVisit}
              onChange={handleChange}
              placeholder="Please Select"
              className="bg-white rounded px-2 py-1 w-full h-[53px]"
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="bg-white text-gray-500 rounded px-2 py-1 w-full h-[53px]"
            />
            <input
              type="text"
              name="usagePerDay"
              value={formData.usagePerDay}
              onChange={handleChange}
              placeholder="Usage per day"
              className="bg-white rounded px-2 py-1 w-full h-[53px] col-span-2"
            />
          </div>

          {/* Transfer Section */}
          <div className="mb-6">
            <div className="flex flex-wrap text-xl gap-4">
              <p className="font-medium mt-1">Transfer To:</p>

              {/* Outside checkbox + input */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="transferOutside"
                  checked={formData.transferOutside}
                  onChange={handleChange}
                  className="w-5 h-5 accent-[#48D56D]"
                />
                <p>Outside</p>
                <input
                  type="text"
                  name="outsideDetails"
                  value={formData.outsideDetails}
                  onChange={handleChange}
                  placeholder="Enter details"
                  className="bg-white rounded px-2 py-1 w-[560px] h-[53px]"
                />
              </div>

              {/* Options */}
              {[
                { name: "dilatation", label: "Dilatation" },
                { name: "rerefraction", label: "Re refraction" },
                { name: "highRiskPatient", label: "High risk patient" },
                { name: "fileClose", label: "File Close" },
              ].map((item) => (
                <label
                  key={item.name}
                  className="flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-[#7E4363] text-white font-medium shadow cursor-pointer hover:bg-green-600 transition"
                >
                  <input
                    type="checkbox"
                    name={item.name}
                    checked={formData[item.name]}
                    onChange={handleChange}
                    className="w-4 h-4 accent-white"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Remarks Section */}
          <div className="mb-6 text-xl flex gap-6">
            <div className="flex-1">
              <h2 className="font-semibold">Additional Remarks</h2>
              <textarea
                name="additionalRemarks"
                value={formData.additionalRemarks}
                onChange={handleChange}
                className="w-full h-[143px] bg-white rounded px-3 py-2 mt-1"
              />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold">High Risk Remarks</h2>
              <textarea
                name="highRiskRemarks"
                value={formData.highRiskRemarks}
                onChange={handleChange}
                className="w-full h-[143px] bg-white rounded px-3 py-2 mt-1"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-6">
            <button
              type="button"
              className="px-6 py-2 rounded-full bg-[#7E4363] text-white hover:bg-green-600 transition"
              onClick={() => console.log("Load clicked")}
            >
              Load
            </button>
            <button
              type="button"
              className="px-6 py-2 rounded-full bg-[#7E4363] text-white hover:bg-green-600 transition"
              onClick={() => console.log("Save clicked", formData)}
            >
              Save
            </button>
            <button
              type="button"
              className="px-6 py-2 rounded-full bg-[#48D56D] text-white hover:bg-green-600 transition"
              onClick={() => console.log("Submit clicked", formData)}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
