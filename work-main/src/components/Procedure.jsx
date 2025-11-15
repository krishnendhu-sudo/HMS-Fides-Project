import React, { useState, useEffect } from "react";
import subimg from "../assets/subima.png";

export default function Procedure({ onClose, onDataChange }) {
  const [selected, setSelected] = useState({});
  const [selectedList, setSelectedList] = useState([{ procedure: "", eye: "", amount: "" }]);
  const [doctorComments, setDoctorComments] = useState({ LE: "", RE: "" });
  const [showPopup, setShowPopup] = useState(false);

  const procedures = [
    "CATARACT - MATURE",
    "GLAUCOMA - OPEN ANGLE",
    "GLAUCOMA - ANGLECLOSURE",
    "STRABISMUS",
    "STRABISMUS – ESOTROPIA",
    "STRABISMUS – EXOTROPIA",
    "NEO VASCULARIZATION OF IRIS",
    "STRABISMUS – ACS",
    "STRABISMUS – IDS",
    "STRABISMUS – ICS",
  ];

  // normalize text (case-insensitive + remove spaces/dash variations)
  const normalize = (s = "") =>
    s
      .toString()
      .trim()
      .replace(/–|—/g, "-")
      .replace(/\s+/g, " ")
      .toLowerCase();

  const normalizedProcedures = procedures.map(normalize);

  // --- Utility functions ---
  const ensureBlankRow = (list) => {
    const hasBlank = list.some((r) => !r.procedure?.trim());
    const filled = list.filter((r) => r.procedure?.trim());
    return hasBlank ? [...filled, { procedure: "", eye: "", amount: "" }] : [...filled, { procedure: "", eye: "", amount: "" }];
  };

  const uniqueBottom = (list) => {
    const seen = new Set();
    return list.filter(({ procedure, eye }) => {
      const key = procedure ? `${normalize(procedure)}|${eye}` : "blank";
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const getEye = (sel, index) => {
    const r = sel[`${index}-right`];
    const l = sel[`${index}-left`];
    if (r && l) return "both";
    if (r) return "right";
    if (l) return "left";
    return "";
  };

  // --- Checkbox toggle ---
  const toggleCheck = (eye, index) => {
    const keyR = `${index}-right`;
    const keyL = `${index}-left`;
    const keyB = `${index}-both`;
    const proc = procedures[index];

    setSelected((prev) => {
      const next = { ...prev };
      if (eye === "both") {
        const val = !prev[keyB];
        next[keyR] = next[keyL] = next[keyB] = val;
      } else {
        next[`${index}-${eye}`] = !prev[`${index}-${eye}`];
        next[keyB] = next[keyR] && next[keyL];
      }

      // Sync selected list
      setSelectedList((prevList) => {
        const norm = normalize(proc);
        const filtered = prevList.filter((x) => normalize(x.procedure) !== norm);
        const eyeVal = getEye(next, index);
        if (eyeVal) filtered.push({ procedure: proc, eye: eyeVal, amount: "" });
        return ensureBlankRow(uniqueBottom(filtered));
      });

      return next;
    });
  };

  // --- Handle edits in bottom section ---
  const handleEdit = (i, field, val) => {
    setSelectedList((prev) => {
      const list = [...prev];
      list[i] = { ...list[i], [field]: val };

      const { procedure, eye } = list[i];
      const norm = normalize(procedure);
      const matchIndex = normalizedProcedures.findIndex((d) => d === norm);

      if (procedure && eye && matchIndex !== -1) {
        setSelected((prev) => {
          const next = { ...prev };
          next[`${matchIndex}-right`] = next[`${matchIndex}-left`] = next[`${matchIndex}-both`] = false;
          if (eye === "both") next[`${matchIndex}-right`] = next[`${matchIndex}-left`] = next[`${matchIndex}-both`] = true;
          else if (eye === "right") next[`${matchIndex}-right`] = true;
          else if (eye === "left") next[`${matchIndex}-left`] = true;
          return next;
        });

        const cleaned = list.filter((x, idx) => idx === i || normalize(x.procedure) !== norm);
        return ensureBlankRow(uniqueBottom(cleaned));
      }

      return ensureBlankRow(uniqueBottom(list));
    });
  };

  // --- Reset ---
  const handleReset = () => {
    setSelected({});
    setSelectedList([{ procedure: "", eye: "", amount: "" }]);
    setDoctorComments({ LE: "", RE: "" });
  };

  // Helper to capitalize eye value
  const capitalizeEye = (eye) => {
    if (!eye) return "";
    const lower = eye.toLowerCase();
    if (lower === "right") return "Right";
    if (lower === "left") return "Left";
    if (lower === "both") return "Both";
    return eye; // fallback
  };

  // --- Submit ---
  const handleSubmit = () => {
    const valid = selectedList.filter((x) => x.procedure?.trim());
    
    // Pass all valid procedures as a list
    if (onDataChange) {
      const procedureList = valid.map((item) => ({
        name: item.procedure || "",
        eye: capitalizeEye(item.eye),
        remarks: item.remarks || null,
        amount: item.amount || null,
      }));
      
      onDataChange({
        procedureList: procedureList,
        doctorComments: doctorComments,
      });
    }
    
    setShowPopup(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, 2000);
  };
  
  // Also notify parent when data changes (optional - for real-time updates)
  useEffect(() => {
    if (onDataChange && selectedList.length > 0) {
      const valid = selectedList.filter((x) => x.procedure?.trim());
      if (valid.length > 0) {
        const procedureList = valid.map((item) => ({
          name: item.procedure || "",
          eye: capitalizeEye(item.eye),
          remarks: item.remarks || null,
          amount: item.amount || null,
        }));
        
        onDataChange({
          procedureList: procedureList,
          doctorComments: doctorComments,
        });
      }
    }
  }, [selectedList, doctorComments, onDataChange]);

  return (
    <div className="bg-white mb-28 w-full rounded-2xl shadow-lg p-4 md:p-6 overflow-y-auto max-h-[90vh] relative">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold mb-4 uppercase text-center md:text-left">Procedure</h2>

      {/* ===== PROCEDURE TABLE ===== */}
      <div className="overflow-hidden">
        <div className="grid m-3 grid-cols-3 sm:grid-cols-4 gap-4 text-center">
          {["PROCEDURE", "RIGHT", "LEFT", "BOTH"].map((header, i) => (
            <div key={i} className="flex justify-center">
              <div className="px-6 py-2 font-semibold rounded-full bg-[#F7DACD] w-fit text-sm sm:text-base">
                {header}
              </div>
            </div>
          ))}
        </div>

        {procedures.map((proc, i) => (
          <div
            key={i}
            className={`grid grid-cols-3 sm:grid-cols-4 items-center text-sm md:text-base ${
              selectedList.some((x) => normalize(x.procedure) === normalize(proc))
                ? "bg-[#E9F1FB]"
                : ""
            }`}
          >
            <div className="p-3 text-center sm:text-left">{proc}</div>
            {["right", "left", "both"].map((eye) => (
              <div key={eye} className="p-3 flex justify-center">
                <input
                  type="checkbox"
                  checked={!!selected[`${i}-${eye}`]}
                  onChange={() => toggleCheck(eye, i)}
                  className="w-5 h-5 accent-green-600"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ===== SELECTED PROCEDURE ===== */}
      <div className="p-3 sm:p-6 w-full">
        <h1 className="text-xl font-bold mb-4">Selected Procedure</h1>
        <div className="rounded-2xl bg-[#F7DACD] p-6 space-y-6">
          {selectedList.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl  p-4  flex flex-col sm:flex-row gap-6 items-center justify-between"
            >
              <div className="flex-1 w-full">
                <h2 className="font-semibold mb-1 text-base">Procedure Name</h2>
                <input
                  type="text"
                  placeholder="Enter procedure"
                  value={item.procedure}
                  onChange={(e) => handleEdit(idx, "procedure", e.target.value)}
                  className="w-full bg-white rounded-full px-4 py-2"
                />
              </div>
              <div className="flex-1 w-full">
                <h2 className="font-semibold mb-1 text-base">Eye</h2>
                <select
                  value={item.eye}
                  onChange={(e) => handleEdit(idx, "eye", e.target.value)}
                  className="w-full bg-white rounded-full px-4 py-2"
                >
                  <option value="">Select Eye</option>
                  <option value="right">Right</option>
                  <option value="left">Left</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div className="flex-1 w-full">
                <h2 className="font-semibold mb-1 text-base">Amount</h2>
                <input
                  type="text"
                  placeholder="Enter amount"
                  value={item.amount}
                  onChange={(e) => handleEdit(idx, "amount", e.target.value)}
                  className="w-full bg-white rounded-full px-4 py-2"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== DOCTOR COMMENTS ===== */}
      <div className="mt-5 mb-20 w-full">
        <h1 className="font-semibold mb-5 text-2xl">Doctor Comments</h1>
        {["LE", "RE"].map((eye) => (
          <div key={eye} className="mb-8">
            <p className="mb-2 font-medium">{eye}</p>
            <textarea
              value={doctorComments[eye]}
              onChange={(e) =>
                setDoctorComments({ ...doctorComments, [eye]: e.target.value })
              }
              className="h-[120px] w-full bg-[#F7DACD] rounded-2xl p-3"
            />
          </div>
        ))}
      </div>

      {/* ===== BUTTONS ===== */}
      <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8 mb-10">
        <button
          onClick={handleReset}
          className="bg-red-500 hover:bg-red-700 text-white font-semibold px-10 py-3 rounded-full shadow-md"
        >
          Reset
        </button>
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-10 py-3 rounded-full shadow-md"
        >
          Submit
        </button>
      </div>

      {/* ===== POPUP ===== */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg relative">
            <img src={subimg} alt="Success" className="mx-auto mb-4 w-32" />
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-red-500 font-bold text-lg"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
