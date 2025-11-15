import React, { useState } from "react";
import TotalIcon from "../../../public/icons/TotalIcon.png";
import LowIcon from "../../../public/icons/Lowicon.png";
import ExpiryIcon from "../../../public/icons/ExpiryIcon.png";
import OutIcon from "../../../public/icons/OutIcon.png";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiEdit, FiEye, FiTrash2 } from "react-icons/fi";

// ✅ Changed to a normal function (NOT default export)
function SupplierTable({ suppliers, toggleStatus, deleteItem, getStatusBadge, navigate }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-y-4 text-lg">
        <thead className="bg-gray-800 h-[129px] text-white">
          <tr>
            <th className="px-6 py-3 text-left">Item ID</th>
            <th className="px-6 py-3 text-left">Item Name</th>
            <th className="px-6 py-3 text-left">Category</th>
            <th className="px-6 py-3 text-left">Quantity</th>
            <th className="px-6 py-3 text-left">Location</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-left">Last Updated</th>
            <th className="px-6 py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr
              key={supplier.id}
              className="bg-[#CBDCEB] h-[122px] shadow-md rounded-lg"
            >
              <td className="px-6 py-4 font-medium">{supplier.id}</td>
              <td className="px-6 py-4">{supplier.name}</td>
              <td className="px-6 py-4">{supplier.category}</td>
              <td className="px-6 py-4">{supplier.quantity}</td>
              <td className="px-6 py-4">{supplier.location}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(
                    supplier.status
                  )}`}
                >
                  {supplier.status}
                </span>
              </td>
              <td className="px-6 py-4">{supplier.lastUpdated}</td>
              <td className="px-6 py-4 flex justify-center gap-4">
                {/* Edit Icon */}
                <FiEdit
                  className="text-blue-600 cursor-pointer hover:scale-110"
                  onClick={() => navigate(`/InventoryItems/`)}
                />
                {/* View Icon */}
                <FiEye
                  className="text-green-600 cursor-pointer hover:scale-110"
                  onClick={() => navigate(`/view-item/${supplier.id}`)}
                />
                {/* Delete Icon */}
                <FiTrash2
                  className="text-red-600 cursor-pointer hover:scale-110"
                  onClick={() => deleteItem(supplier.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const InventoryManag = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([
    {
      id: "SUP001",
      name: "Paracetamol 500mg",
      category: "Medicine",
      quantity: "1200",
      location: "Pharmacy Room A",
      status: "Out of Stock",
      lastUpdated: "2025-08-18",
    },
    {
      id: "SUP002",
      name: "Amoxicillin 250mg",
      category: "Medicine",
      quantity: "900",
      location: "Pharmacy Room B",
      status: "Low Stock",
      lastUpdated: "2025-08-18",
    },
    {
      id: "SUP003",
      name: "Vitamin C",
      category: "Supplement",
      quantity: "0",
      location: "Pharmacy Room A",
      status: "Expired",
      lastUpdated: "2025-08-18",
    },
    {
      id: "SUP004",
      name: "Ibuprofen 400mg",
      category: "Medicine",
      quantity: "3200",
      location: "Pharmacy Room C",
      status: "Available",
      lastUpdated: "2025-08-18",
    },
     {
      id: "SUP001",
      name: "Paracetamol 500mg",
      category: "Medicine",
      quantity: "1200",
      location: "Pharmacy Room A",
      status: "Out of Stock",
      lastUpdated: "2025-08-18",
    },
    {
      id: "SUP002",
      name: "Amoxicillin 250mg",
      category: "Medicine",
      quantity: "900",
      location: "Pharmacy Room B",
      status: "Low Stock",
      lastUpdated: "2025-08-18",
    },
    {
      id: "SUP003",
      name: "Vitamin C",
      category: "Supplement",
      quantity: "0",
      location: "Pharmacy Room A",
      status: "Expired",
      lastUpdated: "2025-08-18",
    },
    {
      id: "SUP004",
      name: "Ibuprofen 400mg",
      category: "Medicine",
      quantity: "3200",
      location: "Pharmacy Room C",
      status: "Available",
      lastUpdated: "2025-08-18",
    },
  ]);

  // Toggle status
  const toggleStatus = (id) => {
    setSuppliers((prev) =>
      prev.map((supplier) =>
        supplier.id === id
          ? {
              ...supplier,
              status:
                supplier.status === "Available" ? "Out of Stock" : "Available",
            }
          : supplier
      )
    );
  };

  // Badge colors
  const getStatusBadge = (status) => {
    switch (status) {
      case "Available":
        return "bg-[#96E8B699] ";
      case "Low Stock":
        return "bg-[#F6FF0059] ";
      case "Expired":
        return "bg-[#FF9C9C]";
      case "Out of Stock":
        return "bg-[#00000061]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Delete item
  const deleteItem = (id) => {
    setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));
  };

  return (
    <div className="p-8">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 text-start">
        INVENTORY MANAGEMENT SYSTEM
      </h1>

     {/* Summary Cards */}
{/* Summary Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
  {/* Card 1 */}
  <div className="bg-[#CBDCEB] rounded-2xl p-6 flex flex-col justify-between">
    <div className="flex items-center gap-3">
     <div className=" flex items-center justify-center bg-[#96E8B699] rounded-full w-[60px] h-[60px]">
      <img
        src={TotalIcon}
        alt=""
        
      />
      </div>
      <h1 className="text-lg font-bold">Total Items</h1>
    </div>
    <p className="text-lg mt-1">Total Items in Stock</p>
    <h1 className="text-2xl font-extrabold mt-4 text-right">370</h1>
  </div>

  {/* Card 2 */}
  <div className="bg-[#CBDCEB] rounded-2xl p-6 flex flex-col justify-between">
    <div className="flex items-center gap-3">
    <div className=" flex items-center justify-center bg-[#F6FF0059] rounded-full w-[60px] h-[60px]">
      <img
        src={LowIcon}
        alt=""
       
      />
      </div>
      <h1 className="text-lg font-bold">Low Stock Items</h1>
    </div>
    <p className="text-lg mt-1">Number of items that are running low</p>
    <h1 className="text-2xl font-extrabold  mt-4 text-right">8</h1>
  </div>

  {/* Card 3 */}
  <div className="bg-[#CBDCEB] rounded-2xl p-6 flex flex-col justify-between">
    <div className="flex items-center gap-3">
    <div  className=" flex items-center justify-center bg-[#FF9C9C] rounded-full w-[60px] h-[60px]">

   
      <img
        src={ExpiryIcon}
        alt=""
       
      />
       </div>
      <h1 className="text-lg font-bold">Expired Items</h1>
    </div>
    <p className="text-lg mt-1">Number of items that past their Expiration date</p>
    <h1 className="text-2xl font-extrabold mt-4 text-right">6</h1>
  </div>

  {/* Card 4 */}
  <div className="bg-[#CBDCEB] rounded-2xl p-6 flex flex-col justify-between">
    <div className="flex items-center gap-3">
    <div  className=" flex items-center justify-center bg-[#00000061] rounded-full w-[60px] h-[60px]">
      <img
        src={OutIcon}
        alt=""
       
      />
      </div>
      <h1 className="text-lg font-bold">Out of Stock</h1>
    </div>
    <p className="text-lg mt-1">Count items that are out of stock</p>
    <h1 className="text-2xl font-extrabold text-[#333333] mt-4 text-right">20</h1>
  </div>
</div>

    <h1 className="text-3xl font-semibold  mb-4">Complete Hospital Inventory Table</h1>
      <div className="flex justify-end items-center gap-4 mb-4">
  {/* Search Input */}
  <div className="flex items-center border rounded-lg px-3 py-2 bg-white shadow-sm w-1/3">
    <FiSearch className="text-gray-500 mr-2" />
    <input
      type="text"
      placeholder="Search..."
      className="outline-none flex-1 text-gray-700"
    />
  </div>

  {/* Add Item Button */}
  <button
    onClick={() => navigate("/InventoryItems")}
    className="bg-green-600 text-xl text-white px-5 py-2 rounded-full font-semibold transition"
  >
    + Add Item
  </button>
</div>

      {/* ✅ Supplier Table Component */}
      <SupplierTable
        suppliers={suppliers}
        toggleStatus={toggleStatus}
        deleteItem={deleteItem}
        getStatusBadge={getStatusBadge}
        navigate={navigate}
      />
    </div>
  );
};

export default InventoryManag;
