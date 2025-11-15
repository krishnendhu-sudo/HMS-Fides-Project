import React, { useEffect, useState } from "react";

export default function Diagnosis({ onClose, onDataChange }) {
  const diagnoses = [
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

  // Normalize function (case-insensitive, dash & space insensitive)
  const normalize = (s = "") =>
    s
      .toString()
      .trim()
      .replace(/–|—/g, "-")
      .replace(/\s+/g, " ")
      .toLowerCase();

  const normalizedDiagnoses = diagnoses.map(normalize);

  const [selected, setSelected] = useState({});
  const [selectedList, setSelectedList] = useState([{ diagnosis: "", eye: "" }]);
  const [doctorComments, setDoctorComments] = useState({ LE: "", RE: "" });

  // --- Utility functions ---
  const ensureBlankRow = (list) => {
    const hasBlank = list.some((r) => !r.diagnosis?.trim());
    const filled = list.filter((r) => r.diagnosis?.trim());
    return hasBlank ? [...filled, { diagnosis: "", eye: "" }] : [...filled, { diagnosis: "", eye: "" }];
  };

  const uniqueBottom = (list) => {
    const seen = new Set();
    return list.filter(({ diagnosis, eye }) => {
      const key = diagnosis ? `${normalize(diagnosis)}|${eye}` : `blank`;
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

  // --- Handlers ---
  const toggleCheck = (eye, index) => {
    const keyR = `${index}-right`, keyL = `${index}-left`, keyB = `${index}-both`;
    const diag = diagnoses[index];
    setSelected((prev) => {
      const next = { ...prev };
      if (eye === "both") {
        const val = !prev[keyB];
        next[keyR] = next[keyL] = next[keyB] = val;
      } else {
        next[`${index}-${eye}`] = !prev[`${index}-${eye}`];
        next[keyB] = next[keyR] && next[keyL];
      }

      // Sync to bottom section
      setSelectedList((prevList) => {
        const norm = normalize(diag);
        const filtered = prevList.filter((x) => normalize(x.diagnosis) !== norm);
        const eyeVal = getEye(next, index);
        if (eyeVal) filtered.push({ diagnosis: diag, eye: eyeVal });
        return ensureBlankRow(uniqueBottom(filtered));
      });

      return next;
    });
  };

  const handleEdit = (i, field, val) => {
    setSelectedList((prev) => {
      const list = [...prev];
      list[i] = { ...list[i], [field]: val };

      const { diagnosis, eye } = list[i];
      const norm = normalize(diagnosis);
      const matchIndex = normalizedDiagnoses.findIndex((d) => d === norm);

      if (diagnosis && eye && matchIndex !== -1) {
        setSelected((prev) => {
          const next = { ...prev };
          next[`${matchIndex}-right`] = next[`${matchIndex}-left`] = next[`${matchIndex}-both`] = false;
          if (eye === "both") next[`${matchIndex}-right`] = next[`${matchIndex}-left`] = next[`${matchIndex}-both`] = true;
          else if (eye === "right") next[`${matchIndex}-right`] = true;
          else if (eye === "left") next[`${matchIndex}-left`] = true;
          return next;
        });

        // Remove duplicate diagnosis
        const cleaned = list.filter((x, idx) => idx === i || normalize(x.diagnosis) !== norm);
        return ensureBlankRow(uniqueBottom(cleaned));
      }

      return ensureBlankRow(uniqueBottom(list));
    });
  };

  useEffect(() => {
    setSelectedList((prev) => ensureBlankRow(uniqueBottom(prev)));
  }, []);

  const handleReset = () => {
    setSelected({});
    setSelectedList([{ diagnosis: "", eye: "" }]);
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

  const handleSubmit = () => {
    const valid = selectedList.filter((x) => x.diagnosis?.trim());
    console.log(valid);
    
    // Pass all valid diagnoses as a list
    if (onDataChange) {
      const diagnosisList = valid.map((item) => ({
        condition: item.diagnosis || "",
        eye: capitalizeEye(item.eye),
      }));
      
      onDataChange({
        diagnosisList: diagnosisList,
        doctorComments: doctorComments,
      });
    }
    
    alert("Diagnosis submitted successfully!");
    if (onClose) onClose();
  };
  
  // Also notify parent when data changes (optional - for real-time updates)
  useEffect(() => {
    if (onDataChange && selectedList.length > 0) {
      const valid = selectedList.filter((x) => x.diagnosis?.trim());
      if (valid.length > 0) {
        const diagnosisList = valid.map((item) => ({
          condition: item.diagnosis || "",
          eye: capitalizeEye(item.eye),
        }));
        
        onDataChange({
          diagnosisList: diagnosisList,
          doctorComments: doctorComments,
        });
      }
    }
  }, [selectedList, doctorComments, onDataChange]);

  // --- UI ---
  return (
    <div className="bg-white mb-20 w-full rounded-2xl shadow-lg p-6 overflow-y-auto max-h-[90vh] relative">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
      >
        ✕
      </button>

      <div className="w-full m-5 mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6 uppercase text-center">
          Diagnosis (Selection Table)
        </h2>

        {/* Diagnosis table */}
        <div className="overflow-hidden">
          <div className="grid m-3 grid-cols-4 gap-4 text-center">
            {["DIAGNOSIS", "RIGHT", "LEFT", "BOTH"].map((h) => (
              <div key={h} className="flex justify-center">
                <div className="px-6 py-2 font-semibold rounded-full bg-[#F7DACD] w-fit">
                  {h}
                </div>
              </div>
            ))}
          </div>

          {diagnoses.map((diag, i) => (
            <div
              key={i}
              className={`grid grid-cols-4 items-center text-sm transition ${
                selectedList.some((x) => normalize(x.diagnosis) === normalize(diag))
                  ? "bg-[#FFF3EE]"
                  : ""
              }`}
            >
              <div className="p-3 text-base md:text-lg font-medium text-center md:text-left">
                {diag}
              </div>
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

        {/* Selected Diagnosis */}
        <div className="m-5 mt-10">
          <h1 className="text-2xl font-bold mb-3">SELECTED DIAGNOSIS</h1>
          <div className="rounded-lg bg-[#F7DACD] p-6 w-full space-y-6">
            {selectedList.map((item, idx) => (
              <div
                key={idx}
                className="rounded-lg  p-6 flex flex-col md:flex-row gap-6 items-center justify-between"
              >
                <div className="flex-1">
                  <h2 className="font-semibold text-lg mb-2">Diagnosis</h2>
                  <input
                    type="text"
                    placeholder="Enter exact diagnosis name"
                    value={item.diagnosis}
                    onChange={(e) => handleEdit(idx, "diagnosis", e.target.value)}
                    className="w-full bg-white rounded-full px-20 py-2"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-lg mb-2">Selected Eye</h2>
                  <select
                    value={item.eye}
                    onChange={(e) => handleEdit(idx, "eye", e.target.value)}
                    className="w-full bg-white rounded-full px-20 py-2"
                  >
                    <option value="">Select Eye</option>
                    <option value="right">Right</option>
                    <option value="left">Left</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor Comments */}
        <div className="m-5">
          <h1 className="font-semibold mb-5 text-2xl">DOCTOR COMMENTS</h1>
          <div className="space-y-8">
            {["LE", "RE"].map((eye) => (
              <div key={eye}>
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
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-10 mb-10">
          <button
            onClick={handleReset}
            className="bg-green-500 hover:bg-green-700 text-white font-semibold px-10 py-3 rounded-full shadow-md"
          >
            Reset
          </button>
          <button
            onClick={handleSubmit}
            className="bg-red-500 hover:bg-red-700 text-white font-semibold px-10 py-3 rounded-full shadow-md"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
