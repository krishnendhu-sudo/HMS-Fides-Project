import React from "react";

const ViewUnpaid = () => {
  const unpaidBills = [
    {
      billNo: "B-1001",
      patient: "John Doe",
      prescriptionId: "P-001",
      amount: "₹1,250",
      date: "2025-09-15",
      status: "Unpaid",
    },
    {
      billNo: "B-1002",
      patient: "Jane Roe",
      prescriptionId: "P-002",
      amount: "₹980",
      date: "2025-09-16",
      status: "Unpaid",
    },
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">View Unpaid Bills</h1>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-7 gap-4 bg-gray-100 p-4 border-b border-gray-200 text-sm font-semibold text-gray-700">
          <div>Bill No</div>
          <div>Patient Name</div>
          <div>Prescription ID</div>
          <div>Amount</div>
          <div>Date</div>
          <div>Status</div>
          <div>Action</div>
        </div>

        {/* Table Rows */}
        {unpaidBills.map((bill) => (
          <div
            key={bill.billNo}
            className="grid grid-cols-7 gap-4 p-4 border-b border-gray-200 text-sm text-gray-700 items-center hover:bg-gray-50"
          >
            <div className="font-medium text-blue-600">{bill.billNo}</div>
            <div>{bill.patient}</div>
            <div>{bill.prescriptionId}</div>
            <div className="font-semibold">{bill.amount}</div>
            <div>{bill.date}</div>
            <div className="text-red-600 font-medium">{bill.status}</div>
            <div className="flex flex-col gap-2">
              <button className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-md text-sm">
                Pay Now
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md text-sm">
                Generate Invoice
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewUnpaid;
