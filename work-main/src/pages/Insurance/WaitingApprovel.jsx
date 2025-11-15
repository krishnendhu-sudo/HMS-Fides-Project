import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonFun from "./ButtonFun";

const ForMailing = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("FOR MAILING"); // track active button

  const goToWaitingApprovals = () => {
    setActiveTab("WAITING APPROVALS");
    navigate("/WaitingApprovel");
  };

  const goToForMailing = () => {
    setActiveTab("FOR MAILING");
    navigate("/ForMailing");
  };

  // Sample data
  const sampleData = [
    {
      status: "Pending",
      slNo: 1,
      reference: "REF001",
      uhid: "UH12345",
      patient: "John Doe",
      requestDate: "2025-09-23",
      procedure: "Checkup",
      scheduleDate: "2025-09-25",
      processStatus: "MAIL SENT",
      requested: "1",
      approved: "0",
      rejected: "0",
      counsellor: "SOFTWARE",
      mobileNo: "9999999990",
    },
    {
      status: "Pending",
      slNo: 2,
      reference: "REF002",
      uhid: "UH12346",
      patient: "Jane Smith",
      requestDate: "2025-09-22",
      procedure: "Surgery",
      scheduleDate: "2025-09-28",
      processStatus: "MAIL SENT",
      requested: "1",
      approved: "1",
      rejected: "0",
      counsellor: "SOFTWARE",
      mobileNo: "9999999991",
    },
    {
      status: "Pending",
      slNo: 3,
      reference: "REF003",
      uhid: "UH12347",
      patient: "Alice Brown",
      requestDate: "2025-09-21",
      procedure: "Procedure A",
      scheduleDate: "2025-09-29",
      processStatus: "MAIL SENT",
      requested: "1",
      approved: "0",
      rejected: "0",
      counsellor: "SOFTWARE",
      mobileNo: "9999999992",
    },
     {
      status: "Pending",
      slNo: 1,
      reference: "REF001",
      uhid: "UH12345",
      patient: "John Doe",
      requestDate: "2025-09-23",
      procedure: "Checkup",
      scheduleDate: "2025-09-25",
      processStatus: "MAIL SENT",
      requested: "1",
      approved: "0",
      rejected: "0",
      counsellor: "SOFTWARE",
      mobileNo: "9999999990",
    },
    {
      status: "Approved",
      slNo: 2,
      reference: "REF002",
      uhid: "UH12346",
      patient: "Jane Smith",
      requestDate: "2025-09-22",
      procedure: "Surgery",
      scheduleDate: "2025-09-28",
      processStatus: "MAIL SENT",
      requested: "1",
      approved: "1",
      rejected: "0",
      counsellor: "SOFTWARE",
      mobileNo: "9999999991",
    },
    {
      status: "Approved",
      slNo: 3,
      reference: "REF003",
      uhid: "UH12347",
      patient: "Alice Brown",
      requestDate: "2025-09-21",
      procedure: "Procedure A",
      scheduleDate: "2025-09-29",
      processStatus: "MAIL SENT",
      requested: "1",
      approved: "0",
      rejected: "0",
      counsellor: "SOFTWARE",
      mobileNo: "9999999992",
    },
  ];

  // Row color based on status
  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-[#FFCC36E5]";
      case "Approved":
        return "bg-[#14932B]";
      default:
        return "";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Insurance Heading */}
      <h1 className="text-2xl font-bold text-[32px]">Insurance</h1>

      {/* Top Green Checkboxes */}
      <ButtonFun/>

      {/* Navigation Buttons */}
      <div className="flex text-[20px] font-semibold gap-4">
        <button
          onClick={goToForMailing}
          className={`px-6 py-2 border rounded-full ${
            activeTab === "FOR MAILING"
              ? "bg-[#CBDCEB]"
              : ""
          }`}
        >
          FOR MAILING
        </button>

        <button
          onClick={goToWaitingApprovals}
          className={`px-6 py-2 border rounded-full ${
            activeTab === "WAITING APPROVALS"
              ? "bg-[#CBDCEB]"
              : ""
          }`}
        >
          WAITING APPROVALS
        </button>
      </div>

      {/* Search Section */}
      <div className="bg-[#CBDCEB] p-6 rounded-lg">
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
  <div className="flex flex-col pl-10 gap-1 flex-1 min-w-[80px]">
    <label className="font-medium invisible">Search</label>
    <button
      type="submit"
      className="bg-[#48D56D] px-4 py-2 rounded-full font-semibold  w-2/4 h-10"
    >
      Search
    </button>
  </div>
</form>
     

      {/* Table */}
      <div className="overflow-x-auto">
  <table className="w-full border-separate border-spacing-y-2 mt-4">
    <thead className="bg-black text-white">
      <tr>
        {[
          "Status",
          "SL. No",
          "Reference",
          "UHID",
          "Patient Name",
          "Request Date",
          "Procedure",
          "Schedule Date",
          "Process Status",
          "Requested",
          "Approved",
          "Rejected",
          "Counsellor",
          "Mobile No",
        ].map((col, idx) => (
          <th key={idx} className="h-[68px] px-2 py-2">
            {col}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {sampleData.map((row) => (
        <tr
          key={row.slNo}
          className={`${getStatusClass(row.status)} h-[79px] hover:bg-gray-100`}
        >
          <td className=" px-2 py-2">{row.status}</td>
          <td className=" px-2 py-2">{row.slNo}</td>
          <td className=" px-2 py-2">{row.reference}</td>
          <td className=" px-2 py-2">{row.uhid}</td>
          <td className=" px-2 py-2">{row.patient}</td>
          <td className=" px-2 py-2">{row.requestDate}</td>
          <td className=" px-2 py-2">{row.procedure}</td>
          <td className=" px-2 py-2">{row.scheduleDate}</td>
          <td className=" px-2 py-2">{row.processStatus}</td>
          <td className=" px-2 py-2">{row.requested}</td>
          <td className=" px-2 py-2">{row.approved}</td>
          <td className=" px-2 py-2">{row.rejected}</td>
          <td className=" px-2 py-2">{row.counsellor}</td>
          <td className=" px-2 py-2">{row.mobileNo}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

       </div>
    </div>
  );
};

export default ForMailing;
