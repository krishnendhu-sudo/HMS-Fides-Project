import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";

export default function Patients() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://127.0.0.1:8000/patients/", {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

        if (!res.ok) throw new Error("Failed to fetch patients");
        const data = await res.json();
        setPatients(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const handleEdit = (patient) => navigate("/add-patient", { state: { patient, mode: "edit" } });
  const handleView = (patient) => navigate("/add-patient", { state: { patient, mode: "view" } });

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/patients/${id}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

      if (!res.ok) throw new Error("Failed to delete patient");
      setPatients(patients.filter(p => p.id !== id));
      alert("Patient deleted successfully");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-poppins">Patient Table</h1>
        <button
          onClick={() => navigate("/add-patient")}
          className="bg-[#5A86C5] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium text-sm sm:text-base"
        >
          + ADD PATIENT
        </button>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-lg shadow">
        <table
          className="w-full text-center font-poppins text-sm sm:text-base md:text-lg lg:text-xl border-separate"
          style={{ borderSpacing: "0 12px" }}
        >
          <thead>
            <tr className="bg-gray-900 text-white">
              <th className="px-2 py-4 sm:px-4 sm:py-6">Patient ID</th>
              <th className="px-2 py-4 sm:px-4 sm:py-6">Company</th>
              <th className="px-2 py-4 sm:px-4 sm:py-6">Name</th>
              <th className="px-2 py-4 sm:px-4 sm:py-6">Gender</th>
              <th className="px-2 py-4 sm:px-4 sm:py-6">Age</th>
              <th className="px-2 py-4 sm:px-4 sm:py-6">Contact No.</th>
              <th className="px-2 py-4 sm:px-4 sm:py-6">Blood Group</th>
              <th className="px-2 py-4 sm:px-4 sm:py-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr
                key={p.id}
                className="bg-blue-100 border-b border-gray-200 text-sm sm:text-base md:text-lg"
              >
                <td className="px-2 py-4 sm:px-4 sm:py-6">{p.custom_id || p.id}</td>
                <td className="px-6 py-4">{p.company_name || "—"}</td>
                <td className="px-2 py-4 sm:px-4 sm:py-6">{p.name}</td>
                <td className="px-2 py-4 sm:px-4 sm:py-6">{p.gender}</td>
                <td className="px-2 py-4 sm:px-4 sm:py-6">{p.age}</td>
                <td className="px-2 py-4 sm:px-4 sm:py-6">{p.phone_number}</td>
                <td className="px-2 py-4 sm:px-4 sm:py-6">{p.blood_group}</td>
                <td className="px-2 py-3 sm:px-4 sm:py-6 flex justify-center gap-3">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleView(p)}
                    title="View"
                  >
                    <FaEye />
                  </button>
                  <button
                    className="text-green-500 hover:text-green-700"
                    onClick={() => handleEdit(p)}
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(p.id)}
                    title="Delete"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
