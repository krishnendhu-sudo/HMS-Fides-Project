import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Profile from "./Profile"; // ✅ import your Profile component

export default function DoctorWaitingList() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showTable, setShowTable] = useState(false); // ✅ toggle table

  // Card Data
  const cards = [
    { count: 1, label: "READY TO SEE", color: "bg-[#D8434F9E]" },
    { count: 0, label: "AT AR ROOM", color: "bg-[#0A62B96B]" },
    { count: 0, label: "DILATATION", color: "bg-[#EFB2319E]" },
    { count: 0, label: "RE REFRACTION", color: "bg-[#15868A9E]" },
    { count: 0, label: "COUNSELLING", color: "bg-[#642D489E]" },
    { count: 0, label: "CONSULTED", color: "bg-[#DD135D9E]" },
  ];

  // Table Headers
  const tableHeaders = [
    "OP Number",
    "Patient name",
    "Age",
    "Sex",
    "In Time",
    "Token Number",
    "Waiting Time",
    "Type",
    "Fee",
    "Scheme",
    "Category",
    "Patient Remarks",
  ];

  // Patient Data
  const patients = [
    {
      opNumber: "LVSERD2025/I96615",
      name: "SACHIN",
      age: "55 YEARS",
      sex: "M",
      inTime: "11:28:24",
      token: 2,
      waiting: "0h:32m",
      type: "NEW",
      fee: "300.00",
      scheme: "GENERAL",
      category: "CONSULTATION",
      remarks: "",
    },
  ];

  return (
    <div
      className={`w-8xl min-h-screen flex items-center justify-center py-14 transition-all duration-300 bg-gray-100
        ${selectedPatient ? "backdrop-blur-md" : ""}`}
    >
      <div className="w-full max-w-8xl p-10"> {/* 🔥 increased width & padding */}
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-10"> {/* 🔥 bigger title */}
          DOCTOR / Waiting List
        </h2>

        {/* Doctor Cards */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-30 mb-12 justify-center">
               {cards.map((item, idx) => (
                 <div
                   key={idx}
                   className={`relative ${item.color} rounded-xl flex flex-col items-center justify-center shadow-lg cursor-pointer transform hover:scale-105 transition w-[389px] h-[196px] max-w-full`}
                   onClick={() => item.label === "READY TO SEE" && setShowTable(true)}
                 >
                   {/* Arrow button */}
                   <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md">
                     <ArrowUpRight className="w-6 h-6 text-black" />
                   </div>
       
                   {/* Centered content */}
                   <div className="text-center">
                     <p className="text-5xl font-bold text-black">{item.count}</p>
                     <p className="text-3xl font-semibold">{item.label}</p>
                   </div>
                 </div>
               ))}
             </div>

        {/* Doctor Table - only visible when "READY TO SEE" clicked */}
        {showTable && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-lg"> {/* 🔥 bigger font */}
              <thead>
                <tr className="bg-gray-800 text-white">
                  {tableHeaders.map((head, i) => (
                    <th key={i} className="px-6 py-4 text-left"> {/* 🔥 increased padding */}
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {patients.map((p, i) => (
                  <tr key={i} className="bg-[#6D94C5] text-black hover:bg-[#5479A3] transition">
                    <td className="px-6 py-4">{p.opNumber}</td>
                    <td
                      className="px-6 py-4 underline cursor-pointer text-blue-900 hover:text-white"
                      onClick={() => setSelectedPatient(p)} // ✅ open modal
                    >
                      {p.name}
                    </td>
                    <td className="px-6 py-4">{p.age}</td>
                    <td className="px-6 py-4">{p.sex}</td>
                    <td className="px-6 py-4">{p.inTime}</td>
                    <td className="px-6 py-4">{p.token}</td>
                    <td className="px-6 py-4">{p.waiting}</td>
                    <td className="px-6 py-4">{p.type}</td>
                    <td className="px-6 py-4">{p.fee}</td>
                    <td className="px-6 py-4">{p.scheme}</td>
                    <td className="px-6 py-4">{p.category}</td>
                    <td className="px-6 py-4">{p.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ✅ Popup Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md">
          <Profile onClose={() => setSelectedPatient(null)} />
        </div>
      )}
    </div>
  );
}
