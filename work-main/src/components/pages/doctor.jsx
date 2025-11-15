// src/components/DoctorManagement.jsx
import React, { useEffect, useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function DoctorManagement() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch doctors from FastAPI with token authentication
  const fetchDoctors = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch("http://127.0.0.1:8000/doctors/", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch doctors");

      const data = await response.json();
      setDoctors(data); // Backend should filter by company automatically
    } catch (err) {
      console.error("Error fetching doctors:", err);
      alert("❌ Failed to fetch doctors. Check login token.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // ✅ Toggle active status
  const toggleActive = async (doctor) => {
    const token = localStorage.getItem("token");
    const newStatus = !doctor.is_active;

    // Optimistic update
    setDoctors((prev) =>
      prev.map((d) => (d.id === doctor.id ? { ...d, is_active: newStatus } : d))
    );

    try {
      const updated = { ...doctor, is_active: newStatus };
      const res = await fetch(`http://127.0.0.1:8000/doctors/${doctor.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("Update failed");
    } catch (err) {
      console.error("Error updating status:", err);
      alert(" Failed to update status");
      // Revert on error
      setDoctors((prev) =>
        prev.map((d) =>
          d.id === doctor.id ? { ...d, is_active: doctor.is_active } : d
        )
      );
    }
  };

  // ✅ Delete doctor
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://127.0.0.1:8000/doctors/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Delete failed");
      alert("✅ Doctor deleted successfully!");
      setDoctors((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error(err);
      alert(" Failed to delete doctor");
    }
  };

  if (loading) return <p className="text-center py-10">Loading doctors...</p>;

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center border-b pb-2 mb-4">
        <h1 className="text-3xl sm:text-4xl font-poppins">Doctors</h1>
        <button
          onClick={() => navigate("/doctors/add")}
          className="mt-2 sm:mt-0 px-4 py-2 bg-[#2FD770] text-white rounded hover:bg-green-600"
        >
          Add New Doctor
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto py-10">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-[#F7DACD]  h-20 font-poppins">
            <tr>
              <th className="text-left p-3 border-b">ID</th>
              <th className="text-left p-3 border-b">Name</th>
              <th className="text-left p-3 border-b">Company</th>
              <th className="text-left p-3 border-b">Department</th>
              <th className="text-left p-3 border-b">Phone</th>
              <th className="text-center p-3 border-b">Active</th>
              <th className="text-center p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-5">
                  No doctors found.
                </td>
              </tr>
            ) : (
              doctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{doc.id}</td>
                  <td className="p-3 border-b">{doc.user?.name || doc.name}</td>
                  <td className="p-3 border-b">{doc.company?.name || "N/A"}</td>
                  <td className="p-3 border-b">
                    {doc.specialization || "N/A"}
                  </td>
                  <td className="p-3 border-b">{doc.user?.phone || doc.phone}</td>

                  {/* Active toggle */}
                  <td className="p-3 border-b text-center">
                    <div className="flex justify-center">
                      <div
                        onClick={() => toggleActive(doc)}
                        className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                          doc.is_active ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ease-in-out ${
                            doc.is_active ? "translate-x-7" : "translate-x-0"
                          }`}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Action buttons */}
                  <td className="p-6 border-b text-center flex justify-center gap-2">
                    <button
                      className="bg-blue-100 text-blue-600 p-2 rounded hover:bg-blue-200"
                      onClick={() => navigate(`/doctors/view/${doc.id}`)}
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="bg-yellow-100 text-yellow-600 p-2 rounded hover:bg-yellow-200"
                      onClick={() => navigate(`/doctors/edit/${doc.id}`)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200"
                      onClick={() => handleDelete(doc.id)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}