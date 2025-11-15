import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiRefreshCw } from "react-icons/fi";

const CaseHistory = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = location.state || {};
  const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";
  const token = localStorage.getItem("token");

  const [patientData, setPatientData] = useState(null);
  const [caseHistoryData, setCaseHistoryData] = useState(null);
  const [doctorName, setDoctorName] = useState("-");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    { label: "Readings", path: "/Reading" },
    { label: "Examination", path: "/examinationDoc" },
    { label: "Case History", path: "/CaseHistory" },
    { label: "Draw", path: "/Draw" },
  ];

  useEffect(() => {
    const fetchCaseHistory = async () => {
      setLoading(true);
      setError(null);

      if (!token) {
        setError("Authentication token not found");
        setLoading(false);
        return;
      }

      try {
        const appointmentInfo = navState.appointment;
        if (!appointmentInfo?.id) throw new Error("No appointment data provided");

        // Fetch all optometry records
        const res = await fetch(`${API_BASE}/optometrys/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch optometry records");
        const allRecords = await res.json();

        // Filter by appointment ID
        const appointmentRecords = Array.isArray(allRecords)
          ? allRecords.filter(r => r.appointment_id === appointmentInfo.id)
          : [];

        // Get the latest record
        if (appointmentRecords.length > 0) {
          appointmentRecords.sort((a, b) => (b.id || 0) - (a.id || 0));
          setCaseHistoryData(appointmentRecords[0]);
        } else {
          setCaseHistoryData({}); // fallback
        }

        setPatientData(appointmentInfo);

        // Fetch doctor name
        if (appointmentInfo.doctor_id) {
          const doctorRes = await fetch(`${API_BASE}/doctors/${appointmentInfo.doctor_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (doctorRes.ok) {
            const doctorData = await doctorRes.json();
            setDoctorName(doctorData.full_name || doctorData.name || "-");
          }
        }

      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch case history");
      } finally {
        setLoading(false);
      }
    };

    fetchCaseHistory();
  }, [location.state, token]);

  return (
    <div className="max-w-8xl mx-auto p-6 space-y-6">
      {/* Heading */}
      <h2 className="text-4xl md:text-3xl font-bold text-[#14416D]">Case History</h2>

      {/* Loading & Error */}
      {loading && (
        <div className="text-blue-600 font-semibold flex items-center gap-2">
          Loading patient data... <FiRefreshCw className="animate-spin" />
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Patient Card */}
      {patientData && (
        <div className="bg-[#F7DACD] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 font-medium text-2xl w-full md:w-2/3">
            <p><span className="font-bold">Name:</span> {patientData.fullName || patientData.full_name || patientData.name || "-"}</p>
            <p><span className="font-bold">Age:</span> {patientData.age || "-"} YEARS</p>
            <p><span className="font-bold">Gender:</span> {patientData.gender || "-"}</p>
            <p><span className="font-bold">MR Number:</span> {patientData.custom_id || patientData.id || "-"}</p>
            <p><span className="font-bold">Visit Date:</span> {patientData.visitDate || patientData.visit_date ? new Date(patientData.visitDate || patientData.visit_date).toLocaleDateString() : "-"}</p>
            <p><span className="font-bold">Visit Type:</span> {patientData.patient_type || "GENERAL CONSULTATION"}</p>
            <p><span className="font-bold">Doctor:</span> {doctorName}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex justify-start space-x-4">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <p
              key={tab.label}
              onClick={() => navigate(tab.path, { state: navState })}
              className={`border px-8 py-2 rounded-full font-bold text-2xl cursor-pointer transition
                ${isActive ? "bg-[#F7DACD] " : "hover:bg-[#F7DACD] "}`}
            >
              {tab.label}
            </p>
          );
        })}
      </div>

      {/* Case History Details */}
      <div className="p-6 bg-[#F7DACD] rounded-2xl shadow-md space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Complaints</h3>
          <textarea
            rows={6}
            value={caseHistoryData?.presenting_complaints || ""}
            readOnly
            className="w-full border rounded-lg p-3 bg-gray-100 text-gray-700"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Case History</h3>
          <textarea
            rows={6}
            value={caseHistoryData?.case_history || ""}
            readOnly
            className="w-full border rounded-lg p-3 bg-gray-100 text-gray-700"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Allergies</h3>
          <textarea
            rows={6}
            value={caseHistoryData?.allergies || ""}
            readOnly
            className="w-full border rounded-lg p-3 bg-gray-100 text-gray-700"
          />
        </div>

        {onClose && (
          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseHistory;
