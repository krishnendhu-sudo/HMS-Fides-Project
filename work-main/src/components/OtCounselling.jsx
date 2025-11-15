import React, { useState, useEffect } from "react";
import { Check, RefreshCcw } from "lucide-react";
import subima from "../assets/subima.png";

export default function OTCounselling({ onClose, onDataChange }) {
  const [selected, setSelected] = useState({});
  const [adviceData, setAdviceData] = useState([{ advice: "", eye: "" }]);
  const [showPopup, setShowPopup] = useState(false);

  // Sample procedures for OT counselling
  const procedures = [
    "CATARACT SURGERY",
    "GLAUCOMA SURGERY",
    "STRABISMUS CORRECTION",
    "LENS IMPLANT",
    "CORNEAL TRANSPLANT",
    "RETINAL DETACHMENT",
  ];

  // Toggle checkboxes
  const toggleCheck = (eye, index) => {
    if (eye === "both") {
      setSelected((prev) => {
        const isChecked = !(prev[`${index}-right`] && prev[`${index}-left`]);
        return {
          ...prev,
          [`${index}-right`]: isChecked,
          [`${index}-left`]: isChecked,
        };
      });
    } else {
      setSelected((prev) => ({
        ...prev,
        [`${index}-${eye}`]: !prev[`${index}-${eye}`],
      }));
    }
  };

  // Handle advice field changes
  const handleAdviceChange = (index, field, value) => {
    const updated = [...adviceData];
    updated[index][field] = value;
    setAdviceData(updated);
  };

  // Add new advice row
  const addAdviceRow = () => {
    setAdviceData([...adviceData, { advice: "", eye: "" }]);
  };

  // Helper to capitalize eye value
  const capitalizeEye = (eye) => {
    if (!eye) return "";
    const lower = eye.toLowerCase();
    if (lower === "right" || lower === "re") return "Right";
    if (lower === "left" || lower === "le") return "Left";
    if (lower === "both") return "Both";
    return eye; // fallback
  };

  // Submit → show popup
  const handleSubmit = () => {
    // Build OT counselling list from selected procedures and advice
    const otCounsellingList = [];
    
    // Add selected procedures
    procedures.forEach((proc, i) => {
      if (selected[`${i}-right`] || selected[`${i}-left`]) {
        let eye = "Both";
        if (selected[`${i}-right`] && !selected[`${i}-left`]) eye = "Right";
        if (!selected[`${i}-right`] && selected[`${i}-left`]) eye = "Left";
        
        otCounsellingList.push({
          procedure_name: proc,
          eye: eye,
          remarks: null,
          consent: null,
        });
      }
    });
    
    // Add advice items
    adviceData.forEach((item) => {
      if (item.advice?.trim()) {
        otCounsellingList.push({
          procedure_name: item.advice,
          eye: capitalizeEye(item.eye),
          remarks: null,
          consent: null,
        });
      }
    });
    
    // Notify parent
    if (onDataChange) {
      onDataChange({
        otCounsellingList: otCounsellingList,
      });
    }
    
    setShowPopup(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, 2000);
  };

  // Reset → clear selections and history
  const handleReset = () => {
    setSelected({});
    setAdviceData([{ advice: "", eye: "" }]);
  };
  
  // Also notify parent when data changes (optional - for real-time updates)
  useEffect(() => {
    if (onDataChange) {
      const otCounsellingList = [];
      
      // Add selected procedures
      procedures.forEach((proc, i) => {
        if (selected[`${i}-right`] || selected[`${i}-left`]) {
          let eye = "Both";
          if (selected[`${i}-right`] && !selected[`${i}-left`]) eye = "Right";
          if (!selected[`${i}-right`] && selected[`${i}-left`]) eye = "Left";
          
          otCounsellingList.push({
            procedure_name: proc,
            eye: eye,
            remarks: null,
            consent: null,
          });
        }
      });
      
      // Add advice items
      adviceData.forEach((item) => {
        if (item.advice?.trim()) {
          otCounsellingList.push({
            procedure_name: item.advice,
            eye: capitalizeEye(item.eye),
            remarks: null,
            consent: null,
          });
        }
      });
      
      if (otCounsellingList.length > 0) {
        onDataChange({
          otCounsellingList: otCounsellingList,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, adviceData, onDataChange]);

  return (
    <div className="bg-white w-full rounded-2xl shadow-lg p-4 sm:p-6 overflow-y-auto max-h-[85vh] pb-20 relative">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
      >
        ✕
      </button>

      {/* Title */}
      <h2 className="text-2xl font-bold mb-4 uppercase text-center sm:text-left">
        OT Counselling
      </h2>

      {/* Responsive Procedure Section */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Header Row */}
          <div className="grid grid-cols-4 gap-2 text-center mb-3">
            {["PROCEDURE", "RIGHT", "LEFT", "BOTH"].map((header, i) => (
              <div key={i} className="flex justify-center">
                <span className="font-semibold bg-[#F7DACD]  py-2 px-6 rounded-full w-fit">
                  {header}
                </span>
              </div>
            ))}
          </div>

          {/* Procedure Rows */}
          {procedures.map((proc, i) => (
            <div
              key={i}
              className="grid grid-cols-4 text-sm items-center py-2"
            >
              <div className="p-3 text-left text-gray-800 font-medium">
                {proc}
              </div>

              <div className="p-3 flex justify-center">
                <input
                  type="checkbox"
                  checked={selected[`${i}-right`] || false}
                  onChange={() => toggleCheck("right", i)}
                  className="w-5 h-5 accent-green-600"
                />
              </div>

              <div className="p-3 flex justify-center">
                <input
                  type="checkbox"
                  checked={selected[`${i}-left`] || false}
                  onChange={() => toggleCheck("left", i)}
                  className="w-5 h-5 accent-green-600"
                />
              </div>

              <div className="p-3 flex justify-center">
                <input
                  type="checkbox"
                  checked={
                    (selected[`${i}-right`] && selected[`${i}-left`]) || false
                  }
                  onChange={() => toggleCheck("both", i)}
                  className="w-5 h-5 accent-green-600"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advice Section */}
      <div className="mt-10 relative">
        <h1 className="text-xl font-bold mb-4">CURRENT ADVICES</h1>

        <div className="bg-[#F7DACD] p-6 rounded-2xl">
          <div className="grid grid-cols-2 text-lg font-semibold mb-4">
            <p>ADVICE</p>
            <p className="text-right">EYE</p>
          </div>

          {adviceData.map((item, i) => (
            <div key={i} className="grid grid-cols-2 gap-4 items-center mb-4">
              <input
                type="text"
                placeholder="Enter advice"
                value={item.advice}
                onChange={(e) => handleAdviceChange(i, "advice", e.target.value)}
                className="bg-white rounded-full px-4 py-2 shadow text-sm sm:text-base"
              />
              <input
                type="text"
                placeholder="Enter eye (e.g., LE / RE / Both)"
                value={item.eye}
                onChange={(e) => handleAdviceChange(i, "eye", e.target.value)}
                className="bg-white rounded-full px-4 py-2 shadow text-sm sm:text-base text-right"
              />
            </div>
          ))}

          {/* Add Button - moved to bottom right */}
          <div className="flex justify-end mt-6">
            <button
              onClick={addAdviceRow}
              className="bg-gray-400 px-6 py-2 rounded-full hover:bg-blue-700"
            >
              + Add Advice
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-4 mt-10">
        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-2 rounded-full hover:bg-red-800"
        >
          <RefreshCcw size={18} /> Reset
        </button>
        <button
          onClick={handleSubmit}
          className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700"
        >
          <Check size={18} /> Submit
        </button>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg relative w-[90%] sm:w-auto">
            <img src={subima} alt="Success" className="mx-auto mb-4 w-32" />
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-red-500 font-bold"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
