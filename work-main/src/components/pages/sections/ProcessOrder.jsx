import { useState } from "react";

export default function ProcessOrder() {
  const [filters, setFilters] = useState({
    doctor: "",
    fromDate: "",
    toDate: "",
    status: "",
  });

  const orders = [
    {
      id: 1,
      status: "Pending",
      uhd: "UHD001",
      patientName: "John Doe",
      orderStatus: "Processing",
      netAmount: 500,
      discount: 50,
      advance: 200,
      balance: 250,
      expDelivery: "2025-09-20",
      filterMob: "9876543210",
      orderDate: "2025-09-15",
      deliveryDate: "2025-09-20",
    },
    {
      id: 2,
      status: "Deliverd",
      uhd: "UHD002",
      patientName: "Alice Smith",
      orderStatus: "Delivered",
      netAmount: 800,
      discount: 100,
      advance: 500,
      balance: 200,
      expDelivery: "2025-09-25",
      filterMob: "9123456780",
      orderDate: "2025-09-10",
      deliveryDate: "2025-09-25",
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
      <h2 className="text-2xl sm:text-3xl font-poppins mb-6">Process Orders</h2>

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
            <option value="Completed">Deliverd</option>
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
        <table className="w-full border-separate text-sm" style={{ borderSpacing: "0 12px" }}>
          <thead>
            <tr className="bg-[#000000C2] text-left text-white uppercase text-sm sm:text-1xl font-poppins">
              <th className="px-4 py-3">Order Status</th>
              <th className="px-4 py-3">UHD</th>
              <th className="px-4 py-3">Patient Name</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Net Amount</th>
              <th className="px-4 py-3">Discount</th>
              <th className="px-4 py-3">Advance</th>
              <th className="px-4 py-3">Balance</th>
              <th className="px-4 py-3">Exp. Delivery</th>
              <th className="px-4 py-3">Filter Mob.</th>
              <th className="px-4 py-3">Order Date</th>
              <th className="px-4 py-3">Delivery Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b bg-[#FBBC04B8] hover:bg-gray-50 mb-2"
              >
                <td className="px-2 sm:px-4 py-2">{order.status}</td>
                <td className="px-2 sm:px-4 py-2">{order.uhd}</td>
                <td className="px-2 sm:px-4 py-2">{order.patientName}</td>
                <td className="px-2 sm:px-4 py-2">{order.orderStatus}</td>
                <td className="px-2 sm:px-4 py-2">{order.netAmount}</td>
                <td className="px-2 sm:px-4 py-2">{order.discount}</td>
                <td className="px-2 sm:px-4 py-2">{order.advance}</td>
                <td className="px-2 sm:px-4 py-2">{order.balance}</td>
                <td className="px-2 sm:px-4 py-2">{order.expDelivery}</td>
                <td className="px-2 sm:px-4 py-2">{order.filterMob}</td>
                <td className="px-2 sm:px-4 py-2">{order.orderDate}</td>
                <td className="px-2 sm:px-4 py-2">{order.deliveryDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
