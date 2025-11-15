import { useState, useEffect } from "react";
import RegistrationForm from "./sections/RegistrationForm";
import { FaEdit, FaTrash, FaSearch, FaEye } from "react-icons/fa";
import registrationIcon from "../../assets/registration.svg";
import historyIcon from "../../assets/history.svg";
import expectedIcon from "../../assets/expected.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Appointment() {
  const [activeTab, setActiveTab] = useState("registration");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [expectedPatients, setExpectedPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000";

  // Get user info from localStorage
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const companyId = localStorage.getItem("company_id");
  const loggedInUserId = parseInt(localStorage.getItem("user_id"));
  

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE}/doctors/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          if (res.status === 401) {
            setError("Session expired. Please log in again.");
            navigate("/login");
            return;
          }
          throw new Error("Failed to load doctors");
        }
        const data = await res.json();

        // Filter by company for non-super-admin users
        const filteredDoctors =
          role !== "super_admin" && companyId
            ? data.filter((d) => String(d.company_id) === String(companyId))
            : data;

        setDoctors(filteredDoctors);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError(err.message);
      }
    };
    fetchDoctors();
  }, [token, role, companyId, API_BASE, navigate]);

  
  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE}/appointments/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch appointments");

        const data = await res.json();

        // Add doctor_user_id mapping (from backend or nested user object)
        const mapped = data.map((appt) => ({
          ...appt,
          doctor_user_id: appt.doctor?.user?.id || appt.doctor_id,
          company_name: appt.company?.name || "N/A",
        }));

        // Filter appointments
        let filteredAppointments = mapped;
        if (role === "doctor") {
  filteredAppointments = mapped.filter(
    (a) => Number(a.doctor_user_id) === loggedInUserId
  );
}
console.log("Doctor logged in ID:", loggedInUserId);
console.log("Appointments doctor_user_id:", mapped.map(a => a.doctor_user_id));


        setAppointments(filteredAppointments);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [token, role, companyId, loggedInUserId, API_BASE]);

  // View/Edit/Delete
  const handleView = (appt) => navigate("/RegistrationForm", { state: { appointment: appt, mode: "view" } });
  const handleEdit = (appt) => navigate("/RegistrationForm", { state: { appointment: appt, mode: "edit" } });
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await axios.delete(`${API_BASE}/appointments/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      alert("Appointment deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete appointment");
    }
  };

  // Helpers
  const getDoctorName = (id) => {
    const doc = doctors.find((d) => d.id === id);
    return doc ? doc.user?.name || doc.name : "Unknown";
  };

  const formatDate = (d) => (d ? new Date(d).toISOString().split("T")[0] : "");

  const filterByDate = (data) => {
    return data.filter((appt) => {
      const apptDate = new Date(appt.visit_date || appt.registrationDate);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      if (from && apptDate < from) return false;
      if (to && apptDate > to) return false;
      return true;
    });
  };

  const handleSearch = () => {
    console.log("Search clicked:", { fromDate, toDate, searchQuery });
  };

  const renderTable = (data, highlightStatus) => (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 mb-4 w-full">
        <div className="flex-1">
          <label className="block text-sm mb-2 font-poppins">From Date</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border rounded-full px-5 py-3 w-full" />
        </div>
        <div className="flex-1">
          <label className="block text-sm mb-2 font-poppins">To Date</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border rounded-full px-5 py-3 w-full" />
        </div>
        <div className="flex items-end">
          <button type="button" onClick={handleSearch} className="flex items-center justify-center p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700">
            <FaSearch />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-separate" style={{ borderSpacing: "0 0.75rem" }}>
          <thead className="bg-gray-800 text-white rounded-lg text-1xl font-poppins">
            <tr>
              <th className="px-4 py-3">S. No.</th>
              <th className="px-4 py-3">Patient Name</th>
              <th className="px-4 py-3">Age</th>
              <th className="px-4 py-3">Gender</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Appointment Date</th>
              <th className="px-4 py-3">Doctor</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filterByDate(data).length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-8 text-gray-500">
                  No appointments found
                </td>
              </tr>
            ) : (
              filterByDate(data).map((appt, idx) => (
                <tr key={appt.id} style={{ backgroundColor: appt.paymentStatus === highlightStatus ? "#6EE7B7" : "#FCA5A5" }}>
                  <td className="px-4 py-3">{appt.id}</td>
                  <td className="px-4 py-3">{appt.fullName}</td>
                  <td className="px-4 py-3">{appt.age || "-"}</td>
                  <td className="px-4 py-3">{appt.gender}</td>
                  <td className="px-4 py-3">{appt.mobile || "-"}</td>
                  <td className="px-4 py-3">{formatDate(appt.visit_date || appt.registrationDate)}</td>
                  <td className="px-4 py-3">{getDoctorName(appt.doctor_id)}</td>
                  <td className="px-4 py-3">{appt.company_name}</td>
                  <td className="px-4 py-3">{appt.paymentStatus || "-"}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button className="text-blue-500 hover:text-blue-700" onClick={() => handleView(appt)} title="View"><FaEye size={16} /></button>
                    <button className="bg-black p-2 rounded text-white hover:bg-gray-800" onClick={() => handleEdit(appt)}><FaEdit size={12} /></button>
                    <button className="bg-red-600 p-2 rounded text-white hover:bg-red-700" onClick={() => handleDelete(appt.id)}><FaTrash size={12} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) return <div className="p-6 text-center">Loading appointments...</div>;
  if (error) return (
    <div className="p-6 text-center text-red-500">
      Error: {error}
      <button onClick={() => window.location.reload()} className="ml-4 px-4 py-2 bg-blue-600 text-white rounded">Retry</button>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl space-y-6 max-w-full">
      <div className="flex flex-col sm:flex-row justify-center gap-10 mb-8 flex-wrap">
        {[
          { key: "registration", label: "Registrations", icon: registrationIcon },
          { key: "history", label: "Appointment History", icon: historyIcon },
          { key: "expected", label: "Expected Patient List", icon: expectedIcon },
        ].map((tab) => (
          <button key={tab.key} className={`px-4 sm:px-6 py-3 rounded-md font-poppins flex items-center gap-2 text-base sm:text-2xl whitespace-nowrap ${activeTab === tab.key ? "bg-[#7E4363] text-white" : "border border-[#CBDCEB] text-gray-700"}`} onClick={() => setActiveTab(tab.key)}>
            <img src={tab.icon} alt={tab.label} className="w-5 h-5" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "registration" && <div className="rounded-xl p-4 sm:p-6 space-y-4 w-full"><RegistrationForm doctors={doctors} /></div>}
      {activeTab === "history" && <div className="p-4 sm:p-6 rounded-xl bg-white w-full">{renderTable(appointments, "PAID")}</div>}
      {activeTab === "expected" && <div className="p-4 sm:p-6 rounded-xl bg-white w-full">{renderTable(expectedPatients, "Expected")}</div>}
    </div>
  );
}
