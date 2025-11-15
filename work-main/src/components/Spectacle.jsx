import React from "react";

const Spectacle = ({ data = {}, onChange, viewOnly = false }) => {
  const handleChange = (e) => {
    if (viewOnly) return; // prevent editing
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleReset = () => {
    if (viewOnly) return;
    onChange({
      lens_type: "",
      lens_material: "",
      lens_coating: "",
      lens_power_le: "",
      lens_power_re: "",
      axis_le: "",
      axis_re: "",
      cylinder_le: "",
      cylinder_re: "",
      addition_near: "",
      remarks: "",
    });
  };

  const inputClass = (viewOnlyMode) =>
    `w-full p-3 rounded-2xl ${
      viewOnlyMode ? "bg-gray-100 text-gray-600 cursor-not-allowed" : "bg-white"
    }`;

  return (
    <div className="p-6">
      {/* Heading */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold inline-block bg-[#F7DACD] px-6 py-2 rounded-full">
          SPECTACLE & LENS DETAILS
        </h1>
        {!viewOnly && (
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
          >
            Reset
          </button>
        )}
      </div>

      {/* Grid container */}
      <div className={`grid grid-cols-1 gap-6 bg-[#F7DACD] p-6 rounded-xl`}>
        {/* Block 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-lg mb-2">Lens Type</p>
            <input
              type="text"
              name="lens_type"
              value={data.lens_type || ""}
              onChange={handleChange}
              disabled={viewOnly}
              className={inputClass(viewOnly)}
            />
          </div>
          <div>
            <p className="text-lg mb-2">Lens Material</p>
            <input
              type="text"
              name="lens_material"
              value={data.lens_material || ""}
              onChange={handleChange}
              disabled={viewOnly}
              className={inputClass(viewOnly)}
            />
          </div>
          <div>
            <p className="text-lg mb-2">Lens Coating</p>
            <input
              type="text"
              name="lens_coating"
              value={data.lens_coating || ""}
              onChange={handleChange}
              disabled={viewOnly}
              className={inputClass(viewOnly)}
            />
          </div>
        </div>

        {/* Block 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-lg mb-2">Lens Power (RE)</p>
            <input
              type="text"
              name="lens_power_re"
              value={data.lens_power_re || ""}
              onChange={handleChange}
              disabled={viewOnly}
              className={inputClass(viewOnly)}
            />
          </div>
          <div>
            <p className="text-lg mb-2">Lens Power (LE)</p>
            <input
              type="text"
              name="lens_power_le"
              value={data.lens_power_le || ""}
              onChange={handleChange}
              disabled={viewOnly}
              className={inputClass(viewOnly)}
            />
          </div>
          <div>
            <p className="text-lg mb-2">Cylinder (RE)</p>
            <input
              type="text"
              name="cylinder_re"
              value={data.cylinder_re || ""}
              onChange={handleChange}
              disabled={viewOnly}
              className={inputClass(viewOnly)}
            />
          </div>
        </div>

        {/* Block 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-lg mb-2">Cylinder (LE)</p>
            <input
              type="text"
              name="cylinder_le"
              value={data.cylinder_le || ""}
              onChange={handleChange}
              disabled={viewOnly}
              className={inputClass(viewOnly)}
            />
          </div>
          <div>
            <p className="text-lg mb-2">Axis (RE)</p>
            <input
              type="text"
              name="axis_re"
              value={data.axis_re || ""}
              onChange={handleChange}
              disabled={viewOnly}
              className={inputClass(viewOnly)}
            />
          </div>
          <div>
            <p className="text-lg mb-2">Axis (LE)</p>
            <input
              type="text"
              name="axis_le"
              value={data.axis_le || ""}
              onChange={handleChange}
              disabled={viewOnly}
              className={inputClass(viewOnly)}
            />
          </div>
        </div>

        {/* Block 4 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-lg mb-2">Addition (Near)</p>
            <input
              type="text"
              name="addition_near"
              value={data.addition_near || ""}
              onChange={handleChange}
              disabled={viewOnly}
              className={inputClass(viewOnly)}
            />
          </div>
          <div>
            <p className="text-lg mb-2">Remarks</p>
            <input
              type="text"
              name="remarks"
              value={data.remarks || ""}
              onChange={handleChange}
              disabled={viewOnly}
              className={inputClass(viewOnly)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Spectacle;
