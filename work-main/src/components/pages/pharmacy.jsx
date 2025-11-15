
    import React, { useState, useRef, useEffect } from "react";
import { Eye, Printer } from "lucide-react"; // ⬅️ Import icons
import { Edit, Trash2 } from "lucide-react";


const Pharmacy = () => {
  const [activePage, setActivePage] = useState("PharmacyMenu"); // top-level pages
  const [activeSection, setActiveSection] = useState("View Prescription"); // pharmacy menu sections
  const [triangleLeft, setTriangleLeft] = useState(0);
  const [isPopping, setIsPopping] = useState(false);
  const buttonRefs = useRef({});

  const sections = [
    { name: "View Prescription" },
    { name: "View Unpaid" },
    { name: "Add Medicines" },
    { name: "View Medicines" },
  ];

  // Reposition triangle under active button
  useEffect(() => {
    if (
      activePage === "PharmacyMenu" &&
      activeSection &&
      buttonRefs.current[activeSection]
    ) {
      const btn = buttonRefs.current[activeSection];
      const rect = btn.getBoundingClientRect();
      const parentRect = btn.parentElement.getBoundingClientRect();

      setTriangleLeft(rect.left - parentRect.left + rect.width / 2 - 16);

      setIsPopping(true);
      const timeout = setTimeout(() => setIsPopping(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [activeSection, activePage]);

  // Table configs with different Actions
  const tableConfigs = {
    "View Prescription": {
      headers: [
        "Prescription ID",
        "Patient Name",
        "Doctor Name",
        "Date",
        "Status",
        "Action",
      ],
      rows: [
        {
          id: "P-001",
          patient: "John Doe",
          doctor: "Dr. Smith",
          date: "24.06.25",
          status: "Delivered",
        },
        {
          id: "P-002",
          patient: "Jane Roe",
          doctor: "Dr. Adams",
          date: "25.06.25",
          status: "Pending",
        },
      ],
      actions: [
        {
          label: "View",
          style: "bg-[#CBDCEB]",
          text: "black",
          icon: <Eye size={16} />,
        },
        {
          label: "Print Bill",
          style: "bg-[#CBDCEB]",
          text: "black",
          icon: <Printer size={16} />,
        },
      ],
    },

    "View Unpaid": {
      headers: [
        "Bill No",
        "Patient Name",
        "Prescription ID",
        "Amount",
        "Date",
        "Status",
        "Action",
      ],
      rows: [
        {
          bill: "B-101",
          patient: "Alice",
          prescription: "P-001",
          amount: "₹1200",
          date: "2025-09-15",
          status: "Unpaid",
        },
      ],
      actions: [
        { label: "Pay ",style:"border border-black" },
        { label: "Send Reminder", style: "border border-black" },
      ],
    },

    "Add Medicines": {
      headers: [
        "Medicine Name",
        "Brand",
        "Quantity",
        "Unit Price",
        "Expire Date",
        "Type",
        "Action",
      ],
      rows: [
        {
          name: "Paracetamol",
          brand: "Cipla",
          qty: "50",
          price: "₹2",
          expiry: "2026-01-01",
          type: "Tablet",
        },
      ],
     actions: [
  { 
     
    text:"blue-600",
    icon: <Edit size={16} /> 
  },
  { 
    text:"red-600",
    icon: <Trash2 size={16} /> 
  },
],

    },

    "View Medicines": {
      headers: [
        "Medicine Name",
        "Brand",
        "Quantity",
        "Unit Price",
        "Expire Date",
        "Type",
        "Action",
      ],
      rows: [
        {
          name: "Vitamin C",
          brand: "Himalaya",
          qty: "200",
          price: "₹1.5",
          expiry: "2027-03-01",
          type: "Tablet",
        },
      ],
      actions: [
        { label: "Save", style: "border border-black" },
        { label: "Clear", style: "border border-black" },
      ],
    },
  };

  const config = tableConfigs[activeSection];

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-poppins">
      {/* Top Navigation Buttons */}
      <div className="flex justify-center gap-24 mb-8">
        <button
          onClick={() => setActivePage("PharmacyMenu")}
          className={`px-6 py-3 rounded-lg font-poppins text-3xl ${
            activePage === "PharmacyMenu"
              ? "bg-[#6D94C5] text-black"
              : "bg-[#CBDCEB] text-black hover:bg-[#6D94C5]"
          }`}
        >
          Pharmacy Menu
        </button>

        <button
          onClick={() => setActivePage("NonMoving")}
          className={`px-6 py-3 rounded-lg font-poppins text-3xl ${
            activePage === "NonMoving"
              ? "bg-[#6D94C5] text-black"
              : "bg-[#CBDCEB] text-black hover:bg-[#6D94C5]"
          }`}
        >
          Non Moving Medicine
        </button>

        <button
          onClick={() => setActivePage("Expire")}
          className={`px-6 py-3 rounded-lg font-poppins text-3xl ${
            activePage === "Expire"
              ? "bg-[#6D94C5] text-black"
              : "bg-[#CBDCEB] text-black hover:bg-[#6D94C5]"
          }`}
        >
          Expire Medicine
        </button>
      </div>

      {/* Page Content */}
      {activePage === "PharmacyMenu" && (
        <>
          {/* Menu Buttons */}
          <div className="flex justify-center gap-6 p-6 relative">
            {sections.map((section) => (
              <button
                key={section.name}
                ref={(el) => (buttonRefs.current[section.name] = el)}
                onClick={() => setActiveSection(section.name)}
                className={`px-6 py-3 rounded-lg font-poppins text-2xl transition-colors ${
                  activeSection === section.name
                    ? "bg-[#6D94C5] text-black"
                    : "bg-white text-black hover:bg-[#6D94C5]"
                }`}
              >
                {section.name}
              </button>
            ))}
          </div>

          {/* Table Section with Triangle */}
          <div className="relative">
            {/* Black Header Row */}
            <div
              className="grid gap-6 bg-black bg-opacity-90 px-10 py-6 border-b border-gray-200 text-lg font-poppins text-white rounded-t-md"
              style={{
                gridTemplateColumns: `repeat(${config.headers.length}, 1fr)`,
              }}
            >
              {config.headers.map((h) => (
                <div key={h}>{h}</div>
              ))}
            </div>

            {/* Triangle */}
            <div
              className="absolute -top-4 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[20px] border-b-black"
              style={{
                left: triangleLeft,
                transform: `scale(${isPopping ? 2.5 : 1})`,
                transformOrigin: "center bottom",
                transition: "all 0.3s ease",
              }}
            ></div>
          </div>
          
           {/* Rows */}
{config.rows.map((row, idx) => (
  <div
    key={idx}
    className={`grid gap-4 p-4 text-sm text-gray-700 items-center ${
      activeSection === "View Prescription"
        ? "mb-3 rounded-lg" // spacing between rows
        : "border-b border-gray-200"
    } ${
      row.status === "Delivered"
        ? "bg-green-300"
        : row.status === "Pending"
        ? "bg-yellow-300"
        : "bg-white"
    }`}
    style={{
      gridTemplateColumns: `repeat(${config.headers.length}, 1fr)`,
    }}
  >
    {/* Cells */}
    {Object.values(row).map((val, i) => (
      <div
        key={i}
        className={`text-center font-poppins ${
          activeSection === "View Prescription" ? "" : "border border-black rounded-lg p-2"
        }`}
      >
        {val}
      </div>
    ))}

    {/* Action buttons */}
    {config.headers.includes("Action") && (
      <div className="flex flex-col gap-2 items-center">
        {config.actions.map((action, i) => (
          <button
            key={i}
            className={`${action.style} text-${action.text} py-1 w-[120px] px-3 rounded-lg justify-center text-sm flex items-center gap-1`}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>
    )}
  </div>
))}

          
        </>
      )}

      {activePage === "NonMoving" && (
  <div className=" p-10 ">
    

    {/* Table */}
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        {/* Table Head */}
        <thead>
          <tr className="bg-black text-white text-left font-poppins rounded-lg text-1xl ">
            <th className="px-6 py-8">Med ID</th>
            <th className="px-6 py-3">Med Name</th>
            <th className="px-6 py-3">Batch No.</th>
            <th className="px-6 py-3">Stock</th>
            <th className="px-6 py-3">Last Issued</th>
             
            <th className="px-6 py-3">Supplier</th>
            <th className="px-6 py-3">Remarks</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {[
            {
              id: "NM001",
              name: "Ciprofloxacin 500mg",
              batch: "B2025D",
              stock: 40,
              issued: "01-08-2025",
              supplier: "HealthCare Ltd",
              remarks: "Non-moving > 45 days",
            },
            {
              id: "NM002",
              name: "Amoxicillin 250mg",
              batch: "B2024C",
              stock: 25,
              issued: "15-07-2025",
              supplier: "PharmaLife",
              remarks: "Non-moving > 60 days",
            },
             {
              id: "NM001",
              name: "Ciprofloxacin 500mg",
              batch: "B2025D",
              stock: 40,
              issued: "01-08-2025",
              supplier: "HealthCare Ltd",
              remarks: "Non-moving > 45 days",
            },
            {
              id: "NM002",
              name: "Amoxicillin 250mg",
              batch: "B2024C",
              stock: 25,
              issued: "15-07-2025",
              supplier: "PharmaLife",
              remarks: "Non-moving > 60 days",
            },
          ].map((med, idx) => (
            <tr
              key={idx}
              className="border-b-2 border-black h-[94px] hover:bg-gray-100 transition"
            >
              <td className="px-6 py-3">{med.id}</td>
              <td className="px-6 py-3 font-medium">{med.name}</td>
              <td className="px-6 py-3">{med.batch}</td>
              <td className="px-6 py-3">{med.stock}</td>
              <td className="px-6 py-3">{med.issued}</td>
              <td className="px-6 py-3">{med.supplier}</td>
              <td className="px-6 py-3">{med.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>

       {/* Print Button Below Table */}
  <div className="flex justify-end mt-4">
    <button className="bg-[#6D94C5] text-white py-2 px-4 rounded-md flex items-center gap-2 hover:bg-gray-900">
      <Printer size={16} />
      Print
    </button>
  </div>
    </div>
  </div>
)}


     {activePage === "Expire" && (
  <div className=" p-10 ">
    

    {/* Table */}
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        {/* Table Head */}
        <thead>
          <tr className="bg-black text-white text-left font-poppins rounded-lg text-1xl ">
            <th className="px-6 py-8">Med ID</th>
            <th className="px-6 py-3">Med Name</th>
            <th className="px-6 py-3">Batch No.</th>
            <th className="px-6 py-3">Stock</th>
            <th className="px-6 py-3">Expiry Date</th>
              <th className="px-6 py-3">Days To Expiry</th>
            <th className="px-6 py-3">Supplier</th>
            <th className="px-6 py-3">Remarks</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {[
            {
              id: "NM001",
              name: "Ciprofloxacin 500mg",
              batch: "B2025D",
              stock: 40,
              expired: "01-08-2025",
              last: "06-09-2025",
              supplier: "HealthCare Ltd",
              remarks: "Non-moving > 45 days",
            },
            {
              id: "NM002",
              name: "Amoxicillin 250mg",
              batch: "B2024C",
              stock: 25,
              expired: "01-08-2025",
              last: "06-09-2025",
              supplier: "PharmaLife",
              remarks: "Non-moving > 60 days",
            },
            {
              id: "NM001",
              name: "Ciprofloxacin 500mg",
              batch: "B2025D",
              stock: 40,
              expired: "01-08-2025",
              last: "06-09-2025",
              supplier: "HealthCare Ltd",
              remarks: "Non-moving > 45 days",
            },
            {
              id: "NM002",
              name: "Amoxicillin 250mg",
              batch: "B2024C",
              stock: 25,
              expired: "01-08-2025",
              last: "06-09-2025",
              supplier: "PharmaLife",
              remarks: "Non-moving > 60 days",
            },
          ].map((med, idx) => (
            <tr
              key={idx}
              className="border-b-2 border-black h-[94px] hover:bg-gray-100 transition"
            >
              <td className="px-6 py-3">{med.id}</td>
              <td className="px-6 py-3 font-medium">{med.name}</td>
              <td className="px-6 py-3">{med.batch}</td>
              <td className="px-6 py-3">{med.stock}</td>
              <td className="px-6 py-3">{med.expired}</td>
               <td className="px-6 py-3">{med.last}</td>
              <td className="px-6 py-3">{med.supplier}</td>
              <td className="px-6 py-3">{med.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Print Button Below Table */}
  <div className="flex justify-end mt-4">
    <button className="bg-[#6D94C5] text-white py-2 px-4 rounded-md flex items-center gap-2 hover:bg-gray-900">
      <Printer size={16} />
      Print
    </button>
  </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Pharmacy;
