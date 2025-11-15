import React, { useState } from "react";
import PrescribeMedi from "./PrescribeMedi"; // Your Medicine page
import MedicinKit from "./MedicinKit";       // Your Kit page
import Instruciton from "./Instruciton";     // Your Instruction page

const MedicineTabs = () => {
  const [selectedHeader, setSelectedHeader] = useState("Medicine");
  const headers = ["Medicine", "Kit", "Special instruction"];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-8xl mx-auto">
      {/* Header */}
      <h1 className="text-xl md:text-2xl font-bold mb-4">PRESCRIBE MEDICINE</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 w-full max-w-3xl mb-6">
        {headers.map((header) => (
          <div
            key={header}
            onClick={() => setSelectedHeader(header)}
            className={`flex-1 text-center px-4 py-2 cursor-pointer text-base md:text-xl font-semibold border rounded-full
              ${
                selectedHeader === header
                  ? "bg-[#6D94C5] text-white"
                  : "bg-white text-black"
              }
            `}
          >
            {header}
          </div>
        ))}
      </div>

      {/* Conditional Rendering of Pages */}
      <div>
        {selectedHeader === "Medicine" && <PrescribeMedi onClose={() => console.log("Medicine modal closed")} />}
        {selectedHeader === "Kit" && <MedicinKit />}
        {selectedHeader === "Special instruction" && <Instruciton />}
      </div>
    </div>
  );
};

export default MedicineTabs;
