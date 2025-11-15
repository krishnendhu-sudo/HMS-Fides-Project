import React from "react";
import { FaUserMd, FaCalendarAlt } from "react-icons/fa";

const AddDoctorHeader = () => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 mb-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-400 pb-3 mb-2">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/icons/logo.png"
            alt="Clinic Logo"
            className="h-20 w-20 object-contain"
          />
          <div className="hidden md:block">
            <h1 className="text-lg font-bold text-gray-800 tracking-wide">
              Fides Eye Care Clinic
            </h1>
            <p className="text-sm text-gray-600">Committed to Better Vision</p>
          </div>
        </div>

        {/* Center: Heading */}
        <div className="text-center flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mt-4 md:mt-0">
            OP Reg / Consultation Bill
          </h2>
        </div>

        {/* Right: Address */}
        <div className="text-right md:w-1/3 text-sm leading-relaxed mt-4 md:mt-0">
          <p className="text-gray-800 font-semibold">1st Floor, Thekkekara Building</p>
          <p className="text-gray-700">Ollur, Thrissur</p>
          <p className="text-gray-700">Karnataka - 680306</p>
          <p className="text-gray-700">📞 8129072717</p>
          <p className="text-gray-700">✉️ fideseyecare@gmail.com</p>
        </div>
      </div>

      <hr className="border-gray-400 mb-4" />

      {/* Patient Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-3">
          <div>
            <label className="block text-gray-700 font-medium">MR Number:</label>
            <input
              type="number"
              placeholder="Enter MR No"
              className="w-2/3 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#7E4363] outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Patient Name:</label>
            <input
              type="text"
              placeholder="Enter Patient Name"
              className="w-2/3 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#7E4363] outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Doctor:</label>
            <div className="flex items-center gap-2 text-[#7E4363] font-semibold">
              <FaUserMd /> Dr. Maimunnisa M
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Patient Category:</label>
            <input
              type="text"
              placeholder="Enter Category"
              className="w-2/3 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#7E4363] outline-none"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <div>
            <label className="block text-gray-700 font-medium">Bill No:</label>
            <input
              type="number"
              placeholder="Enter Bill No"
              className="w-2/3 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#7E4363] outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Age & Sex:</label>
            <input
              type="text"
              placeholder="e.g. 25 / Female"
              className="w-2/3 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#7E4363] outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Token No:</label>
            <input
              type="number"
              placeholder="Enter Token No"
              className="w-2/3 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#7E4363] outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Date:</label>
            <div className="flex items-center gap-2 text-[#7E4363] font-semibold">
              <FaCalendarAlt /> 16/10/2025
            </div>
          </div>
        </div>
      </div>

      <hr className="mt-6 border-gray-400 mb-4" />

      {/* Description / Amount Section */}
      <div className="mt-4">
        <div className="flex justify-between font-semibold text-gray-800 border-b border-gray-300 pb-2 mb-2">
          <span>Description</span>
          <span>Amount (₹)</span>
        </div>

        <div className="flex justify-between py-1 text-gray-700">
          <span>Registration Fee</span>
          <span>1000.00</span>
        </div>

        <div className="flex justify-between py-1 text-gray-700">
          <span>Consultation Fee</span>
          <span>200.00</span>
        </div>

        <hr className="border-gray-400 my-4" />

        <div className="flex justify-end font-bold text-gray-900 text-lg">
          <span>Total: ₹1200.00</span>
        </div>
      </div>
    </div>
  );
};

export default AddDoctorHeader;
