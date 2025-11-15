import { useState } from "react";

export default function ProductEnquiry() {
  const [filters, setFilters] = useState({
    doctor: "",
    fromDate: "",
    toDate: "",
    status: "",
  });

  const orders = [
    {
      si: 1,
      item: "Laser Diode Module",
      brand: "Thorlabs",
      size: "635 nm, 5 mW",
      qty: 2,
      unit: 200,
      amount: 1200,
    },
    {
      si: 2,
      item: "Laser Diode Module",
      brand: "Thorlabs",
      size: "635 nm, 5 mW",
      qty: 2,
      unit: 200,
      amount: 1200,
    },
  ];

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    console.log("Searching with filters:", filters);
  };

  return (
    <div className="p-4 sm:p-6 bg-[#CBDCEB] rounded-lg shadow-md">
      <h2 className="text-2xl sm:text-3xl font-poppins mb-6">Product Enquiry</h2>

      {/* Filter Section */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-6">
        <div>
          <label className="block text-lg sm:text-2xl font-poppins mb-2">Doctor</label>
          <input
            type="text"
            name="doctor"
            value={filters.doctor}
            onChange={handleChange}
            className="border p-2 rounded-full w-full"
          />
        </div>
        <div>
          <label className="block text-lg sm:text-2xl font-poppins mb-2">From Date</label>
          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleChange}
            className="border p-2 rounded-full w-full"
          />
        </div>
        <div>
          <label className="block text-lg sm:text-2xl font-poppins mb-2">To Date</label>
          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleChange}
            className="border p-2 rounded-full w-full"
          />
        </div>
        <div>
          <label className="block text-lg sm:text-2xl font-poppins mb-2">Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="border p-2 rounded-full w-full"
          >
            <option value="">Select</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Delivered</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 w-full"
          >
            Search
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table
          className="w-full border-separate text-sm"
          style={{ borderSpacing: "0 12px" }}
        >
          <thead>
            <tr className="bg-[#000000C2] text-left text-white uppercase text-sm sm:text-1xl font-poppins">
              <th className="px-2 sm:px-4 py-3">Sl. No</th>
              <th className="px-2 sm:px-4 py-3">Item Description</th>
              <th className="px-2 sm:px-4 py-3">Brand</th>
              <th className="px-2 sm:px-4 py-3">Size / Spec</th>
              <th className="px-2 sm:px-4 py-3">Qty</th>
              <th className="px-2 sm:px-4 py-3">Unit Price (₹)</th>
              <th className="px-2 sm:px-4 py-3">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.si}
                className="border-b bg-[#FBBC04B8] hover:bg-gray-50 mb-2"
              >
                <td className="px-2 sm:px-4 py-2">{order.si}</td>
                <td className="px-2 sm:px-4 py-2">{order.item}</td>
                <td className="px-2 sm:px-4 py-2">{order.brand}</td>
                <td className="px-2 sm:px-4 py-2">{order.size}</td>
                <td className="px-2 sm:px-4 py-2">{order.qty}</td>
                <td className="px-2 sm:px-4 py-2">{order.unit}</td>
                <td className="px-2 sm:px-4 py-2">{order.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
