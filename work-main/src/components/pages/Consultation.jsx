import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaUser,
  FaBriefcaseMedical,
  FaUsers,
} from "react-icons/fa";

export default function Consultation() {
  const [activeCard, setActiveCard] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [optometryData, setOptometryData] = useState([]);
  const [consultationData, setConsultationData] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cardCounts, setCardCounts] = useState({
    "READY TO SEE": 0,
    "AT AR ROOM": 0,
    "DILATATION": 0,
    "RE REFRACTION": 0,
    "COUNSELLING": 0,
    "CONSULTED": 0,
  });

  const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";
  const token = localStorage.getItem("token");

  const cardsData = [
    { id: 1, title: "READY TO SEE", count: cardCounts["READY TO SEE"], color: "bg-[#D8434F9E]" },
    { id: 2, title: "AT AR ROOM", count: cardCounts["AT AR ROOM"], color: "bg-[#0A62B96B]" },
    { id: 3, title: "DILATATION", count: cardCounts["DILATATION"], color: "bg-[#EFB2319E]" },
    { id: 4, title: "RE REFRACTION", count: cardCounts["RE REFRACTION"], color: "bg-[#15868A9E]" },
    { id: 5, title: "COUNSELLING", count: cardCounts["COUNSELLING"], color: "bg-[#642D489E]" },
    { id: 6, title: "CONSULTED", count: cardCounts["CONSULTED"], color: "bg-[#DD135D9E]" },
  ];

  const handleCardClick = (card) => {
    if (card.count > 0) {
      setActiveCard(activeCard === card.id ? null : card.id);
    }
  };

  const handleRowClick = (patient) => {
    setSelectedPatient(patient);
  };

  const closePatientCard = () => {
    setSelectedPatient(null);
  };

  const handleStartConsultation = () => {
    if (selectedPatient) {
      navigate("/reading", {
        state: {
          patient: selectedPatient,
          appointment: selectedPatient,
        },
      });
    } else {
      navigate("/reading");
    }
  };

  useEffect(() => {
    const fetchPatientsFromOptometry = async () => {
      setLoading(true);
      try {
        // 1️⃣ Fetch all optometry records
        const optoRes = await fetch(`${API_BASE}/optometrys/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!optoRes.ok) throw new Error("Failed to fetch optometry data");
        const optoData = await optoRes.json();
        const optoList = Array.isArray(optoData) ? optoData : [];

        // Update card counts - READY TO SEE = number of patients who have done optometry
        const uniquePatientIds = [...new Set(optoList.map((o) => o.patient_id).filter((id) => id !== null && id !== undefined))];
        const readyToSeeCount = uniquePatientIds.length;

        setCardCounts((prev) => ({
          ...prev,
          "READY TO SEE": readyToSeeCount,
        }));

        // 2️ Get unique patient IDs
        const patientIds = uniquePatientIds;

        // 3Fetch each patient's data
        const patientPromises = patientIds.map(async (id) => {
          const res = await fetch(`${API_BASE}/patients/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error(`Failed to fetch patient ${id}`);
          return res.json();
        });

        const patientData = await Promise.all(patientPromises);

        // 4️⃣ Merge with appointment/intime info if needed
        const combined = patientData.map((p) => {
          const optometryRecord = optoList.find((o) => o.patient_id === p.id);
          return {
            id: p.id,
            patient_id: p.id, // Add patient_id for optometry lookup
            op: `OP-${p.id}`,
            name: p.full_name || p.name,
            fullName: p.full_name || p.name, // Add fullName for Reading.jsx
            full_name: p.full_name || p.name,
            age: p.age || "-",
            sex: p.gender || "-",
            gender: p.gender || "-", // Add gender for Reading.jsx
            intime: "READY TO SEE", // You can map from optometry if available
            token: `T${p.id}`,
            type: "General",
            fee: p.fee || "₹0",
            scheme: p.scheme || "-",
            category: p.user_id,
            remark: optometryRecord?.remarks || "-",
            custom_id: p.custom_id || p.id, // Add custom_id for Reading.jsx
            patient_type: "GENERAL CONSULTATION", // Add patient_type for Reading.jsx
            appointment: optometryRecord ? { id: optometryRecord.appointment_id, doctor_id: optometryRecord.doctor_id } : null, // Add appointment info if available
          };
        });

        setPatients(combined);
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientsFromOptometry();
  }, [API_BASE, token]);

  return (
    <div className="p-4 sm:p-8 relative">
      <h2 className="text-xl sm:text-2xl font-poppins mb-6 sm:mb-10">
        DOCTOR / Waiting List
      </h2>

      {/* 🔹 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-14 justify-items-center">
        {cardsData.map((card) => (
          <div key={card.id} className="w-full">
            <div
              className={`relative w-full h-40 sm:h-48 p-6 rounded-xl shadow cursor-pointer text-center text-black ${card.color}`}
              onClick={() => handleCardClick(card)}
            >
              {/* Circle with Arrow */}
              <div className="absolute top-2 right-2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow-md">
                <FaArrowRight className="text-gray-700 text-xs sm:text-sm" />
              </div>

              {/* Card Content */}
              <h1 className="text-3xl sm:text-4xl font-bold mt-4 sm:mt-6">
                {card.count}
              </h1>
              <p className="mt-4 sm:mt-6 font-poppins text-xl sm:text-3xl">
                {card.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Table */}
      {activeCard && (
        <div className="mt-8 sm:mt-10 bg-white p-4 sm:p-8 relative overflow-x-auto rounded-lg">
          <table
            className="w-full min-w-[700px] border-separate text-xs sm:text-sm"
            style={{ borderSpacing: "0 12px" }}
          >
            <thead>
              <tr className="bg-[#000000C2] text-left text-white uppercase text-xs sm:text-base rounded-lg font-poppins h-12 sm:h-20">
                <th className="px-2 py-1">OP Number</th>
                <th className="px-2 py-1">Patient name</th>
                <th className="px-2 py-1">Age</th>
                <th className="px-2 py-1">Sex</th>
                <th className="px-2 py-1">In Time</th>
                <th className="px-2 py-1">Token Number</th>
                <th className="px-2 py-1">Type</th>
                <th className="px-2 py-1">Fee</th>
                <th className="px-2 py-1">Scheme</th>
                <th className="px-2 py-1">Category</th>
                <th className="px-2 py-1">Patient Remarks</th>
              </tr>
            </thead>
            <tbody>
              {loading && <p className="mt-6 text-gray-500">Loading patients...</p>}
{error && <p className="mt-6 text-red-500">Error: {error}</p>}

              {patients
                .filter(
                  (p) =>
                    p.intime === cardsData.find((c) => c.id === activeCard)?.title
                )
                .map((p) => (
                  <tr
                    key={p.id}
                    className="border-b bg-[#7E4363] hover:bg-gray-50 mb-2 h-16 sm:h-20 cursor-pointer"
                    onClick={() => handleRowClick(p)}
                  >
                    <td className="px-2 py-1">{p.op}</td>
                    <td className="px-2 py-1">{p.name}</td>
                    <td className="px-2 py-1">{p.age}</td>
                    <td className="px-2 py-1">{p.sex}</td>
                    <td className="px-2 py-1">{p.intime}</td>
                    <td className="px-2 py-1">{p.token}</td>
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

      {/* 🔹 Patient Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Background blur */}
          <div
            className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
            onClick={closePatientCard}
          ></div>

          {/* Modal Card */}
          <div className="relative bg-[#7E4363] rounded-xl shadow-lg w-full max-w-sm sm:max-w-md md:max-w-[400px] p-6 sm:p-10 flex flex-col items-center text-white">
            {/* Circle with image */}
            <div className="w-24 h-24 sm:w-40 sm:h-40 rounded-full bg-white flex items-center justify-center text-gray-700 text-4xl mb-4 overflow-hidden">
              <FaUser className="text-black text-4xl sm:text-5xl" />
            </div>

            {/* Patient Name */}
            <h2 className="text-base sm:text-lg font-poppins">
              {selectedPatient.name}
            </h2>
            <p className="text-xs sm:text-sm mt-1">
              {selectedPatient.age} Years
            </p>

            {/* Section Title */}
            <h3 className="uppercase text-sm sm:text-xl font-poppins mt-6 sm:mt-8 tracking-wide">
              General Consultation
            </h3>

            {/* ✅ Start Consultation Button */}
            <button
              onClick={handleStartConsultation}
              className="mt-4 w-full bg-white text-black rounded-full py-2 px-4 flex items-center justify-start space-x-3"
            >
              <FaBriefcaseMedical className="text-sm sm:text-lg" />
              <span className="font-poppins text-xs sm:text-base">
                Start Consultation
              </span>
            </button>

            <button className="mt-3 w-full bg-white text-black rounded-full py-2 px-4 flex items-center justify-start space-x-3">
              <FaUsers className="text-sm sm:text-lg" />
              <span className="font-poppins text-xs sm:text-base">
                Demographics
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
