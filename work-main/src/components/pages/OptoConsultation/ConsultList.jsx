import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { FaEdit, FaEye } from "react-icons/fa";
import OptoProfile from "./OptoProfile";

export default function DoctorWaitingList() {
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [optometryRecords, setOptometryRecords] = useState([]);
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

  const cards = [
    { count: cardCounts["READY TO SEE"], label: "READY TO SEE", color: "bg-[#D8434F9E]" },
    { count: cardCounts["AT AR ROOM"], label: "AT AR ROOM", color: "bg-[#0A62B96B]" },
    { count: cardCounts["DILATATION"], label: "DILATATION", color: "bg-[#EFB2319E]" },
    { count: cardCounts["RE REFRACTION"], label: "RE REFRACTION", color: "bg-[#15868A9E]" },
    { count: cardCounts["COUNSELLING"], label: "COUNSELLING", color: "bg-[#642D489E]" },
    { count: cardCounts["CONSULTED"], label: "CONSULTED", color: "bg-[#DD135D9E]" },
  ];

  const tableHeaders = [
    "OP Number",
    "Patient Name",
    "Age",
    "Sex",
    "Visit Date",
    "Type",
    "Fee",
    "Doctor ID",
    "Billing Type",
    "Actions",
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch appointments
        const appointmentsRes = await fetch(`${API_BASE}/appointments/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const appointmentsText = await appointmentsRes.text();
        if (!appointmentsRes.ok) throw new Error(`HTTP ${appointmentsRes.status}: ${appointmentsText}`);
        const appointmentsData = JSON.parse(appointmentsText);
        const appointmentsList = Array.isArray(appointmentsData) ? appointmentsData : [];
        setAppointments(appointmentsList);

        // Fetch optometry records
        const optometryRes = await fetch(`${API_BASE}/optometrys/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (optometryRes.ok) {
          const optometryData = await optometryRes.json();
          const optometryList = Array.isArray(optometryData) ? optometryData : [];
          setOptometryRecords(optometryList);

          // Calculate counts
          // READY TO SEE = total appointments
          const readyToSeeCount = appointmentsList.length;

          // AT AR ROOM = appointments that have optometry records
          const appointmentIdsWithOptometry = new Set(
            optometryList.map((opt) => opt.appointment_id).filter((id) => id !== null && id !== undefined)
          );
          const atArRoomCount = appointmentIdsWithOptometry.size;

          setCardCounts({
            "READY TO SEE": readyToSeeCount,
            "AT AR ROOM": atArRoomCount,
            "DILATATION": 0,
            "RE REFRACTION": 0,
            "COUNSELLING": 0,
            "CONSULTED": 0,
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_BASE, token]);

  const latestAppointments = appointments.slice(0, 5);

  // Unified fetch & navigate handler
  const fetchAndNavigate = async (appointment, options = {}) => {
    const { viewOnly = false, createNew = false } = options;
    try {
      let appointmentData = { ...appointment };

      if (!createNew && appointment.optometryId) {
        const res = await fetch(`${API_BASE}/optometrys/${appointment.optometryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch optometry data");
        const optometryData = await res.json();
        appointmentData = { ...appointmentData, ...optometryData };
      }

      navigate(`/optometry/${appointment.id}`, {
        state: { appointment: appointmentData, viewOnly, createNew },
      });
    } catch (err) {
      console.error(err);
      alert("Failed to load optometry data");
    }
  };

  const handleView = (appointment) => fetchAndNavigate(appointment, { viewOnly: true });
  const handleEdit = (appointment) => fetchAndNavigate(appointment, { viewOnly: false });
  const handleAdd = (appointment) => fetchAndNavigate(appointment, { createNew: true });

  return (
    <div className="w-full relative min-h-screen bg-gray-100 p-10 flex flex-col items-center justify-start transition-all duration-300">
      {/* Top-right date inputs */}
      <div className="absolute top-4 mt-10 right-9 mr-36 flex gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-black">From Date</label>
          <input type="date" className="border border-gray-500 rounded-full px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-black">To Date</label>
          <input type="date" className="border border-gray-500 rounded-full px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-32 gap-10 justify-center">
        {cards.map((item, idx) => (
          <div
            key={idx}
            className={`relative ${item.color} rounded-xl flex flex-col items-center justify-center shadow-lg cursor-pointer transform hover:scale-105 transition w-[389px] h-[196px] max-w-full`}
            onClick={() => setShowTable(true)}
          >
            <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md">
              <ArrowUpRight className="w-6 h-6 text-black" />
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-black">{item.count}</p>
              <p className="text-3xl font-semibold">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Loading & Error */}
      {loading && <p className="mt-10 text-lg text-gray-600">Loading appointments...</p>}
      {error && <p className="mt-10 text-lg text-red-600">{error}</p>}

      {/* Table */}
      {showTable && !loading && !error && (
        <div className="overflow-x-auto w-full mt-10">
          <table className="w-full border-separate border-spacing-y-3 text-lg">
            <thead>
              <tr className="bg-gray-800 text-white">
                {tableHeaders.map((head, i) => (
                  <th key={i} className="px-6 py-4 text-left">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {latestAppointments.map((p, i) => (
                <tr key={i} className="bg-[#7E4363] text-white transition rounded-lg cursor-pointer">
                  <td className="px-6 py-4" onClick={() => setSelectedPatient(p)}>{p.custom_id || `APPT-${p.id}`}</td>
                  <td className="px-6 py-4" onClick={() => setSelectedPatient(p)}>{p.fullName}</td>
                  <td className="px-6 py-4" onClick={() => setSelectedPatient(p)}>{p.age}</td>
                  <td className="px-6 py-4" onClick={() => setSelectedPatient(p)}>{p.gender}</td>
                  <td className="px-6 py-4" onClick={() => setSelectedPatient(p)}>
                    {p.visitDate || p.visit_date
                      ? new Date(p.visitDate || p.visit_date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4" onClick={() => setSelectedPatient(p)}>{p.patient_type}</td>
                  <td className="px-6 py-4" onClick={() => setSelectedPatient(p)}>{p.consultationFee || 0}</td>
                  <td className="px-6 py-4" onClick={() => setSelectedPatient(p)}>{p.doctor_id || "-"}</td>
                  <td className="px-6 py-4" onClick={() => setSelectedPatient(p)}>{p.billingType || "-"}</td>

                  {/* Actions */}
                  <td className="px-6 py-4 flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800" onClick={() => handleView(p)}>
                      <FaEye title="View" />
                    </button>
                    <button className="text-green-600 hover:text-green-800" onClick={() => handleEdit(p)}>
                      <FaEdit title="Edit" />
                    </button>
                    <button className="text-yellow-600 hover:text-yellow-800 font-bold px-2 py-1 bg-white rounded" onClick={() => handleAdd(p)}>
                      ADD
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Popup Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md">
          <OptoProfile patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
        </div>
      )}
    </div>
  );
}
