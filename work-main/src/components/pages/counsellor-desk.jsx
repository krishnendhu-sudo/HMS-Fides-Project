import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";

const cardsData = [
  { id: 1, title: "READY TO SEE", count: 1, color: "bg-[#D8434F9E]" },
  { id: 2, title: "AT AR ROOM", count: 0, color: "bg-[#0A62B96B]" },
  { id: 3, title: "DILATATION", count: 0, color: "bg-[#EFB2319E]" },
  { id: 4, title: "RE REFRACTION", count: 0, color: "bg-[#15868A9E]" },
  { id: 5, title: "COUNSELLING", count: 0, color: "bg-[#642D489E]" },
  { id: 6, title: "CONSULTED", count: 0, color: "bg-[#DD135D9E]" },
];

const patientDetails = [
  {
    id: 1,
    op: "P001",
    name: "John Doe",
    age: 35,
    sex: "Male",
    intime: "READY TO SEE",
    token: "T01",
    waiting: "5 min",
    type: "General",
    fee: "₹500",
    scheme: "Insurance",
    category: "Normal",
    remark: "First visit",
  },
  {
    id: 2,
    op: "P002",
    name: "Jane Smith",
    age: 29,
    sex: "Female",
    intime: "READY TO SEE",
    token: "T02",
    waiting: "10 min",
    type: "Emergency",
    fee: "₹800",
    scheme: "Cash",
    category: "Urgent",
    remark: "Follow-up",
  },
];

export default function Counsellordesk() {
  const [activeCard, setActiveCard] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchName, setSearchName] = useState("");
  const [procedureFilter, setProcedureFilter] = useState("All");

  const handleCardClick = (card) => {
    if (card.count > 0) {
      setActiveCard(activeCard === card.id ? null : card.id);
    }
  };

  const handleSearch = () => {
    console.log("Searching:", { fromDate, toDate, searchName, procedureFilter });
    // Add search/filter logic here
  };

  const procedureOptions = ["All", "Procedure", "Surgery"];

  return (
    <div className="p-8">
      {/* 🔹 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-14 justify-items-center">
        {cardsData.map((card) => (
          <div key={card.id} className="w-full">
            <div
              className={`relative w-85 h-48 p-6 rounded-xl shadow cursor-pointer text-center text-black ${card.color}`}
              onClick={() => handleCardClick(card)}
            >
              <div className="absolute top-2 right-2 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md">
                <FaArrowRight className="text-gray-700 text-sm" />
              </div>

              <h1 className="text-4xl font-bold mt-6">{card.count}</h1>
              <p className="mt-6 font-poppins text-3xl">{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Filter Row */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-6 gap-6 items-end">
        <div>
          <label className="block text-sm font-poppins mb-1">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full border rounded-full p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-poppins mb-1">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full border rounded-full p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-poppins mb-1">Patient Name</label>
          <input
            type="text"
            placeholder="Search patient"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full border rounded-full p-2"
          />
        </div>

        {/* 🔹 Procedure / Surgery Buttons */}
        <div className="flex gap-6 col-span-2">
          {procedureOptions.map((option) => (
            <button
              key={option}
              onClick={() => setProcedureFilter(option)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm ${
                procedureFilter === option ? "bg-[#48D56D8F] text-white" : "bg-[#48D56D8F] text-gray-700"
              }`}
            >
              <span
                className={`w-3 h-3 rounded-full ${
                  option === "Procedure"
                    ? "bg-white"
                    : option === "Surgery"
                    ? "bg-white"
                    : "bg-white"
                }`}
              ></span>
              {option}
            </button>
          ))}
        </div>

        <div>
          <button
            onClick={handleSearch}
            className="w-full bg-green-500 text-white font-semibold p-2 rounded-lg hover:bg-green-600 transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* 🔹 Show table BELOW all cards */}
      {activeCard && (
        <div className="mt-10 bg-white p-8">
          <table
            className="w-full h-40 border-separate text-sm"
            style={{ borderSpacing: "0 12px" }}
          >
            <thead>
              <tr className="bg-[#000000C2] text-left text-white uppercase text-1xl rounded-lg font-poppins h-20">
                <th className="px-2 py-1">OP Number</th>
                <th className="px-2 py-1">Patient name</th>
                <th className="px-2 py-1">Age</th>
                <th className="px-2 py-1">Sex</th>
                <th className="px-2 py-1">In Time</th>
                <th className="px-2 py-1">Token Number</th>
                <th className="px-2 py-1">Waiting Time</th>
                <th className="px-2 py-1">Type</th>
                <th className="px-2 py-1">Fee</th>
                <th className="px-2 py-1">Scheme</th>
                <th className="px-2 py-1">Category</th>
                <th className="px-2 py-1">Patient Remarks</th>
              </tr>
            </thead>
            <tbody>
              {patientDetails
                .filter(
                  (p) =>
                    p.intime ===
                    cardsData.find((c) => c.id === activeCard)?.title
                )
                .map((p) => (
                  <tr
                    key={p.id}
                    className="border-b bg-[#6D94C5] hover:bg-gray-50 mb-2 h-20"
                  >
                    <td className="px-2 py-1">{p.op}</td>
                    <td className="px-2 py-1">{p.name}</td>
                    <td className="px-2 py-1">{p.age}</td>
                    <td className="px-2 py-1">{p.sex}</td>
                    <td className="px-2 py-1">{p.intime}</td>
                    <td className="px-2 py-1">{p.token}</td>
                    <td className="px-2 py-1">{p.waiting}</td>
                    <td className="px-2 py-1">{p.type}</td>
                    <td className="px-2 py-1">{p.fee}</td>
                    <td className="px-2 py-1">{p.scheme}</td>
                    <td className="px-2 py-1">{p.category}</td>
                    <td className="px-2 py-1">{p.remark}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
