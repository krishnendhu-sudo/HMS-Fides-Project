import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonFun from "./ButtonFun";

const ForMailing = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("FOR MAILING");

  const goToWaitingApprovals = () => {
    setActiveTab("WAITING APPROVALS");
    navigate("/WaitingApprovel");
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Insurance Heading */}
      <h1 className="text-xl md:text-2xl lg:text-[32px] font-bold">Insurance</h1>

      <ButtonFun />

      {/* Navigation Buttons */}
      <div className="flex flex-wrap gap-3 text-lg md:text-2xl font-semibold">
        <button
          onClick={() => setActiveTab("FOR MAILING")}
          className={`px-4 md:px-6 py-2 rounded-full ${
            activeTab === "FOR MAILING"
              ? "bg-[#CBDCEB]"
              : "bg-blue-500 text-white"
          }`}
        >
          FOR MAILING
        </button>

        <button
          onClick={goToWaitingApprovals}
          className={`px-4 md:px-6 py-2 rounded-full border ${
            activeTab === "WAITING APPROVALS" ? "bg-[#CBDCEB]" : "hover:bg-[#CBDCEB]"
          }`}
        >
          WAITING APPROVALS
        </button>
      </div>

      {/* Search Section */}
      <div className="bg-[#CBDCEB] p-4 md:p-10 rounded-lg">
       
          <form
  onSubmit={(e) => {
    e.preventDefault();
    console.log("Search submitted ✅");
  }}
  className="flex flex-wrap md:flex-nowrap mb-10 items-end gap-4 w-full"
>
  {/* From Date */}
  <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
    <label className="font-medium">From</label>
    <input
      type="date"
      className="border border-black bg-transparent px-3 py-2 rounded-full w-full h-10"
    />
  </div>

  {/* To Date */}
  <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
    <label className="font-medium">To</label>
    <input
      type="date"
      className="border border-black bg-transparent px-3 py-2 rounded-full w-full h-10"
    />
  </div>

  {/* Patient Name */}
  <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
    <label className="font-medium">Patient</label>
    <input
      type="text"
      className="border border-black bg-transparent px-3 py-2 rounded-full w-full h-10"
    />
  </div>

  {/* Checkboxes */}
  <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
    <label className="font-medium invisible">Type</label>
    <div className="flex flex-wrap md:flex-nowrap gap-2 justify-between">
      {["All", "Procedure", "Surgery"].map((label, idx) => (
        <label
          key={idx}
          className="flex-1 flex justify-center items-center gap-1 bg-[#48D56D] px-5 py-2 rounded-full cursor-pointer  text-sm"
        >
          <input type="checkbox" />
          {label}
        </label>
      ))}
    </div>
  </div>

  {/* Search Button */}
  <div className="flex flex-col pl-10 gap-1 flex-1 min-w-[100px]">
    <label className="font-medium invisible">Search</label>
    <button
      type="submit"
      className="bg-[#48D56D] px-4 py-2 rounded-full font-semibold  w-1/2 h-10"
    >
      Search
    </button>
  </div>
</form>

        {/* Table with Horizontal Scroll on Small Screens */}
        <div className="overflow-x-auto mt-6">
          <table className="min-w-[800px] w-full text-sm md:text-base">
            <thead className="bg-black text-white h-[50px] md:h-[68px]">
              <tr>
                <th className="px-2 py-1">Status</th>
                <th className="px-2 py-1">SL. No</th>
                <th className="px-2 py-1">Reference</th>
                <th className="px-2 py-1">UHID</th>
                <th className="px-2 py-1">Patient</th>
                <th className="px-2 py-1">Request Date</th>
                <th className="px-2 py-1">Procedure</th>
                <th className="px-2 py-1">Schedule Date</th>
                <th className="px-2 py-1">Status</th>
                <th className="px-2 py-1">Process Status</th>
                <th className="px-2 py-1">Requested</th>
                <th className="px-2 py-1">Approved</th>
                <th className="px-2 py-1">Rejected</th>
                <th className="px-2 py-1">Counsellor</th>
                <th className="px-2 py-1">Mobile No</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan="15"
                  className="text-center text-lg md:text-2xl py-6 text-black font-medium"
                >
                  No Data Available in Table
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Horizontal Line */}
        <hr className="mt-5 border-black" />
      </div>
    </div>
  );
};

export default ForMailing;
