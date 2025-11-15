import React from "react";

const AddMedicines = () => {
  const medicines = [
    {
      name: "Paracetamol 500mg",
      brand: "Cipla",
      quantity: 120,
      unitPrice: "₹2.50",
      expireDate: "2026-03-15",
      type: "Tablet",
    },
    {
      name: "Amoxicillin 250mg",
      brand: "Sun Pharma",
      quantity: 80,
      unitPrice: "₹5.00",
      expireDate: "2025-12-01",
      type: "Capsule",
    },
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Add Medicines</h1>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-7 gap-4 bg-gray-100 p-4 border-b border-gray-200 text-sm font-semibold text-gray-700">
          <div>Medicine Name</div>
          <div>Brand</div>
          <div>Quantity</div>
          <div>Unit Price</div>
          <div>Expire Date</div>
          <div>Type</div>
          <div>Action</div>
        </div>

        {/* Table Rows */}
        {medicines.map((med, index) => (
          <div
            key={index}
            className="grid grid-cols-7 gap-4 p-4 border-b border-gray-200 text-sm text-gray-700 items-center hover:bg-gray-50"
          >
            <div className="font-medium text-blue-600">{med.name}</div>
            <div>{med.brand}</div>
            <div>{med.quantity}</div>
            <div>{med.unitPrice}</div>
            <div>{med.expireDate}</div>
            <div>{med.type}</div>
            <div className="flex flex-col gap-2">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-md text-sm">
                Edit
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md text-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddMedicines;
