import { useState } from "react";
import NewOrder from "../pages/sections/NewOrder";
import ProcessOrder from "../pages/sections/ProcessOrder";
import ProductEnquiry from "../pages/sections/ProductEnquiry";

export default function Orders() {
  const [activeTab, setActiveTab] = useState("new");
  const [showModal, setShowModal] = useState(false);
  const [doctorSearch, setDoctorSearch] = useState("");

  const tabs = [
    { key: "new", label: "New Order" },
    { key: "process", label: "Process Order" },
    { key: "enquiry", label: "Product Enquiry" },
  ];

  return (
    <div className="p-4 sm:p-8 bg-white min-h-screen">
      {/* Top Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Optical / Place Order</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 sm:gap-12 border-gray-300 pb-4 sm:pb-6 sticky top-0 bg-white z-10 p-4 sm:p-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-10 py-2 rounded-full font-poppins text-sm sm:text-lg transition-all ${
              activeTab === tab.key
                ? "bg-green-600 text-white"
                : "bg-green-300 text-gray-700"
            }`}
          >
            <span
              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                activeTab === tab.key
                  ? "bg-white border-white"
                  : "bg-transparent border-gray-600"
              }`}
            ></span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* View Prescription Button */}
      <div className="flex justify-end mr-0 sm:mr-4 mt-4 sm:mt-0">
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#6D94C5] text-white px-4 py-2 rounded-full font-bold hover:bg-blue-700"
        >
          View Prescription
        </button>
      </div>

      {/* Content Section */}
      <div className="mt-6">
        {activeTab === "new" && <NewOrder />}
        {activeTab === "process" && <ProcessOrder />}
        {activeTab === "enquiry" && <ProductEnquiry />}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-3xl relative overflow-auto">
            <h3 className="text-lg sm:text-xl font-bold mb-4">Doctor Prescription Record</h3>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              {/* Doctor Search */}
              <div className="flex flex-col flex-1 min-w-[180px]">
                <label className="font-poppins mb-1">Patient</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Doctor..."
                    className="border p-2 rounded-full pl-10 w-full"
                    value={doctorSearch}
                    onChange={(e) => setDoctorSearch(e.target.value)}
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400 text-sm sm:text-base">🔍</span>
                </div>
              </div>

              {/* From Date */}
              <div className="flex flex-col flex-1 min-w-[140px]">
                <label className="font-poppins mb-1">From Date</label>
                <input type="date" className="border p-2 rounded-full w-full" />
              </div>

              {/* To Date */}
              <div className="flex flex-col flex-1 min-w-[140px]">
                <label className="font-poppins mb-1">To Date</label>
                <input type="date" className="border p-2 rounded-full w-full" />
              </div>

              {/* Search Button */}
              <div className="flex flex-col flex-1 justify-end min-w-[120px]">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-full mt-2 sm:mt-6 w-full sm:w-auto">
                  Search
                </button>
              </div>
            </div>

            {/* Cancel Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 font-bold text-lg sm:text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
