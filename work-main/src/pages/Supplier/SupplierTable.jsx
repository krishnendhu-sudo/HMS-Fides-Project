import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SupplierTable = () => {
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState([
    {
      id: "SUP001",
      role: "Distributor",
      name: "John Doe",
      phone: "+91-345678",
      email: "john.doe@medsupply.com",
      address: "123 Medical St, City, State",
      status: true,
    },
    {
      id: "SUP002",
      role: "Wholesaler",
      name: "Jane Smith",
      phone: "+91-987654",
      email: "jane.smith@medsupply.com",
      address: "456 Pharma Ave, City, State",
      status: false,
    },
  ]);

  // Toggle status function
  const toggleStatus = (id) => {
    setSuppliers((prev) =>
      prev.map((supplier) =>
        supplier.id === id ? { ...supplier, status: !supplier.status } : supplier
      )
    );
  };

  return (
    <div className="p-6">
      {/* Header with Add Button */}
      <div className="flex justify-between mt-8 items-center mb-4">
        <h1 className="text-3xl font-bold">Supplier Table</h1>
        <button
          onClick={() => navigate("/AddSupplier")}
          className="bg-[#6D94C5] h-[40px] text-white px-4 py-1 rounded-lg text-2xl shadow-md"
        >
          + Add Supplier
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-9 h-[129px] text-lg">
          <thead className="bg-gray-800 h-[130px] text-white">
            <tr>
              <th className="px-6 py-4 text-left">Supplier ID</th>
              <th className="px-6 py-4 text-left">Supplier Role</th>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Phone</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Address</th>
              <th className="px-6 py-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr
                key={supplier.id}
                className="bg-[#CBDCEB] h-[167px] shadow-md text-2xl font-semibold rounded-lg"
              >
                <td className="px-6 py-4">{supplier.id}</td>
                <td className="px-6 py-4">{supplier.role}</td>
                <td className="px-6 py-4">{supplier.name}</td>
                <td className="px-6 py-4">{supplier.phone}</td>
                <td className="px-6 py-4">{supplier.email}</td>
                <td className="px-6 py-4">{supplier.address}</td>
                <td className="px-6 py-4">
                  {/* Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={supplier.status}
                      onChange={() => toggleStatus(supplier.id)}
                    />
                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-green-500 transition"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierTable;
