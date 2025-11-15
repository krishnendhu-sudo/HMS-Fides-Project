import React, { useState } from "react";

const conditions = [
  "Diabetes",
  "Blood Pressure",
  "Cholesterol",
  "Thyroid",
  "Heart Disease",
  "Allergies",
];

const ClinicalFindings = () => {
  const [activeCondition, setActiveCondition] = useState(null);
  const [conditionData, setConditionData] = useState({});

  // Handle checkbox selection
  const handleCheckboxChange = (condition) => {
    setActiveCondition(condition);
    if (!conditionData[condition]) {
      setConditionData((prev) => ({
        ...prev,
        [condition]: { suggestion: "", remark: "" },
      }));
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    if (activeCondition) {
      setConditionData((prev) => ({
        ...prev,
        [activeCondition]: { ...prev[activeCondition], [field]: value },
      }));
    }
  };

  return (
    <div className="p-6">
      {/* Heading */}
      <h1 className="text-3xl font-bold inline-block bg-[#CBDCEB] px-6 py-2 rounded-full">
        CLINICAL FINDINGS
      </h1>

      <div className="bg-[#CBDCEB] p-7 mt-4 rounded-2xl">
        {/* Conditions checkboxes */}
        <div className="flex flex-wrap gap-4">
          {conditions.map((condition) => (
            <label
              key={condition}
              className={`flex px-6 py-2 text-lg rounded-full items-center gap-2 cursor-pointer ${
                activeCondition === condition
                  ? "bg-[#4A6FA5] text-white"
                  : "bg-[#6D94C5]"
              }`}
            >
              <input
                type="checkbox"
                checked={activeCondition === condition}
                onChange={() => handleCheckboxChange(condition)}
              />
              {condition}
            </label>
          ))}
        </div>

        {/* Fixed position input fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <p className="text-xl mb-2">
              {activeCondition ? `${activeCondition} - Suggestions` : "Suggestions"}
            </p>
            <input
              type="text"
              disabled={!activeCondition}
              value={
                activeCondition
                  ? conditionData[activeCondition]?.suggestion || ""
                  : ""
              }
              onChange={(e) =>
                handleInputChange("suggestion", e.target.value)
              }
              className="w-full h-[74px] mb-6 bg-white rounded-2xl p-3 focus:outline-none border border-gray-300 "
            />
          </div>

          <div>
            <p className="text-xl mb-2">
              {activeCondition ? `${activeCondition} - Remarks` : "Remarks"}
            </p>
            <input
              type="text"
              disabled={!activeCondition}
              value={
                activeCondition ? conditionData[activeCondition]?.remark || "" : ""
              }
              onChange={(e) => handleInputChange("remark", e.target.value)}
              className="w-full h-[74px] mb-6 bg-white rounded-2xl p-3 focus:outline-none border border-gray-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalFindings;
