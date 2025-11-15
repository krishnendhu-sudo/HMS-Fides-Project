import React, { useState } from "react";

const InventoryItems = ({ navigate }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");

  const handleActionChange = (e) => {
    const action = e.target.value;
    setSelectedAction(action);

    if (action === "add" || action === "remove") {
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedAction("");
  };

  return (
    <div className="max-w-7xl  m-10 mx-auto p-8 bg-[#CBDCEB] shadow-lg rounded-xl">
      

     {/* Form Layout */}
<div className="grid grid-cols-1 text-xl md:grid-cols-3 gap-6">
  <div>
    <label className="block font-medium">Item ID</label>
    <input
      type="text"
      className="w-full border border-black bg-transparent rounded-lg px-3 py-2 mt-1"
    />
  </div>
  <div>
    <label className="block font-medium">Item Name</label>
    <input
      type="text"
      className="w-full border border-black bg-transparent rounded-lg px-3 py-2 mt-1"
    />
  </div>
  <div>
    <label className="block font-medium">Category</label>
    <input
      type="text"
      className="w-full border border-black bg-transparent rounded-lg px-3 py-2 mt-1"
    />
  </div>

  <div>
    <label className="block font-medium">Quantity</label>
    <input
      type="number"
      className="w-full border border-black bg-transparent rounded-lg px-3 py-2 mt-1"
    />
  </div>
  <div>
    <label className="block font-medium">Location</label>
    <input
      type="text"
      className="w-full border border-black bg-transparent rounded-lg px-3 py-2 mt-1"
    />
  </div>
  <div>
    <label className="block font-medium">Status</label>
    <input
      type="text"
      className="w-full border border-black bg-transparent rounded-lg px-3 py-2 mt-1"
    />
  </div>

  <div>
    <label className="block font-medium">Last Updated</label>
    <input
      type="date"
      className="w-full border border-black bg-transparent rounded-lg px-3 py-2 mt-1"
    />
  </div>
  <div>
    <label className="block font-medium">Action</label>
    <select
      value={selectedAction}
      onChange={handleActionChange}
      className="w-full border border-black bg-transparent rounded-lg px-3 py-2 mt-1"
    >
      <option value="">Select Action</option>
      <option value="add">Add Item</option>
      <option value="remove">Remove Item</option>
    </select>
  </div>
</div>


      {/* Buttons */}
<div className="flex flex-col pt-20 items-center gap-4 mt-8">
  <button className="h-[74px] w-[500px] text-4xl bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition">
    Submit
  </button>
  <button className="h-[74px] w-[500px] text-4xl bg-red-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-500 transition">
    Cancel
  </button>
</div>

    
      {/* Popup */}
{showPopup && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div className="bg-white rounded-xl w-[420px] shadow-xl flex flex-col">
      {/* Heading tabs */}
      <div className="flex p-5 justify-center gap-4 mt-4">
        <button
          onClick={() => setSelectedAction("add")}
          className={`px-4 py-2 rounded-full  w-[250px] border font-semibold ${
            selectedAction === "add"
              ? "bg-[#6D94C5]"
              : "bg-white text-gray-700 border-gray-400 hover:bg-gray-100"
          }`}
        >
          Add Item
        </button>
        <button
          onClick={() => setSelectedAction("remove")}
          className={`px-4 py-2 rounded-full w-[250px] border font-semibold ${
            selectedAction === "remove"
              ? "bg-[#6D94C5]"
              : "bg-gray-200 text-gray-700  hover:bg-white"
          }`}
        >
          Remove Item
        </button>
      </div>

      {/* Form inputs */}
      <div className="p-6 flex-1 space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            className="w-full border rounded-lg px-3 py-2  focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

       {/* Footer buttons */}
<div className="flex flex-col items-center gap-3 p-4 ">
  <button
    type="submit"
    className={`w-full px-6 py-2 text-[32px] font-semibold rounded-lg text-white transition ${
      selectedAction === "add"
        ? "bg-green-600 hover:bg-green-700"
        : "bg-green-600 hover:bg-green-700"
    }`}
  >
    Submit
  </button>
  <button
    onClick={closePopup}
    className="w-full text-[32px] font-semibold bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
  >
    Cancel
  </button>
</div>

    </div>
  </div>
)}

    </div>
  );
};

export default InventoryItems;
