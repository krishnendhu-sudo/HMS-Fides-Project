import { useState } from "react";

export default function NewOrder() {
  const [formData, setFormData] = useState({
    uhid: "",
    name: "",
    ageGender: "",
    barcode: "",
    product: "",
    price: "",
    amount: "",
    rightDist: { sph: "", cyl: "", axis: "", va: "" },
    rightNear: { sph: "", cyl: "", axis: "", va: "" },
    leftDist: { sph: "", cyl: "", axis: "", va: "" },
    leftNear: { sph: "", cyl: "", axis: "", va: "" },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNestedChange = (side, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [side]: { ...prev[side], [field]: value },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Order:", formData);
    alert("Order Created!");
  };

  const handleClear = () => {
    setFormData({
      uhid: "",
      name: "",
      ageGender: "",
      barcode: "",
      product: "",
      price: "",
      amount: "",
      rightDist: { sph: "", cyl: "", axis: "", va: "" },
      rightNear: { sph: "", cyl: "", axis: "", va: "" },
      leftDist: { sph: "", cyl: "", axis: "", va: "" },
      leftNear: { sph: "", cyl: "", axis: "", va: "" },
    });
  };

  return (
    <div className="relative p-4 sm:p-6">
      {/* Top Button */}
      <div className="flex justify-start mb-4">
        <button className="bg-[#CBDCEB] text-gray-700 px-6 sm:px-8 py-2 rounded-full font-bold text-lg sm:text-xl shadow">
          New Order
        </button>
      </div>

      {/* Form Container */}
      <div className="p-4 sm:p-6 bg-[#CBDCEB] rounded-lg shadow-md overflow-x-auto">
        <form onSubmit={handleSubmit}>
          {/* First Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {[
              { label: "UHID NO", name: "uhid" },
              { label: "Name", name: "name" },
              { label: "Age / Gender", name: "ageGender" },
            ].map((field) => (
              <div key={field.name} className="flex flex-col">
                <label className="mb-1 font-semibold">{field.label}</label>
                <input
                  type="text"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>
            ))}
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
            {[
              { label: "Barcode", name: "barcode", type: "text" },
              { label: "Product", name: "product", type: "text" },
              { label: "Price", name: "price", type: "number" },
              { label: "Amount", name: "amount", type: "number" },
            ].map((field) => (
              <div key={field.name} className="flex flex-col">
                <label className="mb-1 font-semibold">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>
            ))}
          </div>

          {/* RIGHT / LEFT Buttons */}
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between gap-4 my-6">
            <div className="bg-[#6D94C5] text-white px-16 sm:px-32 py-4 rounded text-xl sm:text-2xl font-bold text-center">
              RIGHT
            </div>
            <div className="bg-[#6D94C5] text-white px-16 sm:px-32 py-4 rounded text-xl sm:text-2xl font-bold text-center">
              LEFT
            </div>
          </div>

          {/* Two Sections */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {["left", "right"].map((side) => (
              <div key={side} className="p-2 sm:p-4 bg-white rounded shadow">
                <div className="grid grid-cols-5 gap-2 text-sm font-bold text-gray-600 mb-1">
                  <span></span>
                  <span>SPH</span>
                  <span>CYL</span>
                  <span>AXIS</span>
                  <span>VA</span>
                </div>
                {["Dist", "Near"].map((pos) => {
                  const stateKey = side + pos;
                  return (
                    <div
                      key={pos}
                      className="grid grid-cols-5 gap-2 items-center mb-2"
                    >
                      <label className="font-bold">{pos.toUpperCase()}</label>
                      {["sph", "cyl", "axis", "va"].map((field) => (
                        <input
                          key={field}
                          type="text"
                          value={formData[stateKey][field]}
                          onChange={(e) =>
                            handleNestedChange(stateKey, field, e.target.value)
                          }
                          className="border p-2 rounded w-full"
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Submit & Clear */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-6">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded font-bold w-full sm:w-auto"
            >
              SUBMIT
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-red-500 text-white px-6 py-2 rounded font-bold w-full sm:w-auto"
            >
              CLEAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
